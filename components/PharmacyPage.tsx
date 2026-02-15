import React, { useState } from 'react';
import { Pill, Truck, Clock, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { Medication } from '../types';

interface PharmacyPageProps {
  medications: Medication[];
}

export const PharmacyPage: React.FC<PharmacyPageProps> = ({ medications }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Pharmacy & Meds</h1>
           <p className="text-slate-500 text-sm">Manage prescriptions and track deliveries.</p>
        </div>
        <button className="bg-arya-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-arya-700">Request Refill</button>
      </div>

      {/* Delivery Tracker */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="flex items-center gap-3 mb-4">
             <div className="bg-green-100 p-2 rounded-full text-green-600"><Truck size={20} /></div>
             <h3 className="font-bold text-slate-800">Order #RX-9921 Delivery</h3>
         </div>
         <div className="relative pt-6 pb-2">
             <div className="h-2 bg-slate-100 rounded-full mb-4">
                 <div className="h-full bg-green-500 rounded-full w-3/4 relative">
                     <div className="absolute right-0 -top-1 w-4 h-4 bg-white border-4 border-green-500 rounded-full shadow-sm"></div>
                 </div>
             </div>
             <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                 <span className="text-green-600">Processing</span>
                 <span className="text-green-600">Shipped</span>
                 <span className="text-green-600">Out for Delivery</span>
                 <span>Delivered</span>
             </div>
         </div>
         <p className="text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
             Your package containing <strong>Lipitor (20mg)</strong> is arriving today by 6:00 PM.
         </p>
      </div>

      {/* Meds List */}
      <div className="grid md:grid-cols-2 gap-4">
          {medications.map(med => (
              <div key={med.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                          <Pill size={24} />
                      </div>
                      <div>
                          <h4 className="font-bold text-slate-800 text-lg">{med.name}</h4>
                          <p className="text-sm text-slate-500 font-medium">{med.dosage} • {med.frequency}</p>
                          <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{med.refillsRemaining} Refills Left</span>
                              {med.refillsRemaining < 1 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-bold flex items-center gap-1"><AlertCircle size={10} /> Renew</span>}
                          </div>
                      </div>
                  </div>
                  <div className="text-right">
                       <span className="block text-xs text-slate-400 font-bold uppercase mb-1">Status</span>
                       <span className="text-green-600 font-bold text-sm flex items-center justify-end gap-1"><CheckCircle size={14}/> Active</span>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
