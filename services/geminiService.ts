import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { ChatMessage, AIAnalysisResult, User, Appointment, LabResult, Medication, Bill } from '../types';

const API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.API_KEY : '') || '';

class GeminiService {
  private ai: GoogleGenAI;
  private modelId = 'gemini-2.0-flash-exp';

  // Live API State
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private inputProcessor: ScriptProcessorNode | null = null;
  private nextStartTime = 0;
  private sessionPromise: Promise<any> | null = null;

  constructor() {
    try {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    } catch (error) {
      console.error("Gemini Service Initialization Error:", error);
      // Fallback initialization to prevent app crash
      this.ai = new GoogleGenAI({ apiKey: 'dummy_key' });
    }
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
        appointments: safeAppointments.map(a => ({ ...a, id: a.id, doctor: a.doctorName, date: a.date })),
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

  async analyzeVisualSymptom(base64Data: string, mimeType: string): Promise<AIAnalysisResult> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: [
          {
            role: 'user',
            parts: [
              { text: "Analyze this image of a physical symptom (e.g. skin rash, swelling). Identify potential conditions, urgency, and specialty. Return JSON matching the analyzeSymptoms format." },
              { inlineData: { mimeType, data: base64Data } }
            ]
          }
        ],
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || "{}";
      return JSON.parse(text) as AIAnalysisResult;
    } catch (error) {
      return {
        specialty: "Dermatology",
        urgency: "Medium",
        reasoning: "Visual analysis failed or was inconclusive. Please consult a doctor.",
        suggestedDoctorType: "Dermatologist",
        prepTips: ["Take clear photos over time"],
        questionsToAsk: ["Is this contagious?"],
        telehealthScore: 80,
        estimatedDuration: "15 mins"
      };
    }
  }

  // --- NEW AI FEATURE METHODS ---

  async interpretLabResult(testName: string, value: string, unit: string, status: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are a medical AI assistant. A patient has the following lab result:
        Test: ${testName}
        Value: ${value} ${unit}
        Status: ${status}
        
        Explain this result in simple, easy-to-understand language. Include:
        1. What this test measures
        2. Whether the result is normal or concerning
        3. What it could mean for their health
        4. Any lifestyle recommendations
        
        Keep it concise (max 150 words), friendly, and reassuring. Do NOT diagnose.`,
      });
      return response.text || "Unable to interpret this result right now.";
    } catch (error) {
      return "AI interpretation is temporarily unavailable. Please consult your doctor for details.";
    }
  }

  async analyzeDocument(base64Data: string, mimeType: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: [
          {
            role: 'user',
            parts: [
              { text: "Analyze this medical document. Extract key findings, dates, patient name (if any), and any abnormal results. Summarize it clearly for the patient." },
              { inlineData: { mimeType, data: base64Data } }
            ]
          }
        ]
      });
      return response.text || "Unable to analyze document.";
    } catch (error) {
      console.error("Doc Analysis Error", error);
      return "Document analysis failed. Please ensure the image is clear and try again.";
    }
  }

  async checkMedicationInteractions(currentMeds: string[], newMed: string): Promise<{ hasInteraction: boolean; severity: string; details: string; recommendations: string[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are a pharmacology AI. Check for drug interactions.
        Current medications: ${currentMeds.join(', ')}
        New medication being added: ${newMed}
        
        Return JSON with: hasInteraction (boolean), severity ("none"|"mild"|"moderate"|"severe"), details (string explanation), recommendations (string array of advice).
        Be accurate but note this is informational only.`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      return { hasInteraction: false, severity: "none", details: "Unable to check interactions at this time.", recommendations: ["Please consult your pharmacist."] };
    }
  }

  async generateWellnessPlan(profile: { age?: number; conditions?: string[]; medications?: string[]; activity?: string; goals?: string }): Promise<{ breakfast: string; lunch: string; dinner: string; snack: string; exercise: string; mindfulness: string; sleepTip: string; hydration: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are a wellness AI coach. Generate a personalized daily health plan.
        Patient profile: ${JSON.stringify(profile)}
        
        Return JSON with these keys: breakfast (meal suggestion with calories), lunch, dinner, snack, exercise (specific 20-30 min routine), mindfulness (5-min activity), sleepTip (one tip), hydration (daily water goal).
        Be specific, practical, and encouraging.`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      return { breakfast: "Oatmeal with berries (350 cal)", lunch: "Grilled chicken salad (450 cal)", dinner: "Salmon with vegetables (500 cal)", snack: "Greek yogurt with nuts (200 cal)", exercise: "30 min brisk walk", mindfulness: "5 min deep breathing", sleepTip: "Avoid screens 1 hour before bed", hydration: "8 glasses of water" };
    }
  }

  async auditBill(billItems: string): Promise<{ issues: { item: string; issue: string; severity: string }[]; totalSavings: string; summary: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are a medical billing auditor AI. Analyze this hospital bill for errors:
        ${billItems}
        
        Return JSON with: issues (array of {item, issue, severity: "info"|"warning"|"error"}), totalSavings (estimated dollar amount of potential savings), summary (1-2 sentence summary).
        Look for: duplicate charges, unbundled codes, upcoding, incorrect quantities, charges for items not typically billed separately.`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      return { issues: [], totalSavings: "$0", summary: "Unable to audit bill at this time." };
    }
  }

  async estimateInsuranceCost(procedure: string, planDetails: { coPay: number; deductible: number; deductibleMet: number; coInsurance: number }): Promise<{ estimatedTotal: string; outOfPocket: string; insurancePays: string; breakdown: string[]; tips: string[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are an insurance cost estimator AI.
        Procedure: ${procedure}
        Insurance Plan: Co-pay $${planDetails.coPay}, Deductible $${planDetails.deductible} (Met: $${planDetails.deductibleMet}), Co-insurance ${planDetails.coInsurance}%
        
        Estimate the cost breakdown. Return JSON with: estimatedTotal (procedure cost), outOfPocket (what patient pays), insurancePays (what insurance covers), breakdown (array of line items explaining the math), tips (array of money-saving tips).`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      return { estimatedTotal: "N/A", outOfPocket: "N/A", insurancePays: "N/A", breakdown: ["Estimation unavailable"], tips: ["Contact your insurance provider for accurate estimates."] };
    }
  }

  async predictHealthTrends(vitals: { name: string; values: { date: string; value: number }[] }[]): Promise<{ trends: { vital: string; direction: string; summary: string; risk: string; recommendation: string }[]; overallSummary: string }> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are a health analytics AI. Analyze these vital trends over time:
        ${JSON.stringify(vitals)}
        
        Return JSON with: trends (array of {vital, direction: "improving"|"stable"|"worsening", summary, risk: "low"|"medium"|"high", recommendation}), overallSummary (2-3 sentence health outlook).
        Be data-driven but compassionate.`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      return { trends: [], overallSummary: "Health trend analysis is temporarily unavailable." };
    }
  }

  async generateClinicalNote(voiceText: string): Promise<{ structuredNote: string; symptoms: string[]; mood: string; recommendations: string[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are a clinical documentation AI. Convert this patient's voice note into structured clinical notes:
        "${voiceText}"
        
        Return JSON with: structuredNote (formatted clinical note), symptoms (array of identified symptoms), mood (patient's apparent mood), recommendations (array of suggested actions).`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      return { structuredNote: voiceText, symptoms: [], mood: "Unknown", recommendations: ["Please consult your doctor."] };
    }
  }

  async generateOutbreakAlerts(location: string): Promise<{ region: string; condition: string; severity: 'low' | 'medium' | 'high'; cases: string; prevention: string }[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are a public health AI. Identify current health alerts for: ${location || 'New York, USA'}.
        Consider seasonal trends (flu, allergies) and hypothetical local outbreaks.
        
        Return JSON array of objects with: region, condition (e.g. "Seasonal Flu"), severity ("low"|"medium"|"high"), cases (e.g. "High activity"), prevention (short tip).
        Max 2 alerts.`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '[]';
      return JSON.parse(text);
    } catch (error) {
      return [{ region: location, condition: "Seasonal Flu", severity: "medium", cases: "Rising", prevention: "Get vaccinated" }];
    }
  }

  async assessReadmissionRisk(recentVitals: any, history: any): Promise<{ label: string; score: number; trend: 'stable' | 'improving' | 'worsening' }[]> {
    // Simulated risk assessment based on inputs (simplified for demo)
    try {
      // In a real app, this would send history to Gemini. Here we'll simulate a response or ask Gemini for a score based on vitals.
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `Assess readmission risk (0-100) based on: BP 120/80, HR 72, recent stable history. Return JSON array of risk metrics: [{label: "Readmission Risk", score: number, trend: "stable"|"improving"|"worsening"}, {label: "Cardiovascular Risk", score: number, trend: "stable"}]`,
        config: { responseMimeType: "application/json" }
      });
      const text = response.text || '[]';
      return JSON.parse(text);
    } catch (error) {
      return [
        { label: 'Readmission Risk', score: 12, trend: 'stable' },
        { label: 'Cardiovascular Risk', score: 25, trend: 'improving' }
      ];
    }
  }

  async getDashboardSmartActions(): Promise<{ id: string; title: string; type: 'appointment' | 'medication' | 'lifestyle' | 'admin'; priority: 'high' | 'medium' | 'low' }[]> {
    // Return static/mock actions for now, or minimal AI generation
    return [
      { id: '1', title: 'Schedule Annual Physical', type: 'appointment', priority: 'medium' },
      { id: '2', title: 'Update Insurance Information', type: 'admin', priority: 'high' }
    ];
  }

  // Simple single-turn chat for the global widget
  async chat(message: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: `You are Arya, a friendly and knowledgeable AI health assistant for a hospital portal. 
        Answer the patient's question helpfully and concisely. Be warm, professional, and always remind them to consult their doctor for serious concerns.
        
        Patient's question: "${message}"
        
        Keep your response under 200 words. Use simple language.`
      });
      return response.text || "I couldn't process that. Could you try rephrasing?";
    } catch (error) {
      return "Sorry, I'm having trouble connecting right now. Please try again.";
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
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
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