import React, { useState } from 'react';
import { Users, BookOpen, Trophy, Car, Watch, HeartHandshake } from 'lucide-react';
import { CommunityForum } from './engagement/CommunityForum';
import { EducationHub } from './engagement/EducationHub';
import { Gamification } from './engagement/Gamification';
import { RideBooking } from './engagement/RideBooking';
import { SmartDevices } from './engagement/SmartDevices';

type EngagementTab = 'community' | 'education' | 'rewards' | 'ride' | 'devices';

export const EngagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<EngagementTab>('community');

    const renderContent = () => {
        switch (activeTab) {
            case 'community': return <CommunityForum />;
            case 'education': return <EducationHub />;
            case 'rewards': return <Gamification />;
            case 'ride': return <RideBooking />;
            case 'devices': return <SmartDevices />;
            default: return <CommunityForum />;
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 animate-fade-in pb-24 md:pb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <HeartHandshake className="text-pink-500" /> Patient Engagement
            </h1>

            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-x-auto">
                <button onClick={() => setActiveTab('community')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'community' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Users size={18} /> Community
                </button>
                <button onClick={() => setActiveTab('education')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'education' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <BookOpen size={18} /> Education
                </button>
                <button onClick={() => setActiveTab('rewards')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'rewards' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Trophy size={18} /> Rewards
                </button>
                <button onClick={() => setActiveTab('ride')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'ride' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Car size={18} /> Ride
                </button>
                <button onClick={() => setActiveTab('devices')} className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'devices' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <Watch size={18} /> Devices
                </button>
            </div>

            {renderContent()}
        </div>
    );
};
