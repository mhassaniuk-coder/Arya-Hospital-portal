import React from 'react';
import { User, Phone, Pill, Clock, Heart } from 'lucide-react';

export const SeniorCareDashboard: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src="https://randomuser.me/api/portraits/women/66.jpg" className="w-16 h-16 rounded-full border-4 border-slate-50 object-cover" alt="Senior" />
                    <div>
                        <h2 className="font-bold text-xl text-slate-800">Grandma Martha</h2>
                        <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                            <Heart size={14} className="fill-green-600" /> Vitals Stable
                        </div>
                    </div>
                </div>
                <button className="bg-slate-100 p-3 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
                    <Phone size={24} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
                    <Clock className="text-blue-500 mb-2" size={24} />
                    <h3 className="font-bold text-blue-900">Next Pill</h3>
                    <p className="text-blue-700 text-sm">3:00 PM (1h left)</p>
                    <p className="text-blue-400 text-xs mt-1">Aspirin</p>
                </div>
                <div className="bg-red-50 p-5 rounded-3xl border border-red-100 flex flex-col justify-between">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-2 animate-pulse">
                        <Heart size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-900">SOS Contact</h3>
                        <p className="text-red-700 text-xs">Emergency Alert Set</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Caregiver Updates</h3>
                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        <p className="text-sm text-slate-800 font-medium">Lunch logged: Soup & Salad</p>
                        <p className="text-xs text-slate-400">12:30 PM • Caregiver Sarah</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                        <p className="text-sm text-slate-800 font-medium">Morning walk completed</p>
                        <p className="text-xs text-slate-400">09:15 AM • Auto Tracker</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
