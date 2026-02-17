import React, { useState } from 'react';
import { Pill, Truck, Clock, CheckCircle, Package, AlertCircle, ShieldAlert, Search, Plus, Loader2 } from 'lucide-react';
import { Medication } from '../types';
import { geminiService } from '../services/geminiService';

interface PharmacyPageProps {
    medications: Medication[];
}

export const PharmacyPage: React.FC<PharmacyPageProps> = ({ medications }) => {
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [newMedInput, setNewMedInput] = useState('');
    const [checkingInteraction, setCheckingInteraction] = useState(false);
    const [interactionResult, setInteractionResult] = useState<{ hasInteraction: boolean; severity: string; details: string; recommendations: string[] } | null>(null);

    const handleCheckInteraction = async () => {
        if (!newMedInput.trim()) return;
        setCheckingInteraction(true);
        setInteractionResult(null);

        const currentMeds = medications.map(m => m.name);
        const result = await geminiService.checkMedicationInteractions(currentMeds, newMedInput);

        setInteractionResult(result);
        setCheckingInteraction(false);
    };

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pharmacy & Meds</h1>
                    <p className="text-slate-500 text-sm">Manage prescriptions and track deliveries.</p>
                </div>
                <button className="bg-arya-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-arya-700">Request Refill</button>
            </div>

            {/* Delivery Tracker */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-full text-green-600"><Truck size={20} /></div>
                    <h3 className="font-bold text-slate-800">Order #RX-9921 Delivery</h3>
                </div>
                <div className="relative pt-6 pb-2">
                    <div className="h-2 bg-slate-100 rounded-full mb-4">
                        <div className="h-full bg-green-500 rounded-full w-3/4 relative">
                            <div className="absolute right-0 -top-1 w-4 h-4 bg-white border-4 border-green-500 rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span className="text-green-600">Processing</span>
                        <span className="text-green-600">Shipped</span>
                        <span className="text-green-600">Out for Delivery</span>
                        <span>Delivered</span>
                    </div>
                </div>
                <p className="text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    Your package containing <strong>Lipitor (20mg)</strong> is arriving today by 6:00 PM.
                </p>
            </div>

            {/* Meds List */}
            <div className="grid md:grid-cols-2 gap-4">
                {medications.map(med => (
                    <div key={med.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                                <Pill size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">{med.name}</h4>
                                <p className="text-sm text-slate-500 font-medium">{med.dosage} • {med.frequency}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{med.refillsRemaining} Refills Left</span>
                                    {med.refillsRemaining < 1 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-bold flex items-center gap-1"><AlertCircle size={10} /> Renew</span>}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-xs text-slate-400 font-bold uppercase mb-1">Status</span>
                            <span className="text-green-600 font-bold text-sm flex items-center justify-end gap-1"><CheckCircle size={14} /> Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Drug Interaction Checker */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                        <ShieldAlert size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg">Drug Interaction Safety Check</h3>
                        <p className="text-indigo-600/70 text-sm">Check a new medication or supplement against your current prescriptions.</p>
                    </div>
                </div>

                <div className="max-w-2xl bg-white p-2 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-2 mb-6 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                    <Search className="text-slate-400 ml-3" size={20} />
                    <input
                        type="text"
                        value={newMedInput}
                        onChange={(e) => setNewMedInput(e.target.value)}
                        placeholder="Enter drug name (e.g. Aspirin, Ibuprofen)..."
                        className="flex-grow bg-transparent p-2 outline-none text-slate-700 font-medium placeholder:text-slate-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleCheckInteraction()}
                    />
                    <button
                        onClick={handleCheckInteraction}
                        disabled={!newMedInput.trim() || checkingInteraction}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {checkingInteraction ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                        {checkingInteraction ? 'Checking...' : 'Check Safety'}
                    </button>
                </div>

                {interactionResult && (
                    <div className={`rounded-2xl border p-5 animate-fade-in ${interactionResult.hasInteraction
                            ? interactionResult.severity === 'severe' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                            : 'bg-green-50 border-green-200'
                        }`}>
                        <div className="flex items-start gap-4">
                            {interactionResult.hasInteraction ? (
                                <div className={`p-2 rounded-full shrink-0 ${interactionResult.severity === 'severe' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                    <AlertCircle size={24} />
                                </div>
                            ) : (
                                <div className="p-2 rounded-full shrink-0 bg-green-100 text-green-600">
                                    <CheckCircle size={24} />
                                </div>
                            )}

                            <div>
                                <h4 className={`font-bold text-lg mb-1 ${interactionResult.hasInteraction
                                        ? interactionResult.severity === 'severe' ? 'text-red-800' : 'text-orange-800'
                                        : 'text-green-800'
                                    }`}>
                                    {interactionResult.hasInteraction
                                        ? `Interaction Detected (${interactionResult.severity.toUpperCase()})`
                                        : 'No Known Interactions Found'}
                                </h4>
                                <p className={`text-sm leading-relaxed mb-3 ${interactionResult.hasInteraction ? 'text-slate-700' : 'text-green-700'
                                    }`}>
                                    {interactionResult.details}
                                </p>

                                {interactionResult.recommendations && interactionResult.recommendations.length > 0 && (
                                    <div className="bg-white/60 rounded-xl p-3">
                                        <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Recommendations</p>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                            {interactionResult.recommendations.map((rec, i) => (
                                                <li key={i}>{rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
