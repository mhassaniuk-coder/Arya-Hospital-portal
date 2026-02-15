import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { ChatMessage, AIAnalysisResult, User, Appointment, LabResult, Medication, Bill } from '../types';

const API_KEY = process.env.API_KEY || '';

class GeminiService {
  private ai: GoogleGenAI;
  private modelId = 'gemini-3-flash-preview';

  // Live API State
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private inputProcessor: ScriptProcessorNode | null = null;
  private nextStartTime = 0;
  private sessionPromise: Promise<any> | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  // --- EXISTING TEXT CHAT ---

  async *streamChat(
    history: ChatMessage[], 
    newMessage: string, 
    context: { 
      user: User, 
      appointments: Appointment[], 
      labResults: LabResult[],
      medications: Medication[],
      bills: Bill[] 
    }
  ): AsyncGenerator<string, void, unknown> {
    try {
      const validHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      // Only pass sensitive data if verified
      const safeAppointments = context.user.isVerified ? context.appointments : [];
      const safeLabResults = context.user.isVerified ? context.labResults : [];
      const safeMedications = context.user.isVerified ? context.medications : [];
      const safeBills = context.user.isVerified ? context.bills : [];

      const contextStr = JSON.stringify({
        user: context.user,
        appointments: safeAppointments.map(a => ({...a, id: a.id, doctor: a.doctorName, date: a.date})),
        labResults: safeLabResults,
        medications: safeMedications,
        bills: safeBills
      });

      const systemInstruction = `You are Arya, the Advanced Hospital AI.
          
          USER VERIFICATION STATUS: ${context.user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
          
          IF UNVERIFIED:
          - You cannot access detailed medical records, appointments, or prescriptions.
          - If the user asks for these, politely explain they need to complete verification on the dashboard first.
          - You CAN still answer general health questions, explain terms, and triage symptoms.
          
          CONTEXT DATA: ${contextStr}

          YOUR 25 ADVANCED FEATURES:
          (See full list in docs... same as before)

          CORE PROTOCOL: "CONFIRM THEN PROCEED"
          1. **Understand**: Identify the user's intent.
          2. **Propose & Confirm**: specialized actions require confirmation.
          3. **Execute**: Output JSON command + conversational text.

          OUTPUT FORMAT:
          [Conversational confirmation message]
          ||JSON||{ "action": ... }||JSON||
          
          COMMAND FORMATS:
          1. NAVIGATION: ||JSON||{"action": "NAVIGATE", "target": "view_name"}||JSON||
          2. CREATE APPOINTMENT: ||JSON||{ "action": "CREATE_APPOINTMENT", "data": { ... } }||JSON||
          3. REFILL MEDICATION: ||JSON||{ "action": "REFILL_MEDICATION", "medicationId": "id", "medicationName": "name" }||JSON||
          4. PAY BILL: ||JSON||{ "action": "PAY_BILL", "billId": "id", "amount": 100 }||JSON||
          5. EMERGENCY ALERT: ||JSON||{ "action": "EMERGENCY_ALERT", "reason": "Chest pain" }||JSON||
          6. CONTACT DOCTOR: ||JSON||{ "action": "CONTACT_DOCTOR", "doctorName": "name", "message": "draft" }||JSON||
          
          Always ensure you say something to the user outside the JSON block.`;

      const chat = this.ai.chats.create({
        model: this.modelId,
        config: { systemInstruction },
        history: validHistory,
      });

      const result = await chat.sendMessageStream({ message: newMessage });
      for await (const chunk of result) {
        if (chunk.text) yield chunk.text;
      }
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      yield "I'm having trouble connecting to the hospital network right now. Please try again in a moment.";
    }
  }

