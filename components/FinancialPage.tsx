import React, { useState } from 'react';
import { DollarSign, Calculator, CreditCard, FileCheck, PieChart, Wallet } from 'lucide-react';
import { CostEstimator } from './financial/CostEstimator';
import { SmartPaymentPlans } from './financial/SmartPaymentPlans';
import { PriorAuthTracker } from './financial/PriorAuthTracker';
import { FsaManager } from './financial/FsaManager';
import { FinancialReports } from './financial/FinancialReports';

type FinancialTab = 'overview' | 'estimate' | 'payments' | 'auth' | 'fsa' | 'reports';

export const FinancialPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FinancialTab>('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'estimate': return <CostEstimator />;
            case 'payments': return <SmartPaymentPlans />;
            case 'auth': return <PriorAuthTracker />;
            case 'fsa': return <FsaManager />;
            case 'reports': return <FinancialReports />;
            default: return (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Financial Guidance</h2>
                            <p className="text-emerald-100 mb-6 max-w-lg">Manage your healthcare expenses with AI-powered tools. Estimate costs, track insurance, and optimize your spending.</p>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => setActiveTab('estimate')} className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-colors flex items-center gap-2">
                                    <Calculator size={20} /> Estimate Cost
                                </button>
                                <button onClick={() => setActiveTab('payments')} className="bg-emerald-500/30 text-white px-6 py-3 rounded-xl font-bold border border-white/20 hover:bg-emerald-500/40 transition-colors flex items-center gap-2">
                                    <CreditCard size={20} /> View Bill
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button onClick={() => setActiveTab('auth')} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
                            <div className="bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                                <FileCheck size={24} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">Prior Authorization</h3>
                            <p className="text-slate-500 text-sm">Track real-time status of insurance approvals.</p>
                        </button>

                        <button onClick={() => setActiveTab('fsa')} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
                            <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                <Wallet size={24} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">FSA/HSA Manager</h3>
                            <p className="text-slate-500 text-sm">Manage tax-advantaged funds and eligible items.</p>
                        </button>

                        <button onClick={() => setActiveTab('reports')} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group">
                            <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                                <PieChart size={24} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">Financial Reports</h3>
                            <p className="text-slate-500 text-sm">Analyze your healthcare spending trends.</p>
                        </button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-6 bg-slate-50/50 animate-fade-in pb-24 md:pb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <DollarSign className="text-emerald-600" /> Financial Services
            </h1>

            {/* In-page Nav */}
            {activeTab !== 'overview' && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <button onClick={() => setActiveTab('overview')} className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 whitespace-nowrap">
                        ← Back to Overview
                    </button>
                    <div className="h-6 w-px bg-slate-300 mx-2"></div>
                    <button onClick={() => setActiveTab('estimate')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'estimate' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Estimate</button>
                    <button onClick={() => setActiveTab('payments')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'payments' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Payments</button>
                    <button onClick={() => setActiveTab('auth')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'auth' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Prior Auth</button>
                    <button onClick={() => setActiveTab('fsa')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'fsa' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>FSA/HSA</button>
                    <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'reports' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Reports</button>
                </div>
            )}

            {renderContent()}
        </div>
    );
};
