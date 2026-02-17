import React from 'react';
import { BarChart3, Calendar, XCircle, Clock, Stethoscope, TrendingUp } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentStatsProps {
    appointments: Appointment[];
}

export const AppointmentStats: React.FC<AppointmentStatsProps> = ({ appointments }) => {
    const upcoming = appointments.filter(a => a.status === 'upcoming').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const total = appointments.length;
    const cancelRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

    const videoVisits = appointments.filter(a => a.visitType === 'video').length;
    const inPerson = appointments.filter(a => a.visitType === 'in-person').length;

    // Most visited specialty
    const specMap: Record<string, number> = {};
    appointments.forEach(a => { specMap[a.specialty] = (specMap[a.specialty] || 0) + 1; });
    const topSpecialty = Object.entries(specMap).sort((a, b) => b[1] - a[1])[0];

    const stats = [
        { label: 'Upcoming', value: upcoming, icon: Calendar, color: 'text-arya-600', bg: 'bg-arya-50', border: 'border-arya-100' },
        { label: 'Completed', value: completed, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
        { label: 'Cancel Rate', value: `${cancelRate}%`, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
        { label: 'Video Visits', value: videoVisits, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'In-Person', value: inPerson, icon: Stethoscope, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { label: 'Top Specialty', value: topSpecialty ? topSpecialty[0].split(' ')[0] : '—', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-fade-in">
            {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
                <div key={label} className={`${bg} p-4 rounded-2xl border ${border} text-center`}>
                    <Icon size={20} className={`${color} mx-auto mb-2`} />
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
                </div>
            ))}
        </div>
    );
};
