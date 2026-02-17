import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Image, Bot, User } from 'lucide-react';
import { Appointment } from '../../types';

interface DoctorChatPanelProps {
    appointment: Appointment;
    onClose: () => void;
}

interface ChatMessage {
    id: string;
    sender: 'patient' | 'doctor' | 'system';
    text: string;
    time: Date;
}

export const DoctorChatPanel: React.FC<DoctorChatPanelProps> = ({ appointment, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'system', text: `Chat with ${appointment.doctorName} — messages are monitored for your safety.`, time: new Date() },
        { id: '2', sender: 'doctor', text: `Hello! I see your appointment is scheduled for ${appointment.time}. Is there anything you'd like to discuss beforehand?`, time: new Date(Date.now() - 60000) },
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'patient', text: input.trim(), time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate doctor response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'doctor',
                text: "Thank you for sharing. I'll review this before our appointment. See you soon!",
                time: new Date()
            }]);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-md h-[75vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-arya-600 to-indigo-600 text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Bot size={20} /></div>
                        <div>
                            <p className="font-bold text-sm">{appointment.doctorName}</p>
                            <p className="text-[10px] text-white/70">{appointment.specialty} • Online</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><X size={18} /></button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'patient' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                                <p className="text-[10px] text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{msg.text}</p>
                            ) : (
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'patient' ? 'bg-arya-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-700 rounded-bl-md'
                                    }`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${msg.sender === 'patient' ? 'text-white/50' : 'text-slate-400'}`}>
                                        {msg.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={endRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-slate-100 flex items-center gap-2 shrink-0">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Paperclip size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Image size={18} /></button>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-arya-600 text-white p-2.5 rounded-xl hover:bg-arya-700 transition-colors disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
