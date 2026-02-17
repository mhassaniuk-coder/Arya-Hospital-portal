import React from 'react';
import { MapPin, Clock, Star, Navigation, Phone, Calendar } from 'lucide-react';

export const UrgentCareFinder: React.FC = () => {
    const centers = [
        { id: 1, name: "Arya City Clinic", distance: "0.8 mi", waitTime: 12, rating: 4.8, address: "123 Main St", status: "Open" },
        { id: 2, name: "Westside Urgent Care", distance: "2.4 mi", waitTime: 45, rating: 4.2, address: "450 West Ave", status: "Open" },
        { id: 3, name: "Family Health Center", distance: "5.1 mi", waitTime: 5, rating: 4.5, address: "880 North Blvd", status: "Closing Soon" },
        { id: 4, name: "Pediatric Night Clinic", distance: "1.2 mi", waitTime: 25, rating: 4.9, address: "900 Kids Way", status: "Open" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Nearby Urgent Care</h2>
                    <p className="text-slate-500 text-sm">Real-time wait times and availability.</p>
                </div>
                <button className="text-indigo-600 font-bold text-sm hover:underline">View Map</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {centers.map(center => (
                    <div key={center.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{center.name}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <MapPin size={12} /> {center.address} ({center.distance})
                                </p>
                            </div>
                            <div className={`px-2 py-1 rounded-lg text-xs font-bold ${center.waitTime < 15 ? 'bg-green-100 text-green-700' :
                                    center.waitTime < 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {center.waitTime} min wait
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                            <div className="flex items-center gap-1">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold">{center.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${center.status === 'Open' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                <span>{center.status}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                <Navigation size={14} /> Directions
                            </button>
                            <button className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                                <Calendar size={14} /> Book Slot
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
