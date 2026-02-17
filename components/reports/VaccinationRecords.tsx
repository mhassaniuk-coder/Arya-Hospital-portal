import React from 'react';
import { Vaccination } from '../../types';
import { ShieldCheck, Calendar, CheckCircle, AlertCircle, Syringe } from 'lucide-react';

const MOCK_VACCINES: Vaccination[] = [
    { id: 'v1', vaccineName: 'Influenza (Flu)', dateGiven: '2023-10-15', status: 'Completed', provider: 'Arya Clinic' },
    { id: 'v2', vaccineName: 'COVID-19 Booster', dateGiven: '2023-01-20', status: 'Completed', provider: 'City Health Center' },
    { id: 'v3', vaccineName: 'Tetanus (Tdap)', dateGiven: '2019-05-12', dueDate: '2029-05-12', status: 'Completed', provider: 'Dr. Smith' },
    { id: 'v4', vaccineName: 'Hepatitis B', dateGiven: '2024-05-10', dueDate: '2024-05-10', status: 'Due', provider: 'Pending' }
];

export const VaccinationRecords: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Immunization Record</h2>
                        <p className="text-blue-100">Official digital tracking of your vaccines.</p>
                    </div>
                    <ShieldCheck size={48} className="text-blue-100 opacity-50" />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                    <Syringe className="text-arya-600" size={20} /> Vaccine History
                </h3>

                <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                    {MOCK_VACCINES.map((v, i) => (
                        <div key={v.id} className="relative pl-8">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${v.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'
                                }`} />

                            <div className="bg-slate-50 p-4 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800">{v.vaccineName}</h4>
                                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {v.status}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {v.status === 'Completed' ? `Given: ${new Date(v.dateGiven).toLocaleDateString()}` : `Due: ${new Date(v.dateGiven).toLocaleDateString()}`}
                                    </div>
                                    <div>
                                        Location: {v.provider}
                                    </div>
                                </div>

                                {v.status === 'Due' && (
                                    <button className="mt-3 w-full bg-arya-600 text-white text-sm font-bold py-2 rounded-xl hover:bg-arya-700 transition-colors">
                                        Schedule Appointment
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
