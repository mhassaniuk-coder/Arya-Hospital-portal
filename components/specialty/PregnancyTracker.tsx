import React, { useState } from 'react';
import { Baby, Calendar, Heart, Activity, Ruler, Info } from 'lucide-react';

export const PregnancyTracker: React.FC = () => {
    const [week, setWeek] = useState(24);
    const [kicks, setKicks] = useState(0);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-48 h-48 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="white" strokeWidth="12" fill="transparent" />
                        <circle cx="96" cy="96" r="88" stroke="#ec4899" strokeWidth="12" fill="transparent" strokeDasharray="552" strokeDashoffset={552 - (552 * week) / 40} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-pink-600">
                        <span className="text-4xl font-bold">{week}</span>
                        <span className="text-sm font-medium uppercase tracking-wider">Weeks</span>
                    </div>
                </div>

                <div className="flex-grow space-y-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Your Baby is the size of an <span className="text-pink-600">Ear of Corn</span> 🌽</h2>
                        <p className="text-slate-500">Trimester 2 • 16 Weeks to go</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-2xl border border-pink-100 flex items-center gap-3">
                            <div className="bg-pink-100 p-2 rounded-full text-pink-600"><Ruler size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Length</p>
                                <p className="font-bold text-slate-700">30 cm</p>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-pink-100 flex items-center gap-3">
                            <div className="bg-pink-100 p-2 rounded-full text-pink-600"><Activity size={20} /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Weight</p>
                                <p className="font-bold text-slate-700">600 g</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity size={20} className="text-pink-500" /> Kick Counter</h3>
                    <div className="text-center py-6">
                        <div className="text-6xl font-bold text-pink-600 mb-2">{kicks}</div>
                        <p className="text-slate-400 text-sm mb-6">Kicks today</p>
                        <button
                            onClick={() => setKicks(kicks + 1)}
                            className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200 active:scale-95"
                        >
                            <Baby className="inline mr-2" /> Record Kick
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Info size={20} className="text-blue-500" /> Weekly Insights</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                            <p className="text-sm text-slate-600">The baby's lungs are developing rapidly this week, preparing for breathing.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                            <p className="text-sm text-slate-600">You might notice your center of gravity shifting. Wear comfortable shoes!</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                            <p className="text-sm text-slate-600">Have you scheduled your glucose screening test? It's usually between weeks 24-28.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
