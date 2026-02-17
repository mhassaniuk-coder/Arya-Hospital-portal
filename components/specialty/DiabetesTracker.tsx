import React, { useState } from 'react';
import { Activity, Droplet, Clock, AlertTriangle, Plus } from 'lucide-react';

export const DiabetesTracker: React.FC = () => {
    const [glucose, setGlucose] = useState<number>(0);
    const [logs, setLogs] = useState([
        { id: 1, value: 98, time: '08:00 AM', status: 'Normal', type: 'Before Breakfast' },
        { id: 2, value: 145, time: '10:30 AM', status: 'High', type: 'After Breakfast' },
        { id: 3, value: 102, time: '01:00 PM', status: 'Normal', type: 'Before Lunch' },
    ]);

    const addLog = () => {
        if (glucose <= 0) return;
        const status = glucose < 70 ? 'Low' : glucose > 140 ? 'High' : 'Normal';
        setLogs([{ id: Date.now(), value: glucose, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status, type: 'Manual Log' }, ...logs]);
        setGlucose(0);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-3xl text-white shadow-xl">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Droplet /> Glucose Monitor</h2>
                <div className="flex gap-4 items-end">
                    <div className="flex-grow">
                        <label className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2 block">Current Reading (mg/dL)</label>
                        <input
                            type="number"
                            value={glucose || ''}
                            onChange={e => setGlucose(parseInt(e.target.value) || 0)}
                            placeholder="---"
                            className="w-full bg-white/20 border border-white/30 rounded-2xl py-3 px-4 text-3xl font-bold text-white placeholder:text-white/40 focus:outline-none focus:bg-white/30 transition-all font-mono"
                        />
                    </div>
                    <button
                        onClick={addLog}
                        disabled={!glucose}
                        className="bg-white text-emerald-600 px-6 py-4 rounded-2xl font-bold hover:bg-emerald-50 disabled:opacity-50 transition-colors shadow-lg"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Recent Readings</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase">Today</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {logs.map(log => (
                        <div key={log.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${log.status === 'Normal' ? 'bg-emerald-100 text-emerald-600' :
                                        log.status === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {log.value}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{log.type}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10} /> {log.time}</p>
                                </div>
                            </div>
                            <div className={`text-xs font-bold px-3 py-1 rounded-full ${log.status === 'Normal' ? 'bg-emerald-50 text-emerald-600' :
                                    log.status === 'High' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {log.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {logs.some(l => l.status !== 'Normal') && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 shrink-0" />
                    <div>
                        <p className="font-bold text-amber-800 text-sm">Abnormal Readings Detected</p>
                        <p className="text-amber-700 text-xs mt-1">Your glucose levels have fluctuated today. Please stick to your meal plan and stay hydrated.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
