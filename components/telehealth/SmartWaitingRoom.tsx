import React, { useState, useEffect } from 'react';
import { Clock, User, FileText, CheckCircle, Smartphone, LogOut } from 'lucide-react';

interface WaitingRoomProps {
    appointmentId: string;
    onJoinCall: () => void;
}

export const SmartWaitingRoom: React.FC<WaitingRoomProps> = ({ appointmentId, onJoinCall }) => {
    const [queuePosition, setQueuePosition] = useState(3);
    const [waitTime, setWaitTime] = useState(12); // minutes
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Mock queue movement
        const interval = setInterval(() => {
            setQueuePosition(prev => {
                if (prev <= 1) {
                    setIsReady(true);
                    return 0;
                }
                return prev - 1;
            });
            setWaitTime(prev => Math.max(0, prev - 4));
        }, 5000); // Fast forward for demo
        return () => clearInterval(interval);
    }, []);

    if (isReady) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">The Doctor is Ready!</h2>
                <p className="text-slate-500 mb-8">Dr. Sarah Smith is now available to see you.</p>
                <button
                    onClick={onJoinCall}
                    className="bg-green-600 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-xl hover:bg-green-700 transition-transform transform hover:scale-105"
                >
                    Join Video Call
                </button>
            </div>
        );
    }

    return (
        <div className="h-full w-full p-6 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                    <div className="bg-indigo-600 p-8 text-center text-white">
                        <h1 className="text-2xl font-bold mb-2">Virtual Waiting Room</h1>
                        <p className="opacity-90">Please stay on this screen. We'll notify you when the doctor is ready.</p>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="text-center md:text-left">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Wait</p>
                                <h2 className="text-5xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-4">
                                    {waitTime} <span className="text-2xl text-slate-400 font-medium">min</span>
                                </h2>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-slate-700">Queue Position</span>
                                    <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">#{queuePosition}</span>
                                </div>
                                <div className="flex gap-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`h-2 flex-grow rounded-full ${i < (5 - queuePosition) ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-center">You are next in line soon...</p>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center gap-3">
                                    <Smartphone className="text-amber-600" />
                                    <div>
                                        <p className="font-bold text-amber-800 text-sm">Test Device</p>
                                        <p className="text-amber-700 text-xs">Cam & Mic Check</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                                    <FileText className="text-blue-600" />
                                    <div>
                                        <p className="font-bold text-blue-800 text-sm">Paperwork</p>
                                        <p className="text-blue-700 text-xs">Review Forms</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-l border-slate-100 pl-0 md:pl-12 flex flex-col justify-center space-y-6">
                            <h3 className="font-bold text-slate-800">While you wait:</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5"><CheckCircle size={16} /></div>
                                    <p className="text-slate-600 text-sm">Have your insurance card ready</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5"><CheckCircle size={16} /></div>
                                    <p className="text-slate-600 text-sm">Write down your detailed symptoms</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5"><CheckCircle size={16} /></div>
                                    <p className="text-slate-600 text-sm">Check your internet connection stability</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-slate-100 p-1 rounded-full text-slate-400 mt-0.5"><User size={16} /></div>
                                    <p className="text-slate-600 text-sm">Dr. Sarah Smith (Cardiologist) will be joining shortly.</p>
                                </li>
                            </ul>

                            <div className="mt-8 p-4 bg-slate-900 text-white rounded-xl text-center">
                                <p className="text-sm font-medium">Need to reschedule?</p>
                                <button className="text-indigo-300 font-bold text-sm hover:text-white mt-1">Leave Waiting Room</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
