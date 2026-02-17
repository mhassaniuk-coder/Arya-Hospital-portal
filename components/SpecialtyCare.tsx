import React, { useState } from 'react';
import { Baby, Activity, Brain, User, Heart, Settings } from 'lucide-react';
import { PregnancyTracker } from './specialty/PregnancyTracker';
import { DiabetesTracker } from './specialty/DiabetesTracker';
import { MentalHealthTracker } from './specialty/MentalHealthTracker';
import { SeniorCareDashboard } from './specialty/SeniorCareDashboard';
import { PediatricMode } from './specialty/PediatricMode';

type SpecialtyMode = 'general' | 'pregnancy' | 'diabetes' | 'mental' | 'senior' | 'pediatric';

export const SpecialtyCare: React.FC = () => {
    const [activeMode, setActiveMode] = useState<SpecialtyMode>('general');

    const renderContent = () => {
        switch (activeMode) {
            case 'pregnancy': return <PregnancyTracker />;
            case 'diabetes': return <DiabetesTracker />;
            case 'mental': return <MentalHealthTracker />;
            case 'senior': return <SeniorCareDashboard />;
            case 'pediatric': return <PediatricMode />;
            default: return (
                <div className="text-center py-12 px-4">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart size={48} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Specialized Care Plans</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">Activate a specialized health mode to get tailored tracking, insights, and features for your specific life stage or condition.</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <button onClick={() => setActiveMode('pregnancy')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-pink-300 hover:shadow-md transition-all flex flex-col items-center gap-3">
                            <Baby size={32} className="text-pink-500" />
                            <span className="font-bold text-slate-700">Pregnancy</span>
                        </button>
                        <button onClick={() => setActiveMode('diabetes')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-md transition-all flex flex-col items-center gap-3">
                            <Activity size={32} className="text-emerald-500" />
                            <span className="font-bold text-slate-700">Diabetes</span>
                        </button>
                        <button onClick={() => setActiveMode('mental')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 hover:shadow-md transition-all flex flex-col items-center gap-3">
                            <Brain size={32} className="text-purple-500" />
                            <span className="font-bold text-slate-700">Mental Health</span>
                        </button>
                        <button onClick={() => setActiveMode('senior')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-3">
                            <User size={32} className="text-blue-500" />
                            <span className="font-bold text-slate-700">Senior Care</span>
                        </button>
                        <button onClick={() => setActiveMode('pediatric')} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-yellow-300 hover:shadow-md transition-all flex flex-col items-center gap-3">
                            <Baby size={32} className="text-yellow-500" />
                            <span className="font-bold text-slate-700">Pediatric</span>
                        </button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 animate-fade-in pb-24 md:pb-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Heart className="text-indigo-600" /> Specialty Care
                </h1>
                {activeMode !== 'general' && (
                    <button
                        onClick={() => setActiveMode('general')}
                        className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Change Mode
                    </button>
                )}
            </div>

            {renderContent()}
        </div>
    );
};
