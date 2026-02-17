import React, { useState, useRef } from 'react';
import { Activity, AlertTriangle, ArrowRight, Loader2, Sparkles, ShieldAlert, CheckCircle, Stethoscope, Clock, Phone, MessageCircle, ChevronDown, Camera } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { AIAnalysisResult } from '../types';
import { VoiceInput } from './ui/VoiceInput';

export const SymptomChecker: React.FC = () => {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [symptomText, setSymptomText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [showSymptomInput, setShowSymptomInput] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setResult(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const mimeType = file.type;
            const analysis = await geminiService.analyzeVisualSymptom(base64String, mimeType);
            setResult(analysis);
            setIsAnalyzing(false);
        };
        reader.readAsDataURL(file);
    };

    const parts = [
        { id: 'head', label: 'Head & Neck', cx: 100, cy: 30, r: 25, commonSymptoms: 'headache, dizziness, neck pain, sore throat' },
        { id: 'chest', label: 'Chest', cx: 100, cy: 90, r: 30, commonSymptoms: 'chest pain, shortness of breath, cough' },
        { id: 'stomach', label: 'Abdomen', cx: 100, cy: 150, r: 30, commonSymptoms: 'stomach pain, nausea, bloating' },
        { id: 'arms', label: 'Arms', cx: 40, cy: 110, r: 20, commonSymptoms: 'arm pain, numbness, joint stiffness' },
        { id: 'legs', label: 'Legs', cx: 100, cy: 230, r: 30, commonSymptoms: 'leg pain, swelling, cramps' },
    ];

    const handleRunTriage = async () => {
        const part = parts.find(p => p.id === selectedPart);
        const fullSymptoms = `Body area: ${part?.label || 'General'}. Symptoms: ${symptomText || part?.commonSymptoms || 'general discomfort'}`;

        setIsAnalyzing(true);
        setResult(null);
        try {
            const analysis = await geminiService.analyzeSymptoms(fullSymptoms);
            setResult(analysis);
        } catch {
            setResult({
                specialty: 'General Practice',
                urgency: 'Low',
                reasoning: 'Unable to analyze. Please try again.',
                suggestedDoctorType: 'General Practitioner',
                prepTips: ['Bring your ID'],
                questionsToAsk: ['What could be causing this?'],
                telehealthScore: 50,
                estimatedDuration: '20 mins'
            });
        }
        setIsAnalyzing(false);
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'Emergency': return 'from-red-500 to-red-600';
            case 'High': return 'from-orange-500 to-red-500';
            case 'Medium': return 'from-amber-400 to-orange-500';
            default: return 'from-green-400 to-emerald-500';
        }
    };

    const getUrgencyBg = (urgency: string) => {
        switch (urgency) {
            case 'Emergency': return 'bg-red-50 border-red-200';
            case 'High': return 'bg-orange-50 border-orange-200';
            case 'Medium': return 'bg-amber-50 border-amber-200';
            default: return 'bg-green-50 border-green-200';
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="text-arya-600" size={24} />
                        AI Symptom Checker
                    </h1>
                    <p className="text-slate-500 text-sm">Tap a body area, describe your symptoms, and get an AI triage assessment.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Body Map */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Select Body Area</h3>
                    <div className="relative w-full max-w-xs mx-auto h-80 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-100 flex items-center justify-center shadow-inner">
                        <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl">
                            <path d="M100,60 L100,180 M60,90 L140,90 M70,180 L70,280 M130,180 L130,280" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
                            {parts.map(part => (
                                <g key={part.id} onClick={() => { setSelectedPart(part.id); setShowSymptomInput(true); setResult(null); }} className="cursor-pointer hover:opacity-80 transition-opacity">
                                    <circle
                                        cx={part.cx} cy={part.cy} r={part.r}
                                        fill={selectedPart === part.id ? '#ef4444' : '#6366f1'}
                                        className="transition-colors duration-300 opacity-50"
                                    />
                                    {selectedPart === part.id && (
                                        <circle cx={part.cx} cy={part.cy} r={part.r + 5} fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5">
                                            <animate attributeName="r" from={String(part.r)} to={String(part.r + 12)} dur="1s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="indefinite" />
                                        </circle>
                                    )}
                                    <text x={part.cx} y={part.cy} textAnchor="middle" dy="5" fontSize="10" fill="white" fontWeight="bold">
                                        {selectedPart === part.id ? '!' : ''}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                    {selectedPart && (
                        <div className="mt-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                                <Activity size={14} /> {parts.find(p => p.id === selectedPart)?.label} Selected
                            </span>
                        </div>
                    )}
                </div>

                {/* Symptom Input & Results */}
                <div className="space-y-4">
                    {showSymptomInput && selectedPart && (
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-fade-in space-y-4">
                            <h3 className="font-bold text-slate-800 text-lg capitalize flex items-center gap-2">
                                <Stethoscope className="text-arya-600" size={20} />
                                {parts.find(p => p.id === selectedPart)?.label} — Describe Symptoms
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-slate-500 text-sm">Common: {parts.find(p => p.id === selectedPart)?.commonSymptoms}</p>
                                <VoiceInput onTranscript={(text) => setSymptomText(prev => (prev + ' ' + text).trim())} />
                            </div>

                            <textarea
                                value={symptomText}
                                onChange={(e) => setSymptomText(e.target.value)}
                                placeholder="Describe what you're feeling in detail... (e.g., 'sharp pain on the left side for 2 days, gets worse when breathing')"
                                className="w-full h-28 p-4 border border-slate-200 rounded-2xl text-sm resize-none focus:ring-2 focus:ring-arya-200 outline-none bg-slate-50"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={handleRunTriage}
                                    disabled={isAnalyzing}
                                    className="flex-grow bg-gradient-to-r from-arya-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-arya-200 transition-all disabled:opacity-60"
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                                    ) : (
                                        <><Sparkles size={18} /> Run AI Triage</>
                                    )}
                                </button>
                                <div className="relative">
                                    <input
                                        type="file"
                                        ref={imageInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <button
                                        onClick={() => imageInputRef.current?.click()}
                                        disabled={isAnalyzing}
                                        className="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors disabled:opacity-60"
                                        title="Analyze Photo"
                                    >
                                        <Camera size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Result */}
                    {result && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Urgency Banner */}
                            <div className={`p-5 rounded-3xl border shadow-sm ${getUrgencyBg(result.urgency)}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getUrgencyColor(result.urgency)} text-white shadow-lg`}>
                                        <ShieldAlert size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Triage Level</p>
                                        <p className="text-xl font-bold text-slate-800">{result.urgency} Urgency</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed bg-white/60 p-3 rounded-xl">{result.reasoning}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Suggested Specialist</p>
                                    <p className="font-bold text-slate-800 text-sm">{result.suggestedDoctorType}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Est. Duration</p>
                                    <p className="font-bold text-slate-800 text-sm flex items-center gap-1"><Clock size={14} className="text-arya-600" /> {result.estimatedDuration}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Telehealth Score</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-grow bg-slate-100 rounded-full h-2">
                                            <div className="bg-arya-600 h-2 rounded-full transition-all" style={{ width: `${result.telehealthScore}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-arya-600">{result.telehealthScore}%</span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Specialty</p>
                                    <p className="font-bold text-slate-800 text-sm">{result.specialty}</p>
                                </div>
                            </div>

                            {/* Prep Tips */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-500" /> Preparation Tips
                                </h4>
                                <ul className="space-y-2">
                                    {result.prepTips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                            <span className="w-5 h-5 rounded-full bg-arya-100 text-arya-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Questions to Ask */}
                            <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 shadow-sm">
                                <h4 className="font-bold text-indigo-800 text-sm mb-3 flex items-center gap-2">
                                    <MessageCircle size={16} className="text-indigo-600" /> Questions to Ask Your Doctor
                                </h4>
                                <ul className="space-y-2">
                                    {result.questionsToAsk.map((q, i) => (
                                        <li key={i} className="text-sm text-indigo-700 bg-white/60 p-2 px-3 rounded-xl">"{q}"</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {!showSymptomInput && (
                        <div className="bg-gradient-to-br from-arya-50 to-indigo-50 p-8 rounded-3xl border border-arya-100 text-center">
                            <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                                <Activity size={32} className="text-arya-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-2">Select a Body Area</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">Tap on the body map to begin your AI-powered symptom analysis.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
