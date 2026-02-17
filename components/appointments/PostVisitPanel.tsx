import React from 'react';
import { X, FileText, Pill, Download, ClipboardList, Stethoscope } from 'lucide-react';
import { Appointment } from '../../types';

interface PostVisitPanelProps {
    appointment: Appointment;
    onClose: () => void;
}

export const PostVisitPanel: React.FC<PostVisitPanelProps> = ({ appointment, onClose }) => {
    const mockNotes = {
        diagnosis: 'Mild hypertension with seasonal allergies',
        doctorNotes: 'Patient presents with elevated BP (140/90). Recommend lifestyle modifications and follow-up in 4 weeks. Seasonal allergies managed with antihistamines.',
        prescriptions: [
            { name: 'Lisinopril 10mg', dosage: 'Once daily', duration: '30 days' },
            { name: 'Cetirizine 10mg', dosage: 'Once daily as needed', duration: '14 days' },
        ],
        vitals: { bp: '140/90', pulse: '78 bpm', temp: '98.6°F', weight: '175 lbs' },
        followUp: '4 weeks — recheck blood pressure',
        labsOrdered: ['Complete Metabolic Panel', 'Lipid Panel'],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileText size={20} className="text-arya-600" /> Visit Summary</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Visit Info */}
                    <div className="bg-arya-50 p-4 rounded-2xl border border-arya-100 flex items-center gap-4">
                        <div className="bg-arya-600 p-3 rounded-xl text-white"><Stethoscope size={24} /></div>
                        <div>
                            <p className="font-bold text-slate-800">{appointment.doctorName}</p>
                            <p className="text-sm text-slate-500">{appointment.specialty} • {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                        <h3 className="font-bold text-amber-800 text-sm mb-1 flex items-center gap-2"><ClipboardList size={14} /> Diagnosis</h3>
                        <p className="text-amber-700 text-sm">{mockNotes.diagnosis}</p>
                    </div>

                    {/* Vitals */}
                    <div>
                        <h3 className="font-bold text-slate-700 text-sm mb-3">Recorded Vitals</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(mockNotes.vitals).map(([key, val]) => (
                                <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{key === 'bp' ? 'Blood Pressure' : key === 'temp' ? 'Temperature' : key.charAt(0).toUpperCase() + key.slice(1)}</p>
                                    <p className="font-bold text-slate-800 text-lg">{val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Doctor Notes */}
                    <div>
                        <h3 className="font-bold text-slate-700 text-sm mb-2">Doctor's Notes</h3>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{mockNotes.doctorNotes}</p>
                    </div>

                    {/* Prescriptions */}
                    <div>
                        <h3 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2"><Pill size={14} /> Prescriptions</h3>
                        <div className="space-y-2">
                            {mockNotes.prescriptions.map((rx, i) => (
                                <div key={i} className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
                                    <div>
                                        <p className="font-bold text-green-800 text-sm">{rx.name}</p>
                                        <p className="text-xs text-green-600">{rx.dosage} • {rx.duration}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Labs Ordered */}
                    {mockNotes.labsOrdered.length > 0 && (
                        <div>
                            <h3 className="font-bold text-slate-700 text-sm mb-2">Labs Ordered</h3>
                            <div className="flex flex-wrap gap-2">
                                {mockNotes.labsOrdered.map((lab, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">{lab}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Follow-up */}
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-blue-800 text-sm mb-1">Follow-Up</h3>
                        <p className="text-blue-700 text-sm">{mockNotes.followUp}</p>
                    </div>

                    {/* Download */}
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                        <Download size={18} /> Download PDF Summary
                    </button>
                </div>
            </div>
        </div>
    );
};
