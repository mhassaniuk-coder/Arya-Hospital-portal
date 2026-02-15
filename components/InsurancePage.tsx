import React, { useState } from 'react';
import { CreditCard, FileText, CheckCircle, Clock, AlertTriangle, Copy } from 'lucide-react';
import { InsuranceClaim } from '../types';

const CLAIMS: InsuranceClaim[] = [
    { id: 'CLM-001', date: '2023-10-15', provider: 'City Hospital', service: 'General Checkup', amount: 150.00, status: 'approved' },
    { id: 'CLM-002', date: '2023-09-20', provider: 'Dr. Emily Chen', service: 'Cardiology Consult', amount: 200.00, status: 'pending' },
];

export const InsurancePage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-slate-800">Insurance Wallet</h1>

      {/* Flip Card */}
      <div className="w-full max-w-md mx-auto h-56 perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front */}
              <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl shadow-xl p-6 text-white backface-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                      <div className="font-bold text-xl tracking-wider">BlueCross</div>
                      <CreditCard size={24} className="opacity-80" />
                  </div>
                  <div>
                      <p className="text-xs text-blue-200 uppercase mb-1">Member Name</p>
                      <p className="font-bold text-lg tracking-wide">SARAH JENKINS</p>
                  </div>
                  <div className="flex justify-between items-end">
                      <div>
                          <p className="text-xs text-blue-200 uppercase">Member ID</p>
                          <p className="font-mono font-bold tracking-widest">XZY-992-881</p>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-blue-200 uppercase">Group</p>
                          <p className="font-mono font-bold">99210</p>
                      </div>
                  </div>
              </div>

              {/* Back */}
              <div className="absolute w-full h-full bg-slate-800 rounded-2xl shadow-xl p-6 text-white backface-hidden rotate-y-180 flex flex-col justify-between">
                  <div>
                      <p className="text-xs text-slate-400 uppercase font-bold mb-2">Provider Support</p>
                      <p className="font-bold">1-800-555-0199</p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex justify-between border-b border-slate-700 pb-1"><span>Co-Pay (Office)</span> <span className="text-white font-bold">$25</span></div>
                      <div className="flex justify-between border-b border-slate-700 pb-1"><span>Co-Pay (Specialist)</span> <span className="text-white font-bold">$40</span></div>
                      <div className="flex justify-between"><span>Deductible</span> <span className="text-white font-bold">$1,500</span></div>
                  </div>
              </div>
          </div>
      </div>
      <p className="text-center text-xs text-slate-400 mt-2">Tap card to view details</p>

      {/* Claims */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-6">
          <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">Recent Claims</div>
          {CLAIMS.map(claim => (
              <div key={claim.id} className="p-4 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div>
                      <p className="font-bold text-slate-800">{claim.provider}</p>
                      <p className="text-xs text-slate-500">{claim.service} • {claim.date}</p>
                  </div>
                  <div className="text-right">
                      <p className="font-bold text-slate-800">${claim.amount}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>{claim.status}</span>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
