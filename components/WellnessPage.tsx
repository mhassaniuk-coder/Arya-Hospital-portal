import React, { useState } from 'react';
import { Activity, Flame, Moon, Footprints, Utensils, Droplet, Plus } from 'lucide-react';

export const WellnessPage: React.FC = () => {
  const [waterIntake, setWaterIntake] = useState(4);

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-slate-800">Wellness Center</h1>

      {/* Activity Rings */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10">
              <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                      <circle cx="64" cy="64" r="56" stroke="#ef4444" strokeWidth="8" fill="transparent" strokeDasharray="351" strokeDashoffset="100" strokeLinecap="round" />
                      <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                      <circle cx="64" cy="64" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset="50" strokeLinecap="round" />
                  </svg>
                  <Activity className="absolute text-white" size={24} />
              </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold"><Flame size={16}/> 450 / 600 Kcal</div>
                  <div className="flex items-center gap-2 text-green-400 font-bold"><Footprints size={16}/> 6,240 Steps</div>
                  <div className="flex items-center gap-2 text-blue-400 font-bold"><Moon size={16}/> 7h 20m Sleep</div>
              </div>
          </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          {/* Meal Plan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Utensils size={20} className="text-orange-500"/> Today's Meal Plan (AI)</h3>
              <div className="space-y-4">
                  <div className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden"><img src="https://picsum.photos/seed/food1/100" className="w-full h-full object-cover"/></div>
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Breakfast</p>
                          <p className="font-bold text-slate-800">Oatmeal & Berries</p>
                          <p className="text-xs text-slate-500">350 Kcal • High Fiber</p>
                      </div>
                  </div>
                   <div className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden"><img src="https://picsum.photos/seed/food2/100" className="w-full h-full object-cover"/></div>
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Lunch</p>
                          <p className="font-bold text-slate-800">Grilled Chicken Salad</p>
                          <p className="text-xs text-slate-500">450 Kcal • High Protein</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Hydration */}
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Droplet size={20}/> Hydration Tracker</h3>
              <div className="text-4xl font-bold text-blue-600 my-4">{waterIntake} <span className="text-lg text-blue-400">/ 8 cups</span></div>
              <div className="flex gap-2">
                  <button onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))} className="w-10 h-10 rounded-full bg-white text-blue-500 font-bold shadow-sm">-</button>
                  <button onClick={() => setWaterIntake(waterIntake + 1)} className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold shadow-sm">+</button>
              </div>
          </div>
      </div>
    </div>
  );
};
