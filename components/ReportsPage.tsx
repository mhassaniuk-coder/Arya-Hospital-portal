import React, { useState } from 'react';
import { LabResults } from './reports/LabResults';
import { ImagingReports } from './reports/ImagingReports';
import { VaccinationRecords } from './reports/VaccinationRecords';
import { PrescriptionHistory } from './reports/PrescriptionHistory';
import { ClinicalDocuments } from './reports/ClinicalDocuments';
import { LabResult } from '../types';
import { Activity, FileImage, ShieldCheck, Pill, FileText, Upload, Plus } from 'lucide-react';

interface ReportsPageProps {
    labResults: LabResult[];
}

type Tab = 'labs' | 'imaging' | 'vaccines' | 'meds' | 'notes';

export const ReportsPage: React.FC<ReportsPageProps> = ({ labResults }) => {
    const [activeTab, setActiveTab] = useState<Tab>('labs');

    const tabs = [
        { id: 'labs', label: 'Lab Results', icon: Activity },
        { id: 'imaging', label: 'Radiology', icon: FileImage },
        { id: 'vaccines', label: 'Immunizations', icon: ShieldCheck },
        { id: 'meds', label: 'Medications', icon: Pill },
        { id: 'notes', label: 'Documents', icon: FileText },
    ];

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-6 animate-fade-in pb-24">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Medical Reports</h1>
                    <p className="text-slate-500">Centralized health records and analysis</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl border border-slate-200 font-semibold shadow-sm hover:bg-slate-50">
                        <Upload size={18} /> Upload
                    </button>
                    <button className="flex items-center gap-2 bg-arya-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md shadow-arya-200 hover:bg-arya-700">
                        <Plus size={18} /> Request Record
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 font-medium ${isActive
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Icon size={18} className={isActive ? 'text-arya-400' : 'text-slate-400'} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'labs' && <LabResults results={labResults} />}
                {activeTab === 'imaging' && <ImagingReports />}
                {activeTab === 'vaccines' && <VaccinationRecords />}
                {activeTab === 'meds' && <PrescriptionHistory />}
                {activeTab === 'notes' && <ClinicalDocuments />}
            </div>
        </div>
    );
};
