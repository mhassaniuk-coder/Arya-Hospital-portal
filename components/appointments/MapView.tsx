import React from 'react';
import { MapPin, Video, Home, Navigation, Clock } from 'lucide-react';
import { Appointment } from '../../types';

interface MapViewProps {
    appointments: Appointment[];
}

export const MapView: React.FC<MapViewProps> = ({ appointments }) => {
    const inPersonAppts = appointments.filter(a => a.status === 'upcoming' && a.visitType !== 'video');

    const locations = [
        { name: 'Building A, Room 302', lat: 40, left: '30%', top: '35%' },
        { name: 'Central Diagnostic Wing', lat: 40, left: '60%', top: '50%' },
        { name: 'Home Visit', lat: 40, left: '75%', top: '25%' },
        { name: 'Radiology Center', lat: 40, left: '45%', top: '65%' },
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Navigation size={18} className="text-arya-600" /> Appointment Locations</h3>
                <span className="text-xs bg-arya-50 text-arya-700 px-2 py-1 rounded-full font-bold">{inPersonAppts.length} upcoming visits</span>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-[300px] bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 overflow-hidden">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`h-${i}`} className="absolute w-full border-b border-slate-400" style={{ top: `${(i + 1) * 12.5}%` }} />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`v-${i}`} className="absolute h-full border-r border-slate-400" style={{ left: `${(i + 1) * 12.5}%` }} />
                    ))}
                </div>

                {/* Roads */}
                <div className="absolute top-0 bottom-0 left-[50%] w-[3px] bg-slate-200/60" />
                <div className="absolute left-0 right-0 top-[45%] h-[3px] bg-slate-200/60" />

                {/* Location pins */}
                {inPersonAppts.slice(0, 4).map((appt, i) => {
                    const loc = locations[i % locations.length];
                    return (
                        <div
                            key={appt.id}
                            className="absolute group z-10 cursor-pointer"
                            style={{ left: loc.left, top: loc.top, transform: 'translate(-50%, -100%)' }}
                        >
                            {/* Pin */}
                            <div className="relative">
                                <div className="w-8 h-8 bg-arya-600 rounded-full flex items-center justify-center shadow-lg shadow-arya-200 border-2 border-white group-hover:scale-125 transition-transform">
                                    {appt.visitType === 'home-visit' ? <Home size={14} className="text-white" /> : <MapPin size={14} className="text-white" />}
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-arya-600" />
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <p className="font-bold text-slate-800 text-xs">{appt.doctorName}</p>
                                <p className="text-[10px] text-slate-500">{appt.location}</p>
                                <div className="flex items-center gap-1 text-[10px] text-arya-600 mt-1">
                                    <Clock size={10} /> {appt.time}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Location List */}
            <div className="p-3 space-y-2">
                {inPersonAppts.slice(0, 4).map(appt => (
                    <div key={appt.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-arya-100 rounded-lg flex items-center justify-center text-arya-600">
                            {appt.visitType === 'home-visit' ? <Home size={14} /> : <MapPin size={14} />}
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm font-semibold text-slate-700">{appt.doctorName}</p>
                            <p className="text-[10px] text-slate-400">{appt.location}</p>
                        </div>
                        <span className="text-xs text-arya-600 font-bold">{appt.time}</span>
                    </div>
                ))}
                {inPersonAppts.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-4">No in-person appointments to show</p>
                )}
            </div>
        </div>
    );
};
