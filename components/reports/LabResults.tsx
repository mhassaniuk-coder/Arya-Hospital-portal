import React, { useState } from 'react';
import {
    FileText, Brain, ChevronDown, ChevronUp, Search, Filter,
    Activity, TrendingUp, AlertCircle, CheckCircle, Download, Share2
} from 'lucide-react';
import { LabResult } from '../../types';
import { geminiService } from '../../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface LabResultsProps {
    results: LabResult[];
}

export const LabResults: React.FC<LabResultsProps> = ({ results }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'normal' | 'abnormal'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [selectedTestTrend, setSelectedTestTrend] = useState<string | null>(null);

    // Filter logic
    const filteredResults = results.filter(r => {
        const matchesSearch = r.testName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || r.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Mock Trend Data generator
    const getTrendData = (testName: string) => {
        return [
            { date: '2023-01-15', value: 85, range: [70, 99] },
            { date: '2023-04-20', value: 92, range: [70, 99] },
            { date: '2023-08-10', value: 88, range: [70, 99] },
            { date: '2023-11-05', value: 95, range: [70, 99] },
        ];
    };

    const handleAnalyze = async (result: LabResult) => {
        if (aiAnalysis[result.id]) {
            setExpandedId(expandedId === result.id ? null : result.id);
            return;
        }
        setAnalyzingId(result.id);
        setExpandedId(result.id);
        try {
            const summary = await geminiService.interpretLabResult(result.testName, result.value, result.unit, result.status);
            setAiAnalysis(prev => ({ ...prev, [result.id]: summary }));
        } catch (e) {
            setAiAnalysis(prev => ({ ...prev, [result.id]: "Unable to generate analysis. Please try again." }));
        }
        setAnalyzingId(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search test names..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('abnormal')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'abnormal' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'}`}
                    >
                        Abnormal
                    </button>
                </div>
            </div>

            {/* Results List */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {filteredResults.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredResults.map(result => (
                            <div key={result.id} className="group hover:bg-slate-50 transition-colors">
                                <div className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4">

                                    {/* Icon & Basic Info */}
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className={`p-3 rounded-xl ${result.status === 'abnormal' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                            <Activity size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{result.testName}</h3>
                                            <p className="text-slate-500 text-sm">{new Date(result.date).toLocaleDateString()} • Ref: #{result.id.slice(0, 6)}</p>
                                        </div>
                                    </div>

                                    {/* Value & Status */}
                                    <div className="flex flex-col items-end min-w-[120px]">
                                        <span className="text-xl font-bold text-slate-800">{result.value} <span className="text-sm font-normal text-slate-500">{result.unit}</span></span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${result.status === 'abnormal' ? 'bg-red-100 text-red-600' :
                                                result.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {result.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto justify-end">
                                        <button
                                            onClick={() => setSelectedTestTrend(selectedTestTrend === result.id ? null : result.id)}
                                            className={`p-2 rounded-lg transition-colors ${selectedTestTrend === result.id ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
                                            title="View Trend"
                                        >
                                            <TrendingUp size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleAnalyze(result)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${expandedId === result.id ? 'bg-arya-100 text-arya-700' : 'bg-arya-50 text-arya-600 hover:bg-arya-100'
                                                }`}
                                        >
                                            <Brain size={16} />
                                            {analyzingId === result.id ? 'Analyzing...' : 'AI Insight'}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded AI Insight */}
                                {expandedId === result.id && (
                                    <div className="px-4 pb-4 md:px-20 md:pb-6 animate-fade-in">
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Brain size={100} />
                                            </div>
                                            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Brain size={16} /> AI Interpretation</h4>
                                            <p className="text-indigo-800/80 text-sm leading-relaxed relative z-10">
                                                {aiAnalysis[result.id] || "Analyzing result data..."}
                                            </p>

                                            <div className="mt-4 flex gap-3 relative z-10">
                                                <button className="text-xs bg-white/50 hover:bg-white text-indigo-700 px-3 py-1.5 rounded-lg font-semibold transition-colors border border-indigo-100 flex items-center gap-1">
                                                    <Download size={12} /> Save PDF
                                                </button>
                                                <button className="text-xs bg-white/50 hover:bg-white text-indigo-700 px-3 py-1.5 rounded-lg font-semibold transition-colors border border-indigo-100 flex items-center gap-1">
                                                    <Share2 size={12} /> Share with Doctor
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Trend Chart */}
                                {selectedTestTrend === result.id && (
                                    <div className="px-4 pb-4 md:px-20 md:pb-6 animate-fade-in">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-64">
                                            <h4 className="text-sm font-bold text-slate-600 mb-4">{result.testName} History</h4>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={getTrendData(result.testName)}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                                                    />
                                                    <ReferenceLine y={100} label="Max" stroke="red" strokeDasharray="3 3" />
                                                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={30} className="text-slate-300" />
                        </div>
                        <h3 className="text-slate-800 font-bold text-lg">No results found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
