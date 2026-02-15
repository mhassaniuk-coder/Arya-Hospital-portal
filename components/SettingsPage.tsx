import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  LogOut, 
  ChevronRight, 
  Smartphone, 
  Mail,
  Lock,
  Eye,
  Camera
} from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsPageProps {
  user: UserType;
  onSignOut: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onSignOut }) => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-arya-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${checked ? 'left-7' : 'left-1'}`}></div>
    </button>
  );

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block">
              <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-md mx-auto" />
              <button className="absolute bottom-0 right-0 bg-arya-600 text-white p-2 rounded-full border-2 border-white shadow-sm hover:bg-arya-700 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-4">{user.name}</h2>
            <p className="text-slate-500 text-sm font-mono bg-slate-50 inline-block px-3 py-1 rounded-full mt-2 border border-slate-100">{user.mrn}</p>
            <div className="mt-6 flex justify-center gap-2">
               <span className={`px-3 py-1 rounded-lg text-xs font-bold ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                 {user.isVerified ? 'Verified Account' : 'Unverified'}
               </span>
            </div>
          </div>

          <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
             <button onClick={onSignOut} className="w-full flex items-center justify-between p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-colors group">
                <div className="flex items-center gap-3">
                   <div className="bg-red-100 p-2 rounded-xl group-hover:bg-red-200 transition-colors"><LogOut size={20} /></div>
                   <span className="font-bold">Sign Out</span>
                </div>
                <ChevronRight size={18} className="opacity-50" />
             </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Account */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-arya-600" /> Account Details
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                  <input type="text" value={user.name} disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email</label>
                  <input type="text" value="sarah.jenkins@example.com" disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600" />
                </div>
              </div>
              <button className="text-arya-600 text-sm font-bold hover:underline">Request Information Change</button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-arya-600" /> Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Mail size={18}/></div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">Email Notifications</p>
                    <p className="text-xs text-slate-400">Receive summaries and bills</p>
                  </div>
                </div>
                <Toggle checked={emailNotif} onChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Smartphone size={18}/></div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">Push Notifications</p>
                    <p className="text-xs text-slate-400">Appointment reminders & alerts</p>
                  </div>
                </div>
                <Toggle checked={pushNotif} onChange={setPushNotif} />
              </div>
            </div>
          </div>

          {/* Security & Appearance */}
          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-arya-600" /> Security
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Two-Factor Auth</span>
                      <Toggle checked={twoFactor} onChange={setTwoFactor} />
                   </div>
                   <button className="flex items-center gap-2 text-sm text-arya-600 font-bold hover:underline">
                      <Lock size={14} /> Change Password
                   </button>
                </div>
             </div>

             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-arya-600" /> Appearance
                </h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium flex items-center gap-2"><Moon size={14}/> Dark Mode</span>
                      <Toggle checked={darkMode} onChange={setDarkMode} />
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium flex items-center gap-2"><Globe size={14}/> Language</span>
                      <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-1 px-2 outline-none">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
