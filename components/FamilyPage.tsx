import React, { useState } from 'react';
import { User, Plus, Edit2, Shield, Trash2, X, Save, Check } from 'lucide-react';
import { FamilyMember } from '../types';

interface FamilyPageProps {
  familyMembers?: FamilyMember[];
  onAddMember?: (member: FamilyMember) => void;
  onUpdateMember?: (id: string, member: Partial<FamilyMember>) => void;
  onDeleteMember?: (id: string) => void;
}

export const FamilyPage: React.FC<FamilyPageProps> = ({
  familyMembers = [],
  onAddMember,
  onUpdateMember,
  onDeleteMember
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: '', relation: '', age: 0, accessLevel: 'read-only'
  });

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relation) return;

    const member: FamilyMember = {
      id: `f${Date.now()}`,
      name: newMember.name,
      relation: newMember.relation,
      age: newMember.age || 0,
      avatar: `https://picsum.photos/seed/${newMember.name}/200`,
      accessLevel: newMember.accessLevel as 'full' | 'read-only' || 'read-only'
    };

    if (onAddMember) onAddMember(member);
    setShowAddModal(false);
    setNewMember({ name: '', relation: '', age: 0, accessLevel: 'read-only' });
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to remove this family member?')) {
      if (onDeleteMember) onDeleteMember(id);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Family Health</h1>
          <p className="text-slate-500 text-sm">Manage profiles for your family members.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-arya-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:bg-arya-700 flex items-center gap-2 font-semibold transition-all"
        >
          <Plus size={20} /> <span className="hidden md:inline">Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map(member => (
          <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="flex items-center gap-4">
              <img src={member.avatar} className="w-16 h-16 rounded-full border-2 border-slate-100 object-cover" />
              <div className="flex-grow">
                <h3 className="font-bold text-slate-800 text-lg">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.relation} • {member.age} yrs</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield size={12} className={member.accessLevel === 'full' ? "text-green-500" : "text-slate-400"} />
                  <span className={`text-xs font-medium capitalize ${member.accessLevel === 'full' ? "text-green-600" : "text-slate-400"}`}>
                    {member.accessLevel} Access
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm">
              <button className="text-slate-400 hover:text-arya-600 p-1 rounded-full hover:bg-arya-50 transition-colors"><Edit2 size={16} /></button>
              <button onClick={() => handleDeleteMember(member.id)} className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-slate-400 hover:text-arya-600 hover:border-arya-300 hover:bg-arya-50 transition-all min-h-[140px]"
        >
          <div className="bg-slate-50 p-3 rounded-full mb-2 group-hover:bg-white"><Plus size={24} /></div>
          <span className="font-semibold text-sm">Add New Member</span>
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add Family Member</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Relation</label>
                  <select
                    value={newMember.relation}
                    onChange={e => setNewMember({ ...newMember, relation: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={newMember.age || ''}
                    onChange={e => setNewMember({ ...newMember, age: parseInt(e.target.value) })}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none"
                    placeholder="Age"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Access Level</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewMember({ ...newMember, accessLevel: 'read-only' })}
                    className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${newMember.accessLevel === 'read-only' ? 'bg-slate-100 border-slate-300 text-slate-800 ring-1 ring-slate-300' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                  >
                    Read Only
                  </button>
                  <button
                    onClick={() => setNewMember({ ...newMember, accessLevel: 'full' })}
                    className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 ${newMember.accessLevel === 'full' ? 'bg-green-50 border-green-200 text-green-700 ring-1 ring-green-200' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                  >
                    Full Access
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 ml-1">
                  {newMember.accessLevel === 'full' ? 'Can view records and book appointments.' : 'Can only be managed by you.'}
                </p>
              </div>

              <button
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.relation}
                className="w-full mt-4 bg-arya-600 text-white py-3.5 rounded-xl font-bold hover:bg-arya-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
