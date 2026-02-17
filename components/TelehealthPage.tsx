import React, { useState } from 'react';
import { Video, Phone, MapPin, Activity, Calendar, LifeBuoy, HeartPulse, User } from 'lucide-react';
import { VideoCall } from './telehealth/VideoCall';
import { SmartWaitingRoom } from './telehealth/SmartWaitingRoom';
import { EmergencySOS } from './telehealth/EmergencySOS';
import { AmbulanceTracker } from './telehealth/AmbulanceTracker';
import { UrgentCareFinder } from './telehealth/UrgentCareFinder';
import { SymptomChecker } from './SymptomChecker';

export const TelehealthPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'consult' | 'urgent' | 'emergency'>('consult');
    const [isInCall, setIsInCall] = useState(false);
    const [isInWaitingRoom, setIsInWaitingRoom] = useState(false);

    if (isInCall) {
        return <VideoCall doctorName="Dr. Sarah Smith" onEndCall={() => setIsInCall(false)} />;
    }

    if (isInWaitingRoom) {
        return <SmartWaitingRoom appointmentId="123" onJoinCall={() => { setIsInWaitingRoom(false); setIsInCall(true); }} />;
    }

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 animate-fade-in relative pb-24 md:pb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Video className="text-indigo-600" /> Telehealth & Emergency
            </h1>

            {/* Tab Nav */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 w-full">
                <button
                    onClick={() => setActiveTab('consult')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${activeTab === 'consult' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                    <Video size={16} /> Consult
                </button>
                <button
                    onClick={() => setActiveTab('urgent')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${activeTab === 'urgent' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                    <Activity size={16} /> Urgent Care
                </button>
                <button
                    onClick={() => setActiveTab('emergency')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border ${activeTab === 'emergency' ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-100' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                >
                    <HeartPulse size={16} /> Emergency
                </button>
            </div>

            {activeTab === 'consult' && (
                <div className="space-y-8 pb-20 animate-fade-in">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Virtual Care Center</h2>
                            <p className="text-indigo-100 mb-6 max-w-lg">Connect with top specialists from the comfort of your home. AI-assisted triage ensures you see the right doctor, fast.</p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => setIsInWaitingRoom(true)}
                                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-transform hover:scale-105 flex items-center gap-2"
                                >
                                    <Video size={20} /> Start Instant Consult
                                </button>
                                <button className="bg-indigo-500/30 text-white px-6 py-3 rounded-xl font-bold border border-white/20 hover:bg-indigo-500/40 transition-colors flex items-center gap-2">
                                    <Calendar size={20} /> Schedule Later
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4">AI Symptom Triage</h3>
                            <SymptomChecker />
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">Upcoming Appointments</h3>
                                <div className="space-y-3">
                                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-slate-800">Dr. Sarah Smith</p>
                                            <p className="text-xs text-slate-500">Cardiology Analysis</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-indigo-600 text-sm">Today</p>
                                            <p className="text-xs text-slate-400">2:30 PM</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsInWaitingRoom(true)} // Demo shortcut
                                        className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
                                    >
                                        Join Waiting Room (Demo)
                                    </button>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                                <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2"><LifeBuoy size={20} /> Support</h3>
                                <p className="text-orange-800 text-sm mb-4">Need help connecting? Our technical support team is available 24/7.</p>
                                <button className="text-orange-700 font-bold text-sm underline">Contact Support</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'urgent' && (
                <div className="space-y-8 pb-20 animate-fade-in">
                    <UrgentCareFinder />
                </div>
            )}

            {activeTab === 'emergency' && (
                <div className="space-y-8 pb-20 animate-fade-in">
                    <EmergencySOS />
                    <AmbulanceTracker />
                </div>
            )}
        </div>
    );
};