  async generateHealthSummary(metrics: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `Summarize health status from these metrics in less than 10 words: ${metrics}`,
      });
      return response.text || "Vitals stable.";
    } catch (error) {
        return "Summary unavailable.";
    }
  }

  async analyzeSymptoms(symptoms: string): Promise<AIAnalysisResult> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `Analyze symptoms: "${symptoms}". Return JSON with specialty, urgency, reasoning, prepTips, suggestedDoctorType, questionsToAsk, telehealthScore (0-100), estimatedDuration.`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || "{}";
      return JSON.parse(text) as AIAnalysisResult;
    } catch (error) {
      return {
        specialty: "General Practice",
        urgency: "Low",
        reasoning: "Consultation recommended.",
        suggestedDoctorType: "General Practitioner",
        prepTips: ["Bring ID"],
        questionsToAsk: ["Cause?"],
        telehealthScore: 50,
        estimatedDuration: "20 mins"
      };
    }
  }

  // --- LIVE VOICE API ---

  async startLiveSession(
    context: { user: User, appointments: Appointment[], labResults: LabResult[], medications: Medication[], bills: Bill[] },
    onTranscript: (text: string, isUser: boolean, isFinal: boolean) => void,
    onAudioLevel: (level: number) => void,
    onClose: () => void
  ) {
    this.nextStartTime = 0;
    
    // 1. Initialize Audio Contexts
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    // 2. Connect to Gemini Live
    const contextStr = JSON.stringify(context);
    
    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      config: {
        systemInstruction: `You are Arya, a friendly and empathetic medical assistant. 
        USER IS ${context.user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}. 
        Context: ${contextStr}. 
        
        PROTOCOL:
        - Be human-like, warm, and clear.
        - If unverified, kindly redirect them to the dashboard for verification before discussing sensitive records.
        - Always ask for confirmation before taking actions.
        `,
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        inputAudioTranscription: {}, // Empty object enables transcription
        outputAudioTranscription: {}, // Empty object enables transcription
      },
      callbacks: {
        onopen: async () => {
          console.log("Live Session Connected");
          if (this.sessionPromise) {
            await this.startAudioInput(this.sessionPromise);
          }
        },
        onmessage: async (message: LiveServerMessage) => {
          // Handle Audio Output
          const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData) {
             this.playAudioChunk(audioData, onAudioLevel);
          }

          // Handle Transcripts
          const outTranscript = message.serverContent?.outputTranscription;
          if (outTranscript?.text) {
             onTranscript(outTranscript.text, false, !!message.serverContent?.turnComplete);
          }
          const inTranscript = message.serverContent?.inputTranscription;
          if (inTranscript?.text) {
             onTranscript(inTranscript.text, true, !!message.serverContent?.turnComplete);
          }

          // Handle Interruptions
          if (message.serverContent?.interrupted) {
            this.nextStartTime = 0; // Reset audio queue
          }
        },
        onclose: () => {
          console.log("Live Session Closed");
          this.cleanupAudio();
          onClose();
        },
        onerror: (err) => {
          console.error("Live Session Error", err);
          this.cleanupAudio();
          onClose();
        }
      }
    });
  }

  async stopLiveSession() {
    if (this.sessionPromise) {
      try {
        const session = await this.sessionPromise;
        session.close();
      } catch (e) {
        console.error("Error closing session", e);
      }
      this.cleanupAudio();
      this.sessionPromise = null;
    }
  }

  private async startAudioInput(sessionPromise: Promise<any>) {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!this.inputAudioContext) return;

      const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.inputProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
      
      this.inputProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = this.floatTo16BitPCM(inputData);
        const base64 = this.arrayBufferToBase64(pcm16.buffer);

        sessionPromise.then(session => {
          session.sendRealtimeInput({
            media: {
              mimeType: 'audio/pcm;rate=16000',
              data: base64
            }
          });
        });
      };

      source.connect(this.inputProcessor);
      this.inputProcessor.connect(this.inputAudioContext.destination);
    } catch (e) {
      console.error("Mic Error", e);
    }
  }

  private async playAudioChunk(base64Audio: string, onAudioLevel: (level: number) => void) {
    if (!this.outputAudioContext) return;

    try {
      const arrayBuffer = this.base64ToArrayBuffer(base64Audio);
      const audioBuffer = await this.decodeAudioData(arrayBuffer, this.outputAudioContext);
      
      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      const analyzer = this.outputAudioContext.createAnalyser();
      analyzer.fftSize = 32;
      
      source.connect(analyzer);
      analyzer.connect(this.outputAudioContext.destination);

      // Simple visualization data callback
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      const interval = setInterval(() => {
        analyzer.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
        onAudioLevel(sum / dataArray.length);
      }, 100);

      source.onended = () => clearInterval(interval);

      // Scheduling
      const currentTime = this.outputAudioContext.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }
      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;

    } catch (e) {
      console.error("Audio Playback Error", e);
    }
  }

  private cleanupAudio() {
    this.mediaStream?.getTracks().forEach(track => track.stop());
    this.inputProcessor?.disconnect();
    this.inputAudioContext?.close();
    this.outputAudioContext?.close();
    this.mediaStream = null;
    this.inputProcessor = null;
    this.inputAudioContext = null;
    this.outputAudioContext = null;
  }

  // --- AUDIO HELPERS ---

  private floatTo16BitPCM(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private async decodeAudioData(arrayBuffer: ArrayBuffer, ctx: AudioContext): Promise<AudioBuffer> {
    // 24kHz raw PCM decoding
    const dataInt16 = new Int16Array(arrayBuffer);
    const float32 = new Float32Array(dataInt16.length);
    for (let i = 0; i < dataInt16.length; i++) {
        float32[i] = dataInt16[i] / 32768.0;
    }
    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);
    return buffer;
  }
}

export const geminiService = new GeminiService();