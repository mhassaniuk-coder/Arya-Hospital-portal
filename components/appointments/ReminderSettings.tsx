import React, { useState } from 'react';
import { X, Bell, Mail, MessageSquare, Smartphone, CheckCircle } from 'lucide-react';
import { Appointment } from '../../types';

interface ReminderSettingsProps {
    appointment: Appointment;
    onClose: () => void;
}

export const ReminderSettings: React.FC<ReminderSettingsProps> = ({ appointment, onClose }) => {
    const [settings, setSettings] = useState({
        email: true,
        sms: true,
        push: true,
        timing1Day: true,
        timing1Hour: true,
        timing30Min: false,
        timing15Min: false,
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => onClose(), 1500);
    };

    const Toggle = ({ checked, onChange, label, icon: Icon }: { checked: boolean; onChange: () => void; label: string; icon: any }) => (
        <button
            onClick={onChange}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all w-full text-left ${checked ? 'border-arya-300 bg-arya-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
        >
            <div className={`w-10 h-6 rounded-full flex items-center transition-colors ${checked ? 'bg-arya-600 justify-end' : 'bg-slate-200 justify-start'}`}>
                <div className="w-5 h-5 bg-white rounded-full shadow mx-0.5" />
            </div>
            <Icon size={16} className={checked ? 'text-arya-600' : 'text-slate-400'} />
            <span className={`text-sm font-medium ${checked ? 'text-arya-700' : 'text-slate-500'}`}>{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Bell size={20} className="text-arya-600" /> Reminder Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-5">
                    {saved ? (
                        <div className="text-center py-8 animate-fade-in">
                            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                            <p className="font-bold text-slate-800">Reminders Updated!</p>
                            <p className="text-sm text-slate-500">You'll be notified as configured.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-arya-50 p-3 rounded-2xl border border-arya-100 text-center text-sm">
                                <p className="font-bold text-arya-700">{appointment.doctorName}</p>
                                <p className="text-arya-600 text-xs">{appointment.time} • {new Date(appointment.date).toLocaleDateString()}</p>
                            </div>

                            {/* Channels */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Notification Channels</p>
                                <div className="space-y-2">
                                    <Toggle checked={settings.email} onChange={() => setSettings(p => ({ ...p, email: !p.email }))} label="Email" icon={Mail} />
                                    <Toggle checked={settings.sms} onChange={() => setSettings(p => ({ ...p, sms: !p.sms }))} label="SMS" icon={Smartphone} />
                                    <Toggle checked={settings.push} onChange={() => setSettings(p => ({ ...p, push: !p.push }))} label="Push Notification" icon={MessageSquare} />
                                </div>
                            </div>

                            {/* Timing */}
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">When to Remind</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { key: 'timing1Day', label: '1 day before' },
                                        { key: 'timing1Hour', label: '1 hour before' },
                                        { key: 'timing30Min', label: '30 min before' },
                                        { key: 'timing15Min', label: '15 min before' },
                                    ].map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => setSettings(p => ({ ...p, [key]: !(p as any)[key] }))}
                                            className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${(settings as any)[key] ? 'border-arya-300 bg-arya-50 text-arya-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleSave} className="w-full py-3 bg-arya-600 text-white rounded-xl font-bold hover:bg-arya-700 transition-colors">
                                Save Preferences
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
