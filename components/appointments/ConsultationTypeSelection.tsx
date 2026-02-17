import React from 'react';
import { Video, Building2, MapPin, Wifi } from 'lucide-react';

interface ConsultationTypeSelectionProps {
    onSelectType: (type: 'video' | 'in-person') => void;
    onBack: () => void;
}

export const ConsultationTypeSelection: React.FC<ConsultationTypeSelectionProps> = ({ onSelectType, onBack }) => {
    return (
        <div className="p-6 md:p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">How would you like to see the doctor?</h2>
                <p className="text-slate-500">Choose your preferred consultation method</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Online / Video */}
                <button
                    onClick={() => onSelectType('video')}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:shadow-xl transition-all duration-300 text-center space-y-4"
                >
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Wifi size={12} /> Available Now
                    </div>
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <Video size={40} className="text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700">Online Consultation</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Connect with a doctor via secure video call from the comfort of your home.</p>
                    </div>
                    <ul className="text-sm text-slate-500 space-y-2 text-left bg-slate-50 p-4 rounded-xl w-full">
                        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> No travel time</li>
                        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Digital prescription</li>
                        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Secure & Private</li>
                    </ul>
                </button>

                {/* In-Person / Clinic */}
                <button
                    onClick={() => onSelectType('in-person')}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xl transition-all duration-300 text-center space-y-4"
                >
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                        <Building2 size={40} className="text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700">Clinic Visit</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Meet your doctor in person at Arya Hospital for a physical examination.</p>
                    </div>
                    <ul className="text-sm text-slate-500 space-y-2 text-left bg-slate-50 p-4 rounded-xl w-full">
                        <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Physical check-up</li>
                        <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Lab tests on-site</li>
                        <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Face-to-face care</li>
                    </ul>
                </button>
            </div>
        </div>
    );
};
