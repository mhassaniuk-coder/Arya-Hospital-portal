import React from 'react';
import { CreditCard, ShoppingBag, Receipt, PieChart } from 'lucide-react';

export const FsaManager: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-blue-200 font-bold text-sm uppercase mb-1">Health Savings Account</p>
                        <h2 className="text-4xl font-bold mb-4">$2,450.00</h2>
                        <p className="text-blue-100 text-xs">Available Balance</p>
                    </div>
                    <CreditCard className="text-blue-300" size={32} />
                </div>
                <div className="mt-8 pt-6 border-t border-blue-500/30 flex gap-8">
                    <div>
                        <p className="text-blue-200 text-xs font-bold uppercase">Spent YTD</p>
                        <p className="font-bold text-lg">$850.00</p>
                    </div>
                    <div>
                        <p className="text-blue-200 text-xs font-bold uppercase">Projected</p>
                        <p className="font-bold text-lg">$3,200.00</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ShoppingBag className="text-indigo-600" size={20} /> Eligible Expenses</h3>
                    <div className="bg-indigo-50 p-4 rounded-2xl mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-indigo-900">Recently Purchased</span>
                            <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">Verified</span>
                        </div>
                        <p className="text-sm text-slate-600">Contact Lenses, Sunscreen (SPF 30+), First Aid Kit</p>
                    </div>
                    <button className="w-full text-indigo-600 font-bold text-sm border border-indigo-200 rounded-xl py-2 hover:bg-indigo-50 transition-colors">Browse FSA Store</button>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Receipt className="text-indigo-600" size={20} /> Claims & Receipts</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">$</div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Pharmacy Rx</p>
                                    <p className="text-xs text-slate-400">Oct 24</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-800">-$45.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">$</div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Dr. Visit Co-pay</p>
                                    <p className="text-xs text-slate-400">Oct 12</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-800">-$25.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
