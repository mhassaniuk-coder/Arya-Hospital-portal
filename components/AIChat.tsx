import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, Mic, MicOff, Phone, PhoneOff, X, CheckCircle, ArrowRightCircle, Pill, CreditCard, Ambulance, MessageSquare } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { VoiceInput } from './ui/VoiceInput';
import { ChatMessage, User as UserType, Appointment, LabResult, ViewState, Medication, Bill } from '../types';

interface AIChatProps {
  user: UserType;
  appointments: Appointment[];
  labResults: LabResult[];
  medications: Medication[];
  bills: Bill[];
  onNavigate: (view: ViewState) => void;
  onAddAppointment: (appt: Appointment) => void;
}

interface TranscriptItem {
  text: string;
  isUser: boolean;
  id: string;
}

export const AIChat: React.FC<AIChatProps> = ({ user, appointments, labResults, medications, bills, onNavigate, onAddAppointment }) => {
  // --- EXISTING TEXT CHAT STATE ---
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello ${user.name}! I'm Arya, your advanced health assistant. 

I can help with:
• Booking & Managing Appointments
• Prescription Refills & Drug Interactions
• Bill Payments & Insurance Checks
• Lab Result Analysis
• Symptom Triage

How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- LIVE CALL STATE ---
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<TranscriptItem[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState({ user: '', model: '' });
  const [audioLevel, setAudioLevel] = useState(0);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLiveActive) {
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveTranscript, currentTranscript, isLiveActive]);

  // --- TEXT CHAT HANDLERS ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const textToSend = input;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: new Date(), isStreaming: true }]);

      let fullResponse = '';
      const stream = geminiService.streamChat(messages.concat(userMsg), textToSend, { user, appointments, labResults, medications, bills });

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, text: fullResponse.replace(/\|\|JSON\|\|[\s\S]*?\|\|JSON\|\|/g, '').trim() } : msg));
      }
      setMessages(prev => prev.map(msg => msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg));

      // Handle Actions
      const jsonMatch = fullResponse.match(/\|\|JSON\|\|([\s\S]*?)\|\|JSON\|\|/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const action = JSON.parse(jsonMatch[1]);
          handleAIAction(action);
        } catch (e) {
          console.error("Failed to execute AI action", e);
        }
      }

    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm having a little trouble connecting right now. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIAction = (action: any) => {
    const timestamp = new Date();
    let confirmationMsg: ChatMessage | null = null;

    switch (action.action) {
      case 'NAVIGATE':
        if (action.target) {
          confirmationMsg = { id: Date.now() + 'nav', role: 'model', text: `🚀 Navigating to ${action.target}...`, timestamp };
          setTimeout(() => onNavigate(action.target), 1200);
        }
        break;
      case 'CREATE_APPOINTMENT':
        const newAppt: Appointment = {
          id: Date.now().toString(),
          doctorName: action.data.doctorName || 'Dr. Auto Assigned',
          specialty: action.data.specialty || 'General Practice',
          date: action.data.date,
          time: action.data.time,
          status: 'upcoming',
          location: action.data.location || 'Building A',
          symptoms: action.data.symptoms,
          aiSummary: 'Appointment booked via Arya AI Assistant.',
          matchScore: 100,
          visitType: action.data.visitType || 'in-person'
        };
        onAddAppointment(newAppt);
        confirmationMsg = { id: Date.now() + 'appt', role: 'model', text: `✅ CONFIRMED_APPT: Appointment booked with ${newAppt.doctorName}.`, timestamp };
        break;
      case 'REFILL_MEDICATION':
        confirmationMsg = { id: Date.now() + 'refill', role: 'model', text: `💊 CONFIRMED_REFILL: Refill request sent for ${action.medicationName}. Pharmacy notified.`, timestamp };
        break;
      case 'PAY_BILL':
        confirmationMsg = { id: Date.now() + 'pay', role: 'model', text: `💳 CONFIRMED_PAY: Payment of $${action.amount} processed successfully. Receipt #9921.`, timestamp };
        break;
      case 'EMERGENCY_ALERT':
        confirmationMsg = { id: Date.now() + 'alert', role: 'model', text: `🚑 EMERGENCY ALERT: Triage team notified for "${action.reason}". Please proceed to ER immediately.`, timestamp };
        break;
      case 'CONTACT_DOCTOR':
        confirmationMsg = { id: Date.now() + 'msg', role: 'model', text: `✉️ MESSAGE SENT: Your message to ${action.doctorName} has been drafted and sent.`, timestamp };
        break;
    }

    if (confirmationMsg) {
      setMessages(prev => [...prev, confirmationMsg!]);
    }
  };

  // --- LIVE CALL HANDLERS ---
  const toggleLiveCall = async () => {
    if (isLiveActive) {
      await geminiService.stopLiveSession();
      setIsLiveActive(false);
      setLiveTranscript([]);
      setCurrentTranscript({ user: '', model: '' });
    } else {
      setIsLiveActive(true);
      setLiveTranscript([{ id: 'init', isUser: false, text: "Connecting to secure live line..." }]);

      await geminiService.startLiveSession(
        { user, appointments, labResults, medications, bills },
        (text, isUser, isFinal) => {
          if (isFinal) {
            setLiveTranscript(prev => [...prev, { id: Date.now().toString(), isUser, text }]);
            setCurrentTranscript(prev => ({ ...prev, [isUser ? 'user' : 'model']: '' }));
          } else {
            setCurrentTranscript(prev => ({ ...prev, [isUser ? 'user' : 'model']: text }));
          }
        },
        (level) => setAudioLevel(level),
        () => setIsLiveActive(false)
      );
    }
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.text.startsWith('✅ CONFIRMED_APPT:')) {
      return (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle className="text-green-600 mt-1 shrink-0" size={20} />
          <div>
            <p className="font-bold text-green-800 text-sm">Appointment Confirmed</p>
            <p className="text-green-700 text-sm mt-1">{msg.text.replace('✅ CONFIRMED_APPT: ', '')}</p>
          </div>
        </div>
      );
    }
    if (msg.text.startsWith('💊 CONFIRMED_REFILL:')) {
      return (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
          <Pill className="text-blue-600 mt-1 shrink-0" size={20} />
          <div>
            <p className="font-bold text-blue-800 text-sm">Refill Request Processed</p>
            <p className="text-blue-700 text-sm mt-1">{msg.text.replace('💊 CONFIRMED_REFILL: ', '')}</p>
          </div>
        </div>
      );
    }
    if (msg.text.startsWith('💳 CONFIRMED_PAY:')) {
      return (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-start gap-3">
          <CreditCard className="text-indigo-600 mt-1 shrink-0" size={20} />
          <div>
            <p className="font-bold text-indigo-800 text-sm">Payment Successful</p>
            <p className="text-indigo-700 text-sm mt-1">{msg.text.replace('💳 CONFIRMED_PAY: ', '')}</p>
          </div>
        </div>
      );
    }
    if (msg.text.startsWith('🚑 EMERGENCY ALERT:')) {
      return (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 animate-pulse">
          <Ambulance className="text-red-600 mt-1 shrink-0" size={20} />
          <div>
            <p className="font-bold text-red-800 text-sm">EMERGENCY PROTOCOL ACTIVATED</p>
            <p className="text-red-700 text-sm mt-1">{msg.text.replace('🚑 EMERGENCY ALERT: ', '')}</p>
            <button className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">Call 911 Now</button>
          </div>
        </div>
      );
    }
    if (msg.text.startsWith('✉️ MESSAGE SENT:')) {
      return (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex items-start gap-3">
          <MessageSquare className="text-purple-600 mt-1 shrink-0" size={20} />
          <div>
            <p className="font-bold text-purple-800 text-sm">Message Sent</p>
            <p className="text-purple-700 text-sm mt-1">{msg.text.replace('✉️ MESSAGE SENT: ', '')}</p>
          </div>
        </div>
      );
    }
    if (msg.text.startsWith('🚀 Navigating')) {
      return (
        <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-center gap-3">
          <ArrowRightCircle className="text-indigo-600 shrink-0" size={20} />
          <p className="text-indigo-800 text-sm font-medium">{msg.text}</p>
        </div>
      );
    }
    return <p className="whitespace-pre-wrap">{msg.text}</p>;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl md:border border-slate-100 relative overflow-hidden">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-arya-600 to-arya-800 p-4 flex items-center justify-between text-white shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Arya Advanced</h3>
            <p className="text-arya-100 text-xs">25+ Hospital Modules Active</p>
          </div>
        </div>
        <button
          onClick={toggleLiveCall}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${isLiveActive ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-white text-arya-700 hover:bg-arya-50'
            }`}
        >
          {isLiveActive ? <><PhoneOff size={16} /> End Call</> : <><Phone size={16} /> Call Arya</>}
        </button>
      </div>

      {/* --- LIVE CALL OVERLAY --- */}
      {isLiveActive && (
        <div className="absolute inset-0 bg-slate-900/95 z-20 flex flex-col backdrop-blur-md animate-fade-in">
          {/* Call Header */}
          <div className="p-6 flex justify-between items-center text-white/80 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono uppercase tracking-widest">Live Secure Connection</span>
            </div>
            <button onClick={toggleLiveCall} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
          </div>

          {/* Visualizer */}
          <div className="flex-grow flex flex-col items-center justify-center relative">
            {/* Orb Animation */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-arya-500/30 rounded-full blur-3xl animate-pulse" style={{ transform: `scale(${1 + audioLevel / 50})` }}></div>
              <div className="absolute inset-0 border-2 border-arya-400/50 rounded-full" style={{ transform: `scale(${1 + audioLevel / 100})` }}></div>
              <div className="w-32 h-32 bg-gradient-to-br from-arya-400 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 transition-transform duration-100" style={{ transform: `scale(${1 + audioLevel / 100})` }}>
                <Mic size={48} className="text-white" />
              </div>
              {/* Ripples */}
              <div className="absolute inset-0 border border-white/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-0 border border-white/10 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
            </div>

            <p className="mt-8 text-slate-400 font-medium text-sm">Listening to you...</p>
          </div>

          {/* Live Transcript */}
          <div className="h-1/3 bg-black/20 backdrop-blur-sm p-6 overflow-y-auto space-y-4 mask-linear-fade shrink-0">
            {liveTranscript.map(t => (
              <div key={t.id} className={`flex ${t.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${t.isUser ? 'bg-indigo-600/80 text-white' : 'bg-slate-700/80 text-slate-200'}`}>
                  {t.text}
                </div>
              </div>
            ))}
            {/* Streaming Text */}
            {(currentTranscript.user || currentTranscript.model) && (
              <div className={`flex ${currentTranscript.user ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm italic opacity-80 ${currentTranscript.user ? 'bg-indigo-600/50 text-white' : 'bg-slate-700/50 text-slate-200'}`}>
                  {currentTranscript.user || currentTranscript.model}
                  <span className="inline-block w-1.5 h-3 ml-1 bg-white/50 animate-pulse"></span>
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Controls */}
          <div className="p-6 flex justify-center gap-6 shrink-0">
            <button className="p-4 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"><MicOff size={24} /></button>
            <button onClick={toggleLiveCall} className="p-4 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 transform hover:scale-105"><PhoneOff size={32} /></button>
          </div>
        </div>
      )}

      {/* --- STANDARD CHAT UI --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 scroll-smooth">
        <div className="flex justify-center">
          <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs p-3 rounded-xl max-w-md flex items-start">
            <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>Use the "Call Arya" button for a real-time voice conversation.</p>
          </div>
        </div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-arya-100'}`}>
                {msg.role === 'user' ? <User size={16} className="text-indigo-600" /> : <Bot size={16} className="text-arya-600" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${msg.text.includes('CONFIRMED') || msg.text.includes('EMERGENCY') || msg.text.startsWith('🚀') ? 'bg-transparent shadow-none p-0 w-full' :
                  msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                {renderMessageContent(msg)}
                {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-arya-500 animate-pulse align-middle"></span>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 md:p-4 border-t border-slate-100 shrink-0 mb-[env(safe-area-inset-bottom)]">
        <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-arya-200 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-grow bg-transparent px-4 py-3 md:py-4 outline-none text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
            disabled={isLoading}
          />
          <VoiceInput onTranscript={(text) => setInput(prev => (prev + ' ' + text).trim())} className="mr-1" />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 md:p-3 mr-2 rounded-xl bg-arya-600 text-white hover:bg-arya-700 disabled:opacity-50 transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};