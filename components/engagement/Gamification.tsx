import React from 'react';
import { Trophy, Star, Target, Gift } from 'lucide-react';

export const Gamification: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                        <Trophy size={40} className="fill-yellow-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Points</p>
                        <h2 className="text-4xl font-bold text-slate-800">1,250</h2>
                        <p className="text-sm text-green-600 font-bold">+50 today</p>
                    </div>
                </div>
                <div className="flex-grow w-full md:w-auto">
                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                        <span>Level 5: Health Guardian</span>
                        <span>250 pts to Level 6</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-3/4 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Target, label: 'Steps Goal', value: '10k', color: 'bg-blue-100 text-blue-600' },
                    { icon: Star, label: 'Streak', value: '12 Days', color: 'bg-purple-100 text-purple-600' },
                    { icon: Gift, label: 'Rewards', value: '3 Avail', color: 'bg-pink-100 text-pink-600' },
                    { icon: Trophy, label: 'Rank', value: '#42', color: 'bg-green-100 text-green-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className={`p-3 rounded-full mb-2 ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{stat.value}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>

            <h3 className="font-bold text-slate-800 mt-4 mb-2">Badges</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-24 h-32 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shrink-0 p-2 shadow-sm grayscale hover:grayscale-0 transition-all cursor-pointer">
                        <div className="text-4xl mb-2">🏅</div>
                        <p className="text-xs font-bold text-center text-slate-600 leading-tight">Early Riser</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
