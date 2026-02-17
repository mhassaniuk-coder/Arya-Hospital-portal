import React, { useState } from 'react';
import { Calculator, CheckCircle, HelpCircle, DollarSign } from 'lucide-react';

export const CostEstimator: React.FC = () => {
    const [selectedService, setSelectedService] = useState('MRI Scan');
    const [cost, setCost] = useState(1200);

    // Mock insurance logic
    const deductible = 500;
    const deductibleMet = 200;
    const coinsurance = 0.2; // 20%
    const copay = 50;

    const remainingDeductible = Math.max(0, deductible - deductibleMet);
    const amountSubjectToCoinsurance = Math.max(0, cost - remainingDeductible);
    const patientCoinsurance = amountSubjectToCoinsurance * coinsurance;
    const estimatedTotal = remainingDeductible + patientCoinsurance + copay;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Calculator className="text-indigo-600" /> Estimate Your Cost</h2>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Procedure</label>
                    <select
                        value={selectedService}
                        onChange={(e) => { setSelectedService(e.target.value); setCost(e.target.value === 'MRI Scan' ? 1200 : 150); }}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                    >
                        <option value="MRI Scan">MRI Scan ($1,200)</option>
                        <option value="X-Ray">X-Ray ($150)</option>
                        <option value="Blood Panel">Comprehensive Blood Panel ($300)</option>
                        <option value="Specialist Visit">Specialist Consultation ($250)</option>
                    </select>
                </div>

                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-indigo-100">
                        <span className="text-indigo-900 font-medium">Network Rate</span>
                        <span className="font-bold text-indigo-900">${cost}</span>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Remaining Deductible</span>
                            <span>+ ${remainingDeductible}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Co-pay</span>
                            <span>+ ${copay}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Co-insurance (20%)</span>
                            <span>+ ${patientCoinsurance.toFixed(0)}</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-between items-center">
                        <span className="font-bold text-xl text-indigo-900">Your Estimate</span>
                        <span className="font-bold text-2xl text-indigo-600">${estimatedTotal.toFixed(0)}</span>
                    </div>
                </div>

                <p className="text-xs text-slate-400 text-center"><HelpCircle size={12} className="inline mr-1" /> This is an estimate based on your Aetna plan benefits. Final responsibility may vary.</p>
            </div>
        </div>
    );
};
