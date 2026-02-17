import React, { useState } from 'react';
import { Watch, Smartphone, Link as LinkIcon, Check, RefreshCw } from 'lucide-react';

export const SmartDevices: React.FC = () => {
    const [devices, setDevices] = useState([
        { id: 1, name: 'Apple Watch Series 8', type: 'Wearable', status: 'Connected', lastSync: '10 min ago', battery: '85%' },
        { id: 2, name: 'Fitbit Charge 5', type: 'Wearable', status: 'Disconnected', lastSync: '2 days ago', battery: '--' },
    ]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Watch className="text-indigo-600" /> Connected Devices</h2>

                <div className="space-y-4">
                    {devices.map(device => (
                        <div key={device.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${device.status === 'Connected' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                                    {device.type === 'Wearable' ? <Watch size={24} /> : <Smartphone size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{device.name}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        {device.status === 'Connected' ? <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> : <span className="w-2 h-2 bg-slate-400 rounded-full inline-block"></span>}
                                        {device.status} • Sync: {device.lastSync}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {device.status === 'Connected' && <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200">🔋 {device.battery}</span>}
                                <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-6 border-2 border-dashed border-slate-200 text-slate-500 py-4 rounded-xl font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    <LinkIcon size={20} /> Connect New Device
                </button>
            </div>
        </div>
    );
};
