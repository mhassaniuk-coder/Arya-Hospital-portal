import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Calendar, Pill, TestTube, Heart, Brain } from 'lucide-react';
import { Appointment } from '../../types';
import { geminiService } from '../../services/geminiService';

interface FollowUpPanelProps {
    appointment: Appointment;
    onClose: () => void;
}

interface FollowUpData {
    timeline: string;
    suggestedTests: string[];
    lifestyleChanges: string[];
    medications: string[];
    nextAppointment: string;
    summary: string;
}

export const FollowUpPanel: React.FC<FollowUpPanelProps> = ({ appointment, onClose }) => {
    const [data, setData] = useState<FollowUpData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const generateFollowUp = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await geminiService.chat(
                `Based on a completed ${appointment.specialty} appointment for "${appointment.symptoms || 'general checkup'}" with ${appointment.doctorName}, generate follow-up recommendations. Return a JSON object with: timeline (when to follow up), suggestedTests (array of recommended lab tests), lifestyleChanges (array of lifestyle recommendations), medications (array of medication-related notes), nextAppointment (suggested next visit), summary (2-3 sentence overview). Be specific and practical.`
            );
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    setData(JSON.parse(jsonMatch[0]));
                } else {
                    setData({
                        timeline: '4-6 weeks',
                        suggestedTests: ['Complete Blood Count', 'Metabolic Panel'],
                        lifestyleChanges: ['Increase daily walking to 30 minutes', 'Reduce sodium intake', 'Monitor blood pressure weekly'],
                        medications: ['Continue current medications as prescribed', 'Report any side effects immediately'],
                        nextAppointment: 'Follow-up in 4 weeks to reassess',
                        summary: response.slice(0, 200)
                    });
                }
            } catch {
                setData({
                    timeline: '4-6 weeks',
                    suggestedTests: ['Routine bloodwork', 'Follow-up imaging if needed'],
                    lifestyleChanges: ['Maintain balanced diet', 'Regular exercise', 'Adequate sleep'],
                    medications: ['Take medications as directed'],
                    nextAppointment: 'Schedule follow-up within 4-6 weeks',
                    summary: 'Based on your visit, we recommend a follow-up to monitor progress. Continue prescribed treatments and maintain healthy habits.'
                });
            }
        } catch {
            setError(true);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white shrink-0">
                    <h2 className="font-bold flex items-center gap-2"><Brain size={20} /> AI Follow-Up Plan</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><X size={18} /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {!data && !loading && (
                        <div className="text-center py-8 animate-fade-in">
                            <Sparkles size={48} className="text-purple-400 mx-auto mb-4" />
                            <h3 className="font-bold text-slate-800 text-lg mb-2">AI Follow-Up Recommendations</h3>
                            <p className="text-sm text-slate-500 mb-6">Get personalized follow-up advice for your visit with {appointment.doctorName}.</p>
                            <button
                                onClick={generateFollowUp}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Generate Recommendations
                            </button>
                            {error && <p className="text-sm text-red-500 mt-3">Failed to generate. Please try again.</p>}
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12 animate-fade-in">
                            <Loader2 size={40} className="animate-spin text-purple-600 mx-auto mb-4" />
                            <p className="text-sm text-slate-500">Analyzing your visit and generating recommendations...</p>
                        </div>
                    )}

                    {data && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                                <p className="text-sm text-purple-800">{data.summary}</p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                                <Calendar size={18} className="text-blue-600" />
                                <div>
                                    <p className="text-xs font-bold text-blue-800 uppercase">Follow-Up Timeline</p>
                                    <p className="text-sm text-blue-700">{data.timeline}</p>
                                </div>
                            </div>

                            {data.suggestedTests.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><TestTube size={12} /> Recommended Tests</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.suggestedTests.map((t, i) => (
                                            <span key={i} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-100">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data.lifestyleChanges.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Heart size={12} /> Lifestyle Recommendations</h4>
                                    <ul className="space-y-1.5">
                                        {data.lifestyleChanges.map((l, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><ArrowRight size={14} className="text-green-500 mt-0.5 shrink-0" />{l}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {data.medications.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1"><Pill size={12} /> Medication Notes</h4>
                                    <ul className="space-y-1.5">
                                        {data.medications.map((m, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2"><ArrowRight size={14} className="text-amber-500 mt-0.5 shrink-0" />{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <p className="text-[10px] text-slate-400 italic text-center">⚕️ AI-generated. Always consult your doctor for medical decisions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
