import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Minimize2, Maximize2, Bot, User } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

export const GlobalChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', text: "Hi! I'm your Arya AI Health Assistant. I can help with health questions, explain symptoms, medications, and more. How can I help you today?", timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim(), timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        const query = input.trim();
        setInput('');
        setIsTyping(true);

        try {
            const response = await geminiService.chat(query);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: response || "I couldn't process that. Could you try rephrasing?",
                timestamp: new Date()
            }]);
        } catch {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: "Sorry, I'm having trouble connecting right now. Please try again.",
                timestamp: new Date()
            }]);
        }
        setIsTyping(false);
    };

    const quickActions = [
        "What does my last lab result mean?",
        "Side effects of Lipitor?",
        "When is my next appointment?",
        "Tips for lowering cholesterol"
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 bg-gradient-to-r from-arya-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl shadow-arya-300 hover:shadow-arya-400 hover:scale-110 transition-all group"
                title="AI Assistant"
            >
                <MessageSquare size={24} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    AI Health Assistant
                </span>
            </button>
        );
    }

    if (isMinimized) {
        return (
            <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-xl transition-all group"
                >
                    <div className="bg-arya-600 p-2 rounded-xl text-white">
                        <Bot size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Arya AI</span>
                    {isTyping && <Loader2 size={14} className="animate-spin text-arya-600" />}
                    <Maximize2 size={14} className="text-slate-400 ml-2" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-96 max-h-[70vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-arya-600 to-indigo-600 p-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Arya AI Assistant</h3>
                        <p className="text-[10px] text-white/70">Always here to help</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                        <Minimize2 size={16} />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[45vh]">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-arya-600 text-white rounded-br-md'
                                : 'bg-slate-100 text-slate-700 rounded-bl-md'
                            }`}>
                            {msg.role === 'ai' && (
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Sparkles size={12} className="text-arya-600" />
                                    <span className="text-[10px] font-bold text-arya-600 uppercase">AI</span>
                                </div>
                            )}
                            <p className="whitespace-pre-line">{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/50' : 'text-slate-400'}`}>
                                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-md">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-arya-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-arya-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-arya-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (only if few messages) */}
            {messages.length <= 2 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {quickActions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => { setInput(action); }}
                            className="text-[10px] px-2.5 py-1 bg-arya-50 text-arya-700 rounded-full border border-arya-100 hover:bg-arya-100 transition-colors font-medium"
                        >
                            {action}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-arya-600 text-white p-2.5 rounded-xl hover:bg-arya-700 transition-colors disabled:opacity-50 shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
