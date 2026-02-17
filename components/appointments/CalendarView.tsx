import React from 'react';
import { Calendar, Clock, Video, MapPin, Home } from 'lucide-react';
import { Appointment } from '../../types';

interface CalendarViewProps {
    appointments: Appointment[];
    onSelectAppointment?: (appointment: Appointment) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ appointments, onSelectAppointment }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    const getApptsForDay = (day: number): Appointment[] => {
        return appointments.filter(a => {
            const d = new Date(a.date);
            return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    };

    const getTypeBadge = (type?: string) => {
        if (type === 'video') return <Video size={10} className="text-blue-500" />;
        if (type === 'home-visit') return <Home size={10} className="text-purple-500" />;
        return <MapPin size={10} className="text-green-500" />;
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-arya-600 to-indigo-600 p-4 text-white flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><Calendar size={20} /> {monthName}</h3>
                <p className="text-sm text-white/70">{appointments.filter(a => a.status === 'upcoming').length} upcoming</p>
            </div>

            <div className="p-3">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">{d}</div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                        if (day === null) return <div key={i} />;
                        const dayAppts = getApptsForDay(day);
                        const isToday = day === today.getDate();

                        return (
                            <div
                                key={i}
                                className={`min-h-[60px] md:min-h-[80px] p-1 rounded-xl border transition-all ${isToday ? 'border-arya-300 bg-arya-50' : 'border-transparent hover:bg-slate-50'
                                    } ${dayAppts.length > 0 ? 'cursor-pointer' : ''}`}
                                onClick={() => dayAppts.length > 0 && onSelectAppointment?.(dayAppts[0])}
                            >
                                <span className={`text-xs font-semibold block text-center mb-0.5 ${isToday ? 'bg-arya-600 text-white w-5 h-5 rounded-full flex items-center justify-center mx-auto' : 'text-slate-600'
                                    }`}>
                                    {day}
                                </span>
                                <div className="space-y-0.5">
                                    {dayAppts.slice(0, 2).map(a => (
                                        <div
                                            key={a.id}
                                            className={`text-[9px] p-1 rounded-md truncate flex items-center gap-0.5 ${a.status === 'upcoming' ? 'bg-arya-100 text-arya-700' :
                                                    a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                }`}
                                        >
                                            {getTypeBadge(a.visitType)}
                                            <span className="truncate">{a.doctorName.split(' ').pop()}</span>
                                        </div>
                                    ))}
                                    {dayAppts.length > 2 && (
                                        <span className="text-[9px] text-slate-400 block text-center">+{dayAppts.length - 2}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
