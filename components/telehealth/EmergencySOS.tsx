import React, { useState, useEffect } from 'react';
import { AlertCircle, Phone, MapPin, X, ShieldAlert } from 'lucide-react';

export const EmergencySOS: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [alertSent, setAlertSent] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        } else if (isActive && countdown === 0) {
            setAlertSent(true);
        }
        return () => clearTimeout(timer);
    }, [isActive, countdown]);

    const activateSOS = () => {
        setIsActive(true);
        setCountdown(5);
        setAlertSent(false);
    };

    const cancelSOS = () => {
        setIsActive(false);
        setCountdown(5);
        setAlertSent(false);
    };

    if (alertSent) {
        return (
            <div className="bg-red-600 rounded-3xl p-8 text-white text-center animate-fade-in shadow-xl">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <ShieldAlert size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-2">SOS ALERT SENT</h2>
                <p className="opacity-90 mb-8 text-lg">Help is on the way. Emergency contacts and 911 have been notified with your live location.</p>
                <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <MapPin size={20} />
                        <span className="font-mono">37.7749° N, 122.4194° W</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone size={20} />
                        <span>Notifying: Mom, Husband, 911</span>
                    </div>
                </div>
                <button
                    onClick={cancelSOS}
                    className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors w-full"
                >
                    I'm Safe (Cancel Alert)
                </button>
            </div>
        );
    }

    if (isActive) {
        return (
            <div className="bg-red-600 rounded-3xl p-8 text-white text-center animate-pulse shadow-xl border-4 border-red-400">
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">Emergency Alert</h2>
                <div className="text-8xl font-bold mb-6 font-mono">{countdown}</div>
                <p className="mb-8 font-medium">Sending alert to emergency contacts and emergency services...</p>
                <button
                    onClick={cancelSOS}
                    className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-50 transition-colors w-full flex items-center justify-center gap-2"
                >
                    <X size={24} /> CANCEL
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={activateSOS}
            className="w-full bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl p-8 shadow-lg hover:shadow-red-200 hover:scale-[1.02] transition-all group relative overflow-hidden text-left"
        >
            <div className="absolute -right-10 -bottom-10 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
                <ShieldAlert size={200} />
            </div>

            <div className="relative z-10 flex items-center gap-6">
                <div className="bg-red-400/30 p-4 rounded-full animate-pulse">
                    <AlertCircle size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">SOS Emergency</h2>
                    <p className="text-red-100 mt-1">Tap to alert contacts & services instantly</p>
                </div>
            </div>
        </button>
    );
};
