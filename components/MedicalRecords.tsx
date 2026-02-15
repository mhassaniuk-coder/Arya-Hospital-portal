import React, { useState } from 'react';
import { FileText, Download, Share2, Search, Filter, UploadCloud, Plus } from 'lucide-react';
import { LabResult } from '../types';

interface MedicalRecordsProps {
  labResults: LabResult[];
}

export const MedicalRecords: React.FC<MedicalRecordsProps> = ({ labResults }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Medical Records</h1>
                <p className="text-slate-500">Access your test results, documents, and history.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <button className="bg-arya-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md hover:bg-arya-700">
                    <Plus size={16} /> Upload Doc
                </button>
            </div>
        </div>

        {/* Upload Zone */}
        <div 
            className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-arya-500 bg-arya-50' : 'border-slate-300 hover:border-arya-400 hover:bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); alert('File uploaded (simulated)'); }}
        >
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <UploadCloud size={32} className="text-arya-600" />
            </div>
            <p className="font-bold text-slate-700">Drag & Drop records here</p>
            <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (Max 10MB)</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Test Name</th>
                            <th className="p-4 font-semibold">Result</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {labResults.map(result => (
                            <tr key={result.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(result.date).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-3 text-blue-500">
                                            <FileText size={18} />
                                        </div>
                                        <span className="font-medium text-slate-700 text-sm">{result.testName}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-semibold text-slate-700">
                                    {result.value} <span className="text-xs font-normal text-slate-400">{result.unit}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        result.status === 'normal' ? 'bg-green-100 text-green-700' :
                                        result.status === 'abnormal' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-arya-600 hover:bg-arya-50 rounded-lg transition-colors">
                                            <Download size={18} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-arya-600 hover:bg-arya-50 rounded-lg transition-colors">
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {labResults.length === 0 && (
                 <div className="p-8 text-center text-slate-500">
                     No records found.
                 </div>
            )}
        </div>
    </div>
  );
};
