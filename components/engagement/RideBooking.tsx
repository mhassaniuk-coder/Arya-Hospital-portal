import React, { useState } from 'react';
import { Car, MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';

export const RideBooking: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10">
                    <Car size={160} />
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Car className="text-indigo-600" /> Request Transport</h2>

                <div className="grid gap-4 max-w-md relative z-10">
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-200">
                        <MapPin className="text-slate-400 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Pickup</p>
                            <p className="font-bold text-slate-800">Home (123 Maple St)</p>
                        </div>
                    </div>
                    <div className="flex justify-center -my-2 z-20">
                        <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                            <ArrowRight className="text-slate-400 rotate-90" size={16} />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-200">
                        <MapPin className="text-indigo-600 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Dropoff</p>
                            <p className="font-bold text-slate-800">Arya Hospital - Main Entrance</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <button className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">Book Now</button>
                        <button className="bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Schedule Later</button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Upcoming Rides</h3>
                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-indigo-50/50">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 font-bold">
                        24
                        <span className="text-[10px] ml-0.5">OCT</span>
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Cardiology Appointment</p>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            <Clock size={14} /> Pickup at 09:15 AM
                        </p>
                    </div>
                    <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">Confirmed</span>
                </div>
            </div>
        </div>
    );
};
