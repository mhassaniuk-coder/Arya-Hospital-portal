import React, { useState } from 'react';
import { X, ShieldCheck, User, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Appointment } from '../../types';

interface CheckInModalProps {
    appointment: Appointment;
    onClose: () => void;
    onCheckIn: (appointmentId: string) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ appointment, onClose, onCheckIn }) => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        identityConfirmed: false,
        insuranceConfirmed: false,
        allergies: '',
        currentMedications: '',
        reasonForVisit: appointment.symptoms || '',
        emergencyContact: '',
        covidSymptoms: false,
    });

    const handleSubmit = async () => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 1500));
        onCheckIn(appointment.id);
        setIsProcessing(false);
        setStep(3);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Online Check-In</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-5 animate-fade-in">
                            <div className="bg-arya-50 p-4 rounded-2xl border border-arya-100 text-center">
                                <p className="font-bold text-arya-700">{appointment.doctorName}</p>
                                <p className="text-sm text-arya-600">{appointment.time} • {appointment.specialty}</p>
                            </div>

                            {/* Identity */}
                            <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-arya-300 cursor-pointer transition-colors">
                                <input type="checkbox" checked={formData.identityConfirmed} onChange={e => setFormData(p => ({ ...p, identityConfirmed: e.target.checked }))} className="w-5 h-5 accent-arya-600 rounded" />
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm flex items-center gap-2"><User size={14} /> Confirm Identity</p>
                                    <p className="text-xs text-slate-400">I confirm I am {appointment.patientName || 'the patient'}</p>
                                </div>
                            </label>

                            {/* Insurance */}
                            <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-arya-300 cursor-pointer transition-colors">
                                <input type="checkbox" checked={formData.insuranceConfirmed} onChange={e => setFormData(p => ({ ...p, insuranceConfirmed: e.target.checked }))} className="w-5 h-5 accent-arya-600 rounded" />
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm flex items-center gap-2"><ShieldCheck size={14} /> Insurance Verified</p>
                                    <p className="text-xs text-slate-400">My insurance information is up to date</p>
                                </div>
                            </label>

                            {/* COVID */}
                            <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-arya-300 cursor-pointer transition-colors">
                                <input type="checkbox" checked={!formData.covidSymptoms} onChange={e => setFormData(p => ({ ...p, covidSymptoms: !e.target.checked }))} className="w-5 h-5 accent-arya-600 rounded" />
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm flex items-center gap-2"><AlertTriangle size={14} /> Health Screening</p>
                                    <p className="text-xs text-slate-400">No fever, cough, or respiratory symptoms</p>
                                </div>
                            </label>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.identityConfirmed || !formData.insuranceConfirmed}
                                className="w-full py-3 bg-arya-600 text-white rounded-xl font-bold hover:bg-arya-700 transition-colors disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-fade-in">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for Visit</label>
                                <textarea value={formData.reasonForVisit} onChange={e => setFormData(p => ({ ...p, reasonForVisit: e.target.value }))} placeholder="Describe briefly..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none resize-none h-20" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Known Allergies</label>
                                <input type="text" value={formData.allergies} onChange={e => setFormData(p => ({ ...p, allergies: e.target.value }))} placeholder="e.g. Penicillin, Latex (or None)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Current Medications</label>
                                <input type="text" value={formData.currentMedications} onChange={e => setFormData(p => ({ ...p, currentMedications: e.target.value }))} placeholder="e.g. Lipitor 20mg, Metformin (or None)" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact</label>
                                <input type="text" value={formData.emergencyContact} onChange={e => setFormData(p => ({ ...p, emergencyContact: e.target.value }))} placeholder="Name and phone number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none" />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="w-full py-3 bg-arya-600 text-white rounded-xl font-bold hover:bg-arya-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : 'Complete Check-In'}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Checked In!</h3>
                            <p className="text-slate-500 text-sm mb-6">You're all set. Please arrive 5 minutes before your scheduled time.</p>
                            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6">
                                <p className="text-sm font-bold text-green-700">Queue Position: #3</p>
                                <p className="text-xs text-green-600">Estimated wait: ~15 minutes</p>
                            </div>
                            <button onClick={onClose} className="w-full py-3 bg-arya-600 text-white rounded-xl font-bold hover:bg-arya-700 transition-colors">Done</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
