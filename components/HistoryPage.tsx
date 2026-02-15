import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  FileText, 
  Pill, 
  Activity, 
  Filter, 
  Download, 
  ChevronRight, 
  Search, 
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Microscope,
  BriefcaseMedical
} from 'lucide-react';
import { Appointment, LabResult, Medication } from '../types';

interface HistoryPageProps {
  appointments: Appointment[];
  labResults: LabResult[];
  medications: Medication[];
}

type EventType = 'appointment' | 'lab' | 'medication' | 'all';

interface TimelineEvent {
  id: string;
  type: 'appointment' | 'lab' | 'medication';
  date: Date;
  title: string;
  subtitle: string;
  status?: string;
  details?: string;
  icon: any;
  color: string;
  bgColor: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ appointments, labResults, medications }) => {
  const [filterType, setFilterType] = useState<EventType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Unified Data Processing
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Process Appointments
    appointments.forEach(app => {
      // Only include past appointments or upcoming ones in a specific way? 
      // Usually history is past, but a timeline might show upcoming too. 
      // Let's include all but style them differently based on status.
      events.push({
        id: `appt-${app.id}`,
        type: 'appointment',
        date: new Date(app.date),
        title: app.doctorName,
        subtitle: app.specialty,
        status: app.status,
        details: app.aiSummary || app.symptoms || 'Routine Visit',
        icon: Stethoscope,
        color: 'text-arya-600',
        bgColor: 'bg-arya-100'
      });
    });

    // Process Labs
    labResults.forEach(lab => {
      events.push({
        id: `lab-${lab.id}`,
        type: 'lab',
        date: new Date(lab.date),
        title: lab.testName,
        subtitle: 'Lab Result',
        status: lab.status,
        details: `Value: ${lab.value} ${lab.unit}`,
        icon: Microscope,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100'
      });
    });

    // Process Medications (Mocking dates since type doesn't strictly enforce it yet)
    medications.forEach((med, index) => {
        // Mocking a past date for prescriptions based on index for demo purposes
        const mockDate = new Date();
        mockDate.setDate(mockDate.getDate() - (index * 15 + 5)); 
        
        events.push({
            id: `med-${med.id}`,
            type: 'medication',
            date: med.datePrescribed ? new Date(med.datePrescribed) : mockDate,
            title: med.name,
            subtitle: `${med.dosage} • ${med.frequency}`,
            status: med.refillsRemaining > 0 ? 'active' : 'completed',
            details: `Prescribed by ${med.prescribedBy}`,
            icon: Pill,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100'
        });
    });

    return events.sort((a, b) => sortOrder === 'desc' ? b.date.getTime() - a.date.getTime() : a.date.getTime() - b.date.getTime());
  }, [appointments, labResults, medications, sortOrder]);

  const filteredEvents = timelineEvents.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.details?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: string, type: string) => {
      let styles = "bg-slate-100 text-slate-600";
      if (['upcoming', 'active', 'normal'].includes(status.toLowerCase())) styles = "bg-green-100 text-green-700";
      if (['completed', 'paid'].includes(status.toLowerCase())) styles = "bg-blue-100 text-blue-700";
      if (['cancelled', 'abnormal', 'overdue'].includes(status.toLowerCase())) styles = "bg-red-100 text-red-700";
      if (status === 'pending') styles = "bg-amber-100 text-amber-700";

      return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles}`}>
              {status}
          </span>
      );
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Patient History</h1>
                <p className="text-slate-500 text-sm">Comprehensive timeline of your medical journey.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={16} />
                    <span className="hidden md:inline">Export Records</span>
                </button>
                <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                    <button onClick={() => setSortOrder('desc')} className={`p-2 rounded-lg transition-all ${sortOrder === 'desc' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Clock size={16} className="rotate-180" />
                    </button>
                    <button onClick={() => setSortOrder('asc')} className={`p-2 rounded-lg transition-all ${sortOrder === 'asc' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Clock size={16} />
                    </button>
                </div>
            </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md bg-white/90">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search events, doctors, meds..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none transition-all"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {(['all', 'appointment', 'lab', 'medication'] as EventType[]).map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                            filterType === type 
                                ? 'bg-arya-600 text-white shadow-md shadow-arya-200' 
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                    </button>
                ))}
            </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-4 md:pl-8 space-y-8 min-h-[400px]">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-8 top-4 bottom-4 w-0.5 bg-slate-200/60 -ml-[1px]"></div>

            {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                    <div key={event.id} className="relative pl-8 md:pl-12 group animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
                        {/* Dot / Icon */}
                        <div className={`absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 -ml-4 md:-ml-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${event.bgColor} ${event.color}`}>
                            <event.icon size={16} className="md:w-5 md:h-5" />
                        </div>

                        {/* Date Label (Desktop: Side, Mobile: Top) */}
                        <div className="md:absolute md:-left-32 md:top-2 md:text-right md:w-24 mb-1 md:mb-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-300 hidden md:block">
                                {event.date.getFullYear()}
                            </span>
                        </div>

                        {/* Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-arya-200 cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{event.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{event.subtitle}</p>
                                </div>
                                {event.status && getStatusBadge(event.status, event.type)}
                            </div>
                            
                            <p className="text-slate-600 text-sm leading-relaxed mb-3 bg-slate-50 p-3 rounded-xl border border-slate-50">
                                {event.details}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    <Clock size={12} />
                                    {event.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <button className="text-arya-600 text-xs font-bold flex items-center hover:underline">
                                    View Details <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Filter size={48} className="mb-4 opacity-20" />
                    <p>No history found matching your filters.</p>
                    <button onClick={() => { setFilterType('all'); setSearchQuery(''); }} className="mt-2 text-arya-600 font-bold text-sm hover:underline">
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};
