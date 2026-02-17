import React, { useState, useRef } from 'react';
import { FileText, Download, Share2, UploadCloud, Plus, Sparkles, Loader2, X, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { LabResult } from '../types';
import { geminiService } from '../services/geminiService';

interface MedicalRecordsProps {
    labResults: LabResult[];
}

export const MedicalRecords: React.FC<MedicalRecordsProps> = ({ labResults }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [interpretingId, setInterpretingId] = useState<string | null>(null);
    const [interpretations, setInterpretations] = useState<Record<string, string>>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Doc Analysis State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [analyzingDoc, setAnalyzingDoc] = useState(false);
    const [docAnalysis, setDocAnalysis] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAnalyzingDoc(true);
        setDocAnalysis(null);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const resultStr = reader.result as string;
            const base64String = resultStr.split(',')[1];
            const mimeType = file.type;
            const analysis = await geminiService.analyzeDocument(base64String, mimeType);
            setDocAnalysis(analysis);
            setAnalyzingDoc(false);
        };
        reader.readAsDataURL(file);
    };

    const handleInterpret = async (result: LabResult) => {
        if (interpretations[result.id]) {
            setExpandedId(expandedId === result.id ? null : result.id);
            return;
        }

        setInterpretingId(result.id);
        setExpandedId(result.id);
        try {
            const interpretation = await geminiService.interpretLabResult(
                result.testName, result.value, result.unit, result.status
            );
            setInterpretations(prev => ({ ...prev, [result.id]: interpretation }));
        } catch {
            setInterpretations(prev => ({ ...prev, [result.id]: 'Unable to interpret at this time.' }));
        }
        setInterpretingId(null);
    };

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Medical Records</h1>
                    <p className="text-slate-500">Access your test results, documents, and history.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={analyzingDoc}
                        className="bg-arya-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md hover:bg-arya-700 disabled:opacity-70"
                    >
                        {analyzingDoc ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                        {analyzingDoc ? 'Analyzing...' : 'Upload Doc'}
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

            {/* Document Analysis Result Modal/Card */}
            {(analyzingDoc || docAnalysis) && (
                <div className="bg-indigo-50 rounded-3xl border border-indigo-100 p-6 animate-fade-in relative">
                    <button
                        onClick={() => { setDocAnalysis(null); setAnalyzingDoc(false); }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm">
                            {analyzingDoc ? <Loader2 size={24} className="animate-spin text-indigo-600" /> : <Sparkles size={24} className="text-indigo-600" />}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold text-indigo-900 text-lg mb-2">
                                {analyzingDoc ? 'Analyzing Document...' : 'AI Document Analysis'}
                            </h3>
                            {analyzingDoc ? (
                                <p className="text-indigo-700/80 text-sm">Extracting key data and summarizing details using Arya AI...</p>
                            ) : (
                                <div className="prose prose-sm prose-indigo text-slate-700 max-w-none">
                                    <p className="whitespace-pre-line leading-relaxed">{docAnalysis}</p>
                                    <div className="mt-4 flex gap-2">
                                        <button className="px-3 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-lg border border-indigo-200 hover:bg-indigo-50">Save to Records</button>
                                        <button className="px-3 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50">Share with Doctor</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                <React.Fragment key={result.id}>
                                    <tr className="hover:bg-slate-50/50 transition-colors group">
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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.status === 'normal' ? 'bg-green-100 text-green-700' :
                                                result.status === 'abnormal' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleInterpret(result)}
                                                    disabled={interpretingId === result.id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-arya-600 to-indigo-600 text-white rounded-lg text-xs font-bold hover:shadow-md transition-all disabled:opacity-60"
                                                    title="AI Interpret"
                                                >
                                                    {interpretingId === result.id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Brain size={14} />
                                                    )}
                                                    {interpretations[result.id] ? (expandedId === result.id ? 'Hide' : 'Show') : 'Explain'}
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-arya-600 hover:bg-arya-50 rounded-lg transition-colors">
                                                    <Download size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-arya-600 hover:bg-arya-50 rounded-lg transition-colors">
                                                    <Share2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* AI Interpretation Row */}
                                    {expandedId === result.id && (
                                        <tr className="animate-fade-in">
                                            <td colSpan={5} className="p-0">
                                                <div className="mx-4 mb-4 p-5 bg-gradient-to-r from-arya-50 to-indigo-50 rounded-2xl border border-arya-100">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">
                                                            <Sparkles size={18} className="text-arya-600" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-bold text-arya-900 text-sm">AI Interpretation</h4>
                                                                <button onClick={() => setExpandedId(null)} className="text-slate-400 hover:text-slate-600">
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                            {interpretingId === result.id ? (
                                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                                    <Loader2 size={14} className="animate-spin" />
                                                                    Analyzing your lab result...
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                                                    {interpretations[result.id]}
                                                                </p>
                                                            )}
                                                            <p className="text-[10px] text-slate-400 mt-3 italic">
                                                                ⚕️ This is AI-generated and not medical advice. Consult your doctor.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
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
