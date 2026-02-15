import React from 'react';
import { User, Plus, Edit2, Shield } from 'lucide-react';
import { FamilyMember } from '../types';

const FAMILY: FamilyMember[] = [
    { id: 'f1', name: 'Leo Jenkins', relation: 'Son', age: 8, avatar: 'https://picsum.photos/seed/leo/200', accessLevel: 'full' },
    { id: 'f2', name: 'Mia Jenkins', relation: 'Daughter', age: 5, avatar: 'https://picsum.photos/seed/mia/200', accessLevel: 'full' },
    { id: 'f3', name: 'Mark Jenkins', relation: 'Husband', age: 38, avatar: 'https://picsum.photos/seed/mark/200', accessLevel: 'read-only' },
];

export const FamilyPage: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Family Health</h1>
        <button className="bg-arya-600 text-white p-2 rounded-xl shadow-md hover:bg-arya-700"><Plus size={20} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAMILY.map(member => (
              <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                  <img src={member.avatar} className="w-16 h-16 rounded-full border-2 border-slate-100 object-cover" />
                  <div className="flex-grow">
                      <h3 className="font-bold text-slate-800 text-lg">{member.name}</h3>
                      <p className="text-sm text-slate-500">{member.relation} • {member.age} yrs</p>
                      <div className="flex items-center gap-1 mt-1">
                          <Shield size={12} className="text-slate-400" />
                          <span className="text-xs text-slate-400 font-medium capitalize">{member.accessLevel} Access</span>
                      </div>
                  </div>
                  <button className="text-slate-400 hover:text-arya-600"><Edit2 size={18} /></button>
              </div>
          ))}
      </div>
    </div>
  );
};
