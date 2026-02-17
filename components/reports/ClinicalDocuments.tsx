import React from 'react';
import { ClinicalNote } from '../../types';
import { FileText, Download, Stethoscope, Scissors } from 'lucide-react';

const MOCK_NOTES: ClinicalNote[] = [
    { id: 'n1', date: '2023-10-15', type: 'Consultation', doctorName: 'Dr. Sarah Smith', specialty: 'Cardiology', summary: 'Patient presented with mild palpitations. ECG performed showing sinus rhythm. Reassured.' },
    { id: 'n2', date: '2023-01-20', type: 'Discharge Summary', doctorName: 'Dr. James Wilson', specialty: 'General Surgery', summary: 'Post-operative course uneventful. Wound healing well. Discharged with oral analgesics.' },
    { id: 'n3', date: '2022-08-05', type: 'Operative Report', doctorName: 'Dr. James Wilson', specialty: 'General Surgery', summary: 'Laparoscopic Appendectomy. No complications.' },
];

export const ClinicalDocuments: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid gap-4">
                {MOCK_NOTES.map(note => (
                    <div key={note.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Date & Icon */}
                            <div className="flex md:flex-col items-center gap-3 md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                                <div className={`p-3 rounded-xl ${note.type === 'Operative Report' ? 'bg-red-50 text-red-500' :
                                        note.type === 'Discharge Summary' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                    {note.type === 'Operative Report' ? <Scissors size={24} /> :
                                        note.type === 'Discharge Summary' ? <FileText size={24} /> : <Stethoscope size={24} />}
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-slate-800">{new Date(note.date).toLocaleDateString()}</p>
                                    <p className="text-xs text-slate-400 capitalize">{note.type}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">{note.doctorName}</h3>
                                    <button className="text-slate-400 hover:text-arya-600 transition-colors">
                                        <Download size={20} />
                                    </button>
                                </div>
                                <p className="text-sm font-semibold text-arya-600 mb-3">{note.specialty}</p>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed">
                                    {note.summary}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
