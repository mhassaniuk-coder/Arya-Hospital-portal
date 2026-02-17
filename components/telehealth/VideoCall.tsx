import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Settings, Share2, Shield, MoreVertical } from 'lucide-react';

interface VideoCallProps {
    doctorName: string;
    onEndCall: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ doctorName, onEndCall }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="p-4 flex justify-between items-center text-white bg-gradient-to-b from-black/50 to-transparent absolute top-0 w-full z-10">
                <div className="flex items-center gap-3">
                    <Shield size={20} className="text-green-400" />
                    <span className="text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                        Encrypted Connection • HIPAA Compliant
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-xs font-bold">{formatTime(elapsedTime)}</span>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-full"><Settings size={20} /></button>
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-grow relative bg-slate-800 flex items-center justify-center">
                {/* Doctor Video (Grid Background / Placeholder) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000"
                        alt="Doctor"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute bottom-24 left-6 text-white text-shadow-lg">
                        <h2 className="text-2xl font-bold">{doctorName}</h2>
                        <p className="text-slate-200">Cardiologist • Arya Hospital</p>
                    </div>
                </div>

                {/* Self View (PiP) */}
                <div className="absolute bottom-24 right-6 w-32 h-48 md:w-48 md:h-72 bg-slate-900 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
                    {!isVideoOff ? (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                            <span className="text-xs text-slate-400">Self View</span>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                            <VideoOff size={24} />
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-slate-900 p-6 pb-8 flex justify-center items-center gap-6">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                >
                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                <button
                    onClick={onEndCall}
                    className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:scale-105"
                >
                    <PhoneOff size={32} />
                </button>

                <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all">
                    <MessageSquare size={24} />
                </button>

                <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all">
                    <Users size={24} />
                </button>
                <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all">
                    <MoreVertical size={24} />
                </button>
            </div>
        </div>
    );
};
