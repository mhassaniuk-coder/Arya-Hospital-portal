import React, { useState } from 'react';
import { Activity, AlertTriangle, ArrowRight } from 'lucide-react';

export const SymptomChecker: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const parts = [
      { id: 'head', label: 'Head & Neck', cx: 100, cy: 30, r: 25 },
      { id: 'chest', label: 'Chest', cx: 100, cy: 90, r: 30 },
      { id: 'stomach', label: 'Abdomen', cx: 100, cy: 150, r: 30 },
      { id: 'arms', label: 'Arms', cx: 40, cy: 110, r: 20 },
      { id: 'legs', label: 'Legs', cx: 100, cy: 230, r: 30 },
  ];

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-slate-800 w-full text-left">Symptom Checker</h1>
      <p className="text-slate-500 text-sm w-full text-left -mt-4">Tap on the body area where you feel discomfort.</p>

      <div className="relative w-64 h-80 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center shadow-inner mt-4">
          <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl">
              {/* Simplified Human Figure */}
              <path d="M100,60 L100,180 M60,90 L140,90 M70,180 L70,280 M130,180 L130,280" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
              
              {parts.map(part => (
                  <g key={part.id} onClick={() => setSelectedPart(part.id)} className="cursor-pointer hover:opacity-80 transition-opacity">
                       <circle 
                          cx={part.cx} cy={part.cy} r={part.r} 
                          fill={selectedPart === part.id ? '#ef4444' : '#3b82f6'} 
                          className="transition-colors duration-300 opacity-50"
                       />
                       <text x={part.cx} y={part.cy} textAnchor="middle" dy="5" fontSize="10" fill="white" fontWeight="bold">
                           {selectedPart === part.id ? '!' : ''}
                       </text>
                  </g>
              ))}
          </svg>
      </div>

      {selectedPart && (
          <div className="w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-xl animate-fade-in mt-4">
              <h3 className="font-bold text-slate-800 text-lg capitalize mb-2">{parts.find(p => p.id === selectedPart)?.label} Issue</h3>
              <p className="text-slate-500 text-sm mb-4">Common symptoms in this area include headaches, dizziness, or neck pain.</p>
              <button className="w-full bg-arya-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-arya-700">
                  Run AI Triage <ArrowRight size={18} />
              </button>
          </div>
      )}
    </div>
  );
};
