import React, { useState } from 'react';
import { Smile, Frown, Meh, Sun, Cloud, CloudRain, BookOpen, PenTool } from 'lucide-react';

export const MentalHealthTracker: React.FC = () => {
    const [mood, setMood] = useState<number | null>(null);
    const [note, setNote] = useState('');

    const moods = [
        { level: 1, icon: CloudRain, label: "Rough", color: "text-slate-400 bg-slate-100" },
        { level: 2, icon: Cloud, label: "Down", color: "text-blue-400 bg-blue-100" },
        { level: 3, icon: Meh, label: "Okay", color: "text-indigo-400 bg-indigo-100" },
        { level: 4, icon: Sun, label: "Good", color: "text-amber-400 bg-amber-100" },
        { level: 5, icon: Smile, label: "Great", color: "text-green-400 bg-green-100" },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-6">How are you feeling today?</h2>
                <div className="flex justify-between max-w-sm mx-auto mb-8">
                    {moods.map((m) => (
                        <button
                            key={m.level}
                            onClick={() => setMood(m.level)}
                            className={`flex flex-col items-center gap-2 group transition-all transform ${mood === m.level ? 'scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                        >
                            <div className={`p-4 rounded-2xl transition-colors shadow-sm ${mood === m.level ? m.color.replace('100', '200') : m.color}`}>
                                <m.icon size={32} />
                            </div>
                            <span className={`text-xs font-bold ${mood === m.level ? 'text-slate-800' : 'text-slate-400'}`}>{m.label}</span>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What's on your mind? (Optional)"
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 resize-none h-32 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    />
                    <button className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                        <PenTool size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-2">Meditation</h3>
                    <div className="flex items-center gap-2 mb-4 text-indigo-700 text-sm">
                        <BookOpen size={16} /> <span>10 min recommended</span>
                    </div>
                    <button className="w-full bg-white text-indigo-600 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">Start Session</button>
                </div>
                <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                    <h3 className="font-bold text-purple-900 mb-2">Therapy</h3>
                    <div className="flex items-center gap-2 mb-4 text-purple-700 text-sm">
                        <Smile size={16} /> <span>Talk to AI Counselor</span>
                    </div>
                    <button className="w-full bg-white text-purple-600 py-2 rounded-xl font-bold text-sm hover:bg-purple-50 transition-colors">Chat Now</button>
                </div>
            </div>
        </div>
    );
};
