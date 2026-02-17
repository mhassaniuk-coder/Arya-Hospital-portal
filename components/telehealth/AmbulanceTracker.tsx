import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Phone, Shield } from 'lucide-react';

export const AmbulanceTracker: React.FC = () => {
    const [eta, setEta] = useState(12);
    const [distance, setDistance] = useState(4.5);
    const [status, setStatus] = useState('En Route');

    useEffect(() => {
        const interval = setInterval(() => {
            setEta(prev => Math.max(0, prev - 1));
            setDistance(prev => Math.max(0, parseFloat((prev - 0.1).toFixed(1))));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white relative h-96 md:h-[500px] flex flex-col">
            {/* Header */}
            <div className="bg-red-600 p-4 flex justify-between items-center z-10 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full animate-pulse">
                        <Shield className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Emergency Response</h3>
                        <p className="text-xs text-red-100 font-medium">Unit A-41 Dispatched</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-red-100 font-bold uppercase tracking-wider">ETA</p>
                    <p className="text-3xl font-bold font-mono leading-none">{eta} <span className="text-sm">min</span></p>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-grow relative bg-slate-800">
                {/* Map Graphics (CSS Only Pattern for Demo) */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                {/* Route Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 50 400 Q 150 350 200 200 T 350 100" stroke="#3b82f6" strokeWidth="4" fill="transparent" strokeDasharray="10 5" className="animate-pulse" />
                </svg>

                {/* Hospital Pin */}
                <div className="absolute top-20 right-20 flex flex-col items-center">
                    <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                        <div className="font-bold text-xs">Arya Hospital</div>
                    </div>
                    <div className="w-4 h-4 bg-blue-600 rotate-45 transform -translate-y-2"></div>
                </div>

                {/* Ambulance Icon (Moving) */}
                <div className="absolute transition-all duration-3000 ease-linear" style={{ top: '50%', left: `${Math.min(80, 20 + (12 - eta) * 5)}%`, transform: 'translate(-50%, -50%)' }}>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-red-500/30 rounded-full animate-ping"></div>
                        <div className="bg-white text-red-600 p-3 rounded-full shadow-xl z-10 relative border-4 border-red-500">
                            <Navigation size={24} className="transform rotate-45" />
                        </div>
                    </div>
                </div>

                {/* User User Loc */}
                <div className="absolute bottom-20 left-10 flex flex-col items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="bg-slate-900/80 px-2 py-1 rounded text-xs mt-1">Your Location</div>
                </div>
            </div>

            {/* Driver Info */}
            <div className="bg-slate-800 p-4 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Paramedic" className="w-12 h-12 rounded-full border-2 border-slate-600" />
                    <div>
                        <p className="font-bold text-sm">Paramedic Mike</p>
                        <p className="text-xs text-slate-400">Advanced Life Support</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition-colors">
                        <Phone size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
