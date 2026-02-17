import React from 'react';
import { Medication } from '../../types';
import { Pill, Clock, RotateCw, AlertTriangle, FileText } from 'lucide-react';

const MOCK_MEDS: Medication[] = [
    { id: 'm1', name: 'Amoxicillin', dosage: '500mg', frequency: '3x daily', refillsRemaining: 0, prescribedBy: 'Dr. Sarah', status: 'active' },
    { id: 'm2', name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', refillsRemaining: 2, prescribedBy: 'Dr. House', status: 'active' },
    { id: 'm3', name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', refillsRemaining: 0, prescribedBy: 'Dr. Sarah', status: 'completed' },
];

export const PrescriptionHistory: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Prescriptions</h2>
                    <p className="text-slate-500">Manage active medications and history</p>
                </div>
                <button className="bg-arya-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-arya-700 transition-all flex items-center gap-2">
                    <Pill size={18} /> Request Refill
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Active Meds */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" /> Active Medications
                    </h3>
                    {MOCK_MEDS.filter(m => m.status === 'active').map(med => (
                        <div key={med.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <Pill size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{med.name}</h4>
                                        <p className="text-slate-500 font-medium">{med.dosage}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-bold">Active</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-t border-slate-50">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Frequency</p>
                                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                        <Clock size={14} className="text-arya-500" /> {med.frequency}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Refills Left</p>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <div className={`h-2 w-16 rounded-full bg-slate-100 overflow-hidden`}>
                                            <div className={`h-full ${med.refillsRemaining > 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${(med.refillsRemaining / 5) * 100}%` }}></div>
                                        </div>
                                        <span className={med.refillsRemaining < 1 ? 'text-red-500' : 'text-slate-700'}>{med.refillsRemaining}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold transition-colors">
                                    View Details
                                </button>
                                {med.refillsRemaining > 0 && (
                                    <button className="flex-1 py-2 bg-arya-50 hover:bg-arya-100 text-arya-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                                        <RotateCw size={14} /> Refill
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Past Meds */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2 opacity-70">
                        <span className="w-2 h-2 rounded-full bg-slate-300" /> Past Medications
                    </h3>
                    {MOCK_MEDS.filter(m => m.status === 'completed').map(med => (
                        <div key={med.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-700">{med.name}</h4>
                                    <p className="text-sm text-slate-500">{med.dosage}</p>
                                </div>
                                <span className="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded-lg font-bold">Ended</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Prescribed by {med.prescribedBy}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
