import React from 'react';
import { BarChart, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

export const FinancialReports: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">Spending Overview</h2>
                <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Healthcare</p>
                    <h3 className="text-2xl font-bold text-slate-800">$1,240</h3>
                    <div className="flex items-center gap-1 text-xs text-red-500 mt-1 font-bold">
                        <ArrowUpRight size={12} /> +12% vs last year
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Insurance Paid</p>
                    <h3 className="text-2xl font-bold text-slate-800">$8,450</h3>
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-1 font-bold">
                        <ArrowUpRight size={12} /> +5% coverage
                    </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Out of Pocket</p>
                    <h3 className="text-2xl font-bold text-slate-800">$450</h3>
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-1 font-bold">
                        <ArrowDownRight size={12} /> -8% vs last year
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-64 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-end justify-between px-8 pb-8 pt-16 gap-4">
                    {[30, 45, 25, 60, 40, 75, 50, 65, 35, 55, 45, 80].map((h, i) => (
                        <div key={i} className="w-full bg-indigo-100 rounded-t-xl relative group hover:bg-indigo-200 transition-colors" style={{ height: `${h}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                ${h * 20}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute top-6 left-6 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <div className="w-3 h-3 bg-indigo-100 rounded-full"></div> Monthly Spend
                    </div>
                </div>
            </div>
        </div>
    );
};
