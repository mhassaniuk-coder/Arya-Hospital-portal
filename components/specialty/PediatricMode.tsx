import React from 'react';
import { Baby, Ruler, Syringe, Calendar } from 'lucide-react';

export const PediatricMode: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-600 text-2xl">👶</div>
                <div>
                    <h2 className="font-bold text-xl text-slate-800">Leo's Health</h2>
                    <p className="text-sm text-slate-500">18 Months Old</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-purple-100 p-2 rounded-xl text-purple-600"><Ruler size={20} /></div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md">95%ile</span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Height</p>
                    <p className="font-bold text-slate-800 text-xl">82 cm</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Baby size={20} /></div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md">80%ile</span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Weight</p>
                    <p className="font-bold text-slate-800 text-xl">11.5 kg</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Syringe size={20} className="text-blue-500" /> Immunization Schedule</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl opacity-60">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                            <span className="font-medium text-slate-700 decoration-slate-400 line-through">MMR Vaccine</span>
                        </div>
                        <span className="text-xs text-slate-400">12 Mo</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border-2 border-blue-500"></div>
                            <span className="font-bold text-blue-900">DTaP Booster</span>
                        </div>
                        <span className="text-xs font-bold bg-white text-blue-600 px-2 py-1 rounded-md">Due: Oct 15</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
