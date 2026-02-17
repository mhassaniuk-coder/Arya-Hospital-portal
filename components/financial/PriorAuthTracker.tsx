import React from 'react';
import { FileCheck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const PriorAuthTracker: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><FileCheck className="text-indigo-600" /> Prior Authorizations</h2>

                <div className="space-y-6">
                    {/* Item 1 */}
                    <div className="border border-slate-200 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800">MRI - Lumbar Spine</h3>
                                <p className="text-sm text-slate-500">Dr. Sarah Smith • Ordered Oct 24</p>
                            </div>
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Clock size={12} /> In Review
                            </span>
                        </div>

                        <div className="relative flex justify-between items-center">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

                            <div className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"><CheckCircle size={16} /></div>
                                <span className="text-xs font-bold text-slate-700">Submitted</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"><CheckCircle size={16} /></div>
                                <span className="text-xs font-bold text-slate-700">Received</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center animate-pulse"><Clock size={16} /></div>
                                <span className="text-xs font-bold text-amber-600">Reviewing</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 bg-white px-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center"><CheckCircle size={16} /></div>
                                <span className="text-xs font-bold text-slate-400">Decision</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 bg-slate-50 p-3 rounded-lg"><AlertCircle size={12} className="inline mr-1" /> Est. completion: Oct 28 (3 days left)</p>
                    </div>

                    {/* Item 2 */}
                    <div className="border border-slate-200 rounded-2xl p-5 relative overflow-hidden opacity-70">
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-slate-800">Physical Therapy (12 Sessions)</h3>
                                <p className="text-sm text-slate-500">Dr. James Wilson • Ordered Sep 15</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <CheckCircle size={12} /> Approved
                            </span>
                        </div>
                        <p className="text-xs text-green-600 mt-2">Authorization #AUTH-99283 • Valid until Dec 31, 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
