import React, { useState } from 'react';
import { CreditCard, Calendar, Check } from 'lucide-react';

export const SmartPaymentPlans: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const billAmount = 1250;

    const plans = [
        { id: 1, months: 3, interest: 0, monthly: billAmount / 3, fee: 0 },
        { id: 2, months: 6, interest: 5, monthly: (billAmount * 1.05) / 6, fee: 25 },
        { id: 3, months: 12, interest: 10, monthly: (billAmount * 1.10) / 12, fee: 50 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Payment Options</h2>
                        <p className="text-slate-500 text-sm">Total Due: <span className="font-bold text-slate-900">${billAmount.toFixed(2)}</span></p>
                    </div>
                    <button className="text-indigo-600 font-bold text-sm hover:underline">View Bill Details</button>
                </div>

                <div className="space-y-4">
                    {plans.map(plan => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedPlan === plan.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                                    {selectedPlan === plan.id && <Check size={14} className="text-white" />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{plan.months} Monthly Payments</p>
                                    <p className="text-xs text-slate-500">
                                        {plan.interest === 0 ? 'Interest Free' : `${plan.interest}% Interest`} • One-time fee: ${plan.fee}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-indigo-900">${plan.monthly.toFixed(2)}</p>
                                <p className="text-xs text-slate-400">/mo</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    disabled={!selectedPlan}
                    className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    Set Up Plan
                </button>
            </div>
        </div>
    );
};
