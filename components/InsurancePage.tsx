import React, { useState } from 'react';
import { CreditCard, FileText, CheckCircle, Clock, AlertTriangle, Sparkles, Loader2, DollarSign, Search, ShieldAlert, Info, X, Calculator, ClipboardList, Plus, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { InsuranceClaim, InsuranceCard } from '../types';
import { geminiService } from '../services/geminiService';

const CLAIMS: InsuranceClaim[] = [
    { id: 'CLM-001', date: '2023-10-15', provider: 'City Hospital', service: 'General Checkup', amount: 150.00, status: 'approved' },
    { id: 'CLM-002', date: '2023-09-20', provider: 'Dr. Emily Chen', service: 'Cardiology Consult', amount: 200.00, status: 'pending' },
];

type ActiveTab = 'overview' | 'bill-audit' | 'cost-estimate';

interface BillAuditResult {
    issues: { item: string; issue: string; severity: string }[];
    totalSavings: string;
    summary: string;
}

interface CostEstimate {
    estimatedTotal: string;
    outOfPocket: string;
    insurancePays: string;
    breakdown: string[];
    tips: string[];
}

interface InsurancePageProps {
    cards?: InsuranceCard[];
    onAddCard?: (card: InsuranceCard) => void;
}

export const InsurancePage: React.FC<InsurancePageProps> = ({ cards = [], onAddCard }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');


    // Cards State
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState<Partial<InsuranceCard>>({});

    // Bill Audit state
    const [billText, setBillText] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<BillAuditResult | null>(null);

    // Cost Estimate state
    const [procedure, setProcedure] = useState('');
    const [isEstimating, setIsEstimating] = useState(false);
    const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);

    const handleAddCard = () => {
        if (!newCard.provider || !newCard.memberId) return;
        const card: InsuranceCard = {
            id: `c${Date.now()}`,
            provider: newCard.provider,
            memberId: newCard.memberId,
            groupNumber: newCard.groupNumber || 'N/A',
            planName: newCard.planName || 'Standard',
            copayOffice: Number(newCard.copayOffice) || 0,
            copaySpecialist: Number(newCard.copaySpecialist) || 0,
            deductible: Number(newCard.deductible) || 0
        };
        if (onAddCard) {
            onAddCard(card);
        }
        setNewCard({});
        setShowAddCard(false);
        // Effect will handle checking index
    };

    // Switch to new card when added
    React.useEffect(() => {
        if (cards.length > 0) {
            setActiveCardIndex(cards.length - 1);
        }
    }, [cards.length]);

    const handleAuditBill = async () => {
        if (!billText.trim()) return;
        setIsAuditing(true);
        setAuditResult(null);
        try {
            const result = await geminiService.auditBill(billText);
            setAuditResult(result);
        } catch {
            setAuditResult({ issues: [], totalSavings: '$0', summary: 'Unable to audit bill at this time.' });
        }
        setIsAuditing(false);
    };

    const handleEstimateCost = async () => {
        if (!procedure.trim()) return;
        setIsEstimating(true);
        setCostEstimate(null);
        try {
            const result = await geminiService.estimateInsuranceCost(procedure, {
                coPay: cards[activeCardIndex].copayOffice,
                deductible: cards[activeCardIndex].deductible,
                deductibleMet: 800, // Mock value
                coInsurance: 20
            });
            setCostEstimate(result);
        } catch {
            setCostEstimate({ estimatedTotal: 'N/A', outOfPocket: 'N/A', insurancePays: 'N/A', breakdown: ['Unable to estimate'], tips: [] });
        }
        setIsEstimating(false);
    };

    const activeCard = cards[activeCardIndex];

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Insurance Wallet</h1>
                <button onClick={() => setShowAddCard(true)} className="text-arya-600 hover:bg-arya-50 p-2 rounded-xl flex items-center gap-2 font-medium text-sm transition-colors">
                    <Plus size={18} /> Add Card
                </button>
            </div>

            {/* Card Carousel */}
            <div className="relative w-full max-w-md mx-auto">
                <div className="h-56 perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl shadow-xl p-6 text-white backface-hidden flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="font-bold text-xl tracking-wider">{activeCard.provider}</div>
                                <CreditCard size={24} className="opacity-80" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-200 uppercase mb-1">Plan Name</p>
                                <p className="font-bold text-lg tracking-wide">{activeCard.planName}</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div><p className="text-xs text-blue-200 uppercase">Member ID</p><p className="font-mono font-bold tracking-widest">{activeCard.memberId}</p></div>
                                <div className="text-right"><p className="text-xs text-blue-200 uppercase">Group</p><p className="font-mono font-bold">{activeCard.groupNumber}</p></div>
                            </div>
                        </div>
                        {/* Back */}
                        <div className="absolute w-full h-full bg-slate-800 rounded-2xl shadow-xl p-6 text-white backface-hidden rotate-y-180 flex flex-col justify-between">
                            <div><p className="text-xs text-slate-400 uppercase font-bold mb-2">Provider Support</p><p className="font-bold">1-800-555-0199</p></div>
                            <div className="space-y-2 text-sm text-slate-300">
                                <div className="flex justify-between border-b border-slate-700 pb-1"><span>Co-Pay (Office)</span> <span className="text-white font-bold">${activeCard.copayOffice}</span></div>
                                <div className="flex justify-between border-b border-slate-700 pb-1"><span>Co-Pay (Specialist)</span> <span className="text-white font-bold">${activeCard.copaySpecialist}</span></div>
                                <div className="flex justify-between"><span>Deductible</span> <span className="text-white font-bold">${activeCard.deductible}</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Dots/Arrows */}
                {cards.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button
                            onClick={() => setActiveCardIndex(prev => prev > 0 ? prev - 1 : cards.length - 1)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-1">
                            {cards.map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i === activeCardIndex ? 'bg-arya-600' : 'bg-slate-200'}`} />
                            ))}
                        </div>
                        <button
                            onClick={() => setActiveCardIndex(prev => prev < cards.length - 1 ? prev + 1 : 0)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
                <p className="text-center text-xs text-slate-400 mt-2">Tap card to flip for details</p>
            </div>

            {/* Add Card Modal */}
            {showAddCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Add Insurance Card</h2>
                            <button onClick={() => setShowAddCard(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Provider</label>
                                <input type="text" value={newCard.provider || ''} onChange={e => setNewCard({ ...newCard, provider: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-arya-200" placeholder="e.g. Aetna, BlueCross" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Member ID</label>
                                    <input type="text" value={newCard.memberId || ''} onChange={e => setNewCard({ ...newCard, memberId: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-arya-200 font-mono" placeholder="ID Number" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Group #</label>
                                    <input type="text" value={newCard.groupNumber || ''} onChange={e => setNewCard({ ...newCard, groupNumber: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-arya-200 font-mono" placeholder="Group" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan Name</label>
                                <input type="text" value={newCard.planName || ''} onChange={e => setNewCard({ ...newCard, planName: e.target.value })} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-arya-200" placeholder="e.g. Gold PPO" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Office Copay</label>
                                    <input type="number" value={newCard.copayOffice || ''} onChange={e => setNewCard({ ...newCard, copayOffice: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-arya-200" placeholder="$25" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Specialist</label>
                                    <input type="number" value={newCard.copaySpecialist || ''} onChange={e => setNewCard({ ...newCard, copaySpecialist: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-arya-200" placeholder="$40" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deductible</label>
                                    <input type="number" value={newCard.deductible || ''} onChange={e => setNewCard({ ...newCard, deductible: Number(e.target.value) })} className="w-full p-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-arya-200" placeholder="$1000" />
                                </div>
                            </div>
                            <button onClick={handleAddCard} disabled={!newCard.provider || !newCard.memberId} className="w-full mt-2 bg-arya-600 text-white py-3 rounded-xl font-bold hover:bg-arya-700 transition-colors disabled:opacity-50">Save Card</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                {[
                    { id: 'overview' as ActiveTab, label: 'Claims', icon: FileText },
                    { id: 'bill-audit' as ActiveTab, label: 'Bill Auditor', icon: ClipboardList },
                    { id: 'cost-estimate' as ActiveTab, label: 'Cost Estimator', icon: Calculator },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">Recent Claims</div>
                    {CLAIMS.map(claim => (
                        <div key={claim.id} className="p-4 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-bold text-slate-800">{claim.provider}</p>
                                <p className="text-xs text-slate-500">{claim.service} • {claim.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800">${claim.amount}</p>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>{claim.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'bill-audit' && (
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                            <ShieldAlert className="text-arya-600" size={20} /> AI Bill Auditor
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">Paste your hospital bill items below. Our AI will scan for common billing errors, duplicate charges, and potential savings.</p>
                        <textarea
                            value={billText}
                            onChange={(e) => setBillText(e.target.value)}
                            placeholder={"Paste bill items here, e.g.:\nRoom & Board - $2,500\nIV Administration - $350\nIV Administration - $350\nSurgical Kit - $1,200\nAspirin (1 tablet) - $25\nPhysician Fee - $800\nRecovery Room - $600"}
                            rows={6}
                            className="w-full p-4 border border-slate-200 rounded-2xl text-sm resize-none focus:ring-2 focus:ring-arya-200 outline-none bg-slate-50 font-mono"
                        />
                        <button
                            onClick={handleAuditBill}
                            disabled={isAuditing || !billText.trim()}
                            className="mt-3 w-full bg-gradient-to-r from-arya-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60"
                        >
                            {isAuditing ? <><Loader2 size={18} className="animate-spin" /> Auditing Bill...</> : <><Sparkles size={18} /> Audit My Bill</>}
                        </button>
                    </div>

                    {auditResult && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-800">Audit Summary</h4>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                        Potential Savings: {auditResult.totalSavings}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl">{auditResult.summary}</p>

                                {auditResult.issues.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-bold text-slate-400 uppercase">Issues Found</h5>
                                        {auditResult.issues.map((issue, i) => (
                                            <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 ${issue.severity === 'error' ? 'bg-red-50 border-red-200' :
                                                issue.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                                                    'bg-blue-50 border-blue-200'
                                                }`}>
                                                {issue.severity === 'error' ? <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" /> :
                                                    issue.severity === 'warning' ? <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" /> :
                                                        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />}
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800">{issue.item}</p>
                                                    <p className="text-xs text-slate-600">{issue.issue}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'cost-estimate' && (
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4">
                            <Calculator className="text-arya-600" size={20} /> Insurance Cost Estimator
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">Enter a procedure or service name to estimate your out-of-pocket costs based on your insurance plan.</p>

                        <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500 mb-4 space-y-1">
                            <p><span className="font-bold">Your Plan:</span> BlueCross PPO</p>
                            <p><span className="font-bold">Co-Pay:</span> $25 | <span className="font-bold">Deductible:</span> $1,500 (Met: $800) | <span className="font-bold">Co-Insurance:</span> 20%</p>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={procedure}
                                onChange={(e) => setProcedure(e.target.value)}
                                placeholder="e.g., MRI of knee, blood panel, colonoscopy..."
                                className="flex-grow px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none bg-slate-50"
                            />
                            <button
                                onClick={handleEstimateCost}
                                disabled={isEstimating || !procedure.trim()}
                                className="bg-gradient-to-r from-arya-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2 shrink-0"
                            >
                                {isEstimating ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
                                Estimate
                            </button>
                        </div>
                    </div>

                    {costEstimate && (
                        <div className="animate-fade-in space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Cost</p>
                                    <p className="text-xl font-bold text-slate-800">{costEstimate.estimatedTotal}</p>
                                </div>
                                <div className="bg-arya-50 p-4 rounded-2xl border border-arya-100 shadow-sm text-center">
                                    <p className="text-[10px] font-bold text-arya-500 uppercase mb-1">You Pay</p>
                                    <p className="text-xl font-bold text-arya-700">{costEstimate.outOfPocket}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm text-center">
                                    <p className="text-[10px] font-bold text-green-500 uppercase mb-1">Insurance</p>
                                    <p className="text-xl font-bold text-green-700">{costEstimate.insurancePays}</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                <h4 className="font-bold text-slate-800 text-sm mb-3">Cost Breakdown</h4>
                                <ul className="space-y-2">
                                    {costEstimate.breakdown.map((item, i) => (
                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                            <span className="w-5 h-5 rounded-full bg-arya-100 text-arya-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {costEstimate.tips.length > 0 && (
                                <div className="bg-green-50 p-5 rounded-3xl border border-green-100 shadow-sm">
                                    <h4 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
                                        <Sparkles size={16} className="text-green-600" /> Money-Saving Tips
                                    </h4>
                                    <ul className="space-y-2">
                                        {costEstimate.tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-green-700 bg-white/60 p-2 px-3 rounded-xl">💡 {tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
