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
    BriefcaseMedical,
    Sparkles,
    Loader2,
    TrendingUp,
    TrendingDown,
    Minus,
    Brain,
    X,
    Syringe,
    Scan,
    Clipboard,
    MessageSquare,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Appointment, LabResult, Medication, ClinicalNote, Vaccination, ImagingReport } from '../types';
import { geminiService } from '../services/geminiService';

interface HistoryPageProps {
    appointments: Appointment[];
    labResults: LabResult[];
    medications: Medication[];
    clinicalNotes: any[];
    vaccinations: any[];
    imagingReports: any[];
}

type EventType = 'appointment' | 'lab' | 'medication' | 'note' | 'vaccination' | 'imaging' | 'all';

interface TimelineEvent {
    id: string;
    type: EventType;
    date: Date;
    title: string;
    subtitle: string;
    status?: string;
    details?: string;
    icon: any;
    color: string;
    bgColor: string;
    metadata?: any;
}

interface TrendResult {
    trends: { vital: string; direction: string; summary: string; risk: string; recommendation: string }[];
    overallSummary: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
    appointments,
    labResults,
    medications,
    clinicalNotes = [],
    vaccinations = [],
    imagingReports = []
}) => {
    const [filterType, setFilterType] = useState<EventType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [trendResult, setTrendResult] = useState<TrendResult | null>(null);
    const [showTrends, setShowTrends] = useState(false);
    const [showNarrative, setShowNarrative] = useState(false);
    const [narrative, setNarrative] = useState('');

    const handleAnalyzeTrends = async () => {
        setIsAnalyzing(true);
        setShowTrends(true);
        try {
            // Mock vitals logic remains same for demo
            const mockVitals = [
                {
                    name: 'Blood Pressure (Systolic)', values: [
                        { date: '2023-01-15', value: 135 }, { date: '2023-04-10', value: 130 },
                        { date: '2023-07-20', value: 128 }, { date: '2023-10-05', value: 125 },
                    ]
                },
                // ... (other vitals same as before)
            ];
            const result = await geminiService.predictHealthTrends(mockVitals);
            setTrendResult(result);
        } catch {
            setTrendResult({ trends: [], overallSummary: 'Unable to analyze trends at this time.' });
        }
        setIsAnalyzing(false);
    };

    const handleGenerateNarrative = async () => {
        setShowNarrative(true);
        if (narrative) return;

        setIsAnalyzing(true);
        setTimeout(() => {
            setNarrative("Based on the patient's history, there is a consistent management of cardiovascular health, specifically arrhythmia, managed by Dr. Emily Chen. Recent lab results indicate elevated cholesterol, which correlates with the prescription of Lipitor. There has been a recent episode of allergic reaction, successfully treated. Vaccination status is up to date, including recent influenza and COVID-19 boosters.");
            setIsAnalyzing(false);
        }, 1500);
    };

    const getDirectionIcon = (direction: string) => {
        if (direction === 'improving') return <TrendingUp size={16} className="text-green-500" />;
        if (direction === 'worsening') return <TrendingDown size={16} className="text-red-500" />;
        return <Minus size={16} className="text-amber-500" />;
    };

    const getRiskBadge = (risk: string) => {
        const styles = risk === 'high' ? 'bg-red-100 text-red-700' : risk === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
        return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles}`}>{risk}</span>;
    };

    // Unified Data Processing
    const timelineEvents = useMemo(() => {
        const events: TimelineEvent[] = [];

        appointments.forEach(app => {
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

        medications.forEach((med, index) => {
            const mockDate = new Date(); // Fallback
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

        clinicalNotes.forEach(note => {
            events.push({
                id: `note-${note.id}`,
                type: 'note',
                date: new Date(note.date),
                title: note.type,
                subtitle: `${note.doctorName} • ${note.specialty}`,
                status: 'signed',
                details: note.summary,
                icon: FileText,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100'
            });
        });

        vaccinations.forEach(vac => {
            events.push({
                id: `vac-${vac.id}`,
                type: 'vaccination',
                date: new Date(vac.dateGiven),
                title: vac.vaccineName,
                subtitle: 'Immunization',
                status: vac.status,
                details: `Provider: ${vac.provider}`,
                icon: Syringe,
                color: 'text-teal-600',
                bgColor: 'bg-teal-100'
            });
        });

        imagingReports.forEach(img => {
            events.push({
                id: `img-${img.id}`,
                type: 'imaging',
                date: new Date(img.date),
                title: `${img.modality} - ${img.bodyPart}`,
                subtitle: `Radiology Report`,
                status: img.status,
                details: img.findings,
                icon: Scan,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100',
                metadata: { imageUrl: img.imageUrl }
            });
        });

        return events.sort((a, b) => sortOrder === 'desc' ? b.date.getTime() - a.date.getTime() : a.date.getTime() - b.date.getTime());
    }, [appointments, labResults, medications, clinicalNotes, vaccinations, imagingReports, sortOrder]);

    const filteredEvents = timelineEvents.filter(event => {
        const matchesType = filterType === 'all' || event.type === filterType;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.details && event.details.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesType && matchesSearch;
    });

    const getStatusBadge = (status: string, type: string) => {
        let styles = "bg-slate-100 text-slate-600";
        const s = status.toLowerCase();

        if (['upcoming', 'active', 'normal', 'completed', 'signed', 'approved'].includes(s)) styles = "bg-green-100 text-green-700";
        if (['pending', 'processing'].includes(s)) styles = "bg-amber-100 text-amber-700";
        if (['cancelled', 'abnormal', 'overdue', 'denied'].includes(s)) styles = "bg-red-100 text-red-700";

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
                    <h1 className="text-2xl font-bold text-slate-800">Health Timeline</h1>
                    <p className="text-slate-500 text-sm">Comprehensive record of all your medical interactions.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto flex-wrap">
                    <button
                        onClick={handleAnalyzeTrends}
                        disabled={isAnalyzing}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-arya-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                    >
                        {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                        AI Insights
                    </button>
                    <button
                        onClick={handleGenerateNarrative}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <MessageSquare size={16} /> Summary
                    </button>
                    <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm ml-auto md:ml-0">
                        <button onClick={() => setSortOrder('desc')} className={`p-2 rounded-lg transition-all ${sortOrder === 'desc' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Clock size={16} className="rotate-180" />
                        </button>
                        <button onClick={() => setSortOrder('asc')} className={`p-2 rounded-lg transition-all ${sortOrder === 'asc' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Clock size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Narrative Panel */}
            {showNarrative && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in p-6 relative">
                    <button onClick={() => setShowNarrative(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-arya-500 to-indigo-600 p-2 rounded-xl text-white">
                            <Brain size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">History Summary</h3>
                    </div>
                    {isAnalyzing && !narrative ? (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Loader2 size={14} className="animate-spin" /> Generating narrative...
                        </div>
                    ) : (
                        <p className="text-slate-700 leading-relaxed text-sm">
                            {narrative}
                        </p>
                    )}
                </div>
            )}

            {/* AI Health Trends Panel */}
            {showTrends && (
                <div className="bg-gradient-to-br from-arya-50 to-indigo-50 rounded-3xl border border-arya-100 shadow-sm overflow-hidden animate-fade-in relative">
                    <button onClick={() => setShowTrends(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={18} /></button>
                    <div className="flex items-center justify-between p-4 border-b border-arya-100">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Sparkles className="text-arya-600" size={18} /> Predictive Health Trends
                        </h3>
                    </div>

                    {isAnalyzing ? (
                        <div className="p-8 text-center">
                            <Loader2 size={32} className="animate-spin text-arya-600 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">Analyzing your vital signs and health data...</p>
                        </div>
                    ) : trendResult ? (
                        <div className="p-4 space-y-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                <p className="text-sm text-slate-700 leading-relaxed">{trendResult.overallSummary}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {trendResult.trends.map((trend, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getDirectionIcon(trend.direction)}
                                                <h4 className="font-bold text-slate-800 text-sm">{trend.vital}</h4>
                                            </div>
                                            {getRiskBadge(trend.risk)}
                                        </div>
                                        <p className="text-xs text-slate-600 mb-2">{trend.summary}</p>
                                        <p className="text-xs text-arya-600 font-medium bg-arya-50 p-2 rounded-lg">💡 {trend.recommendation}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-400 italic text-center">⚕️ AI predictions are not medical advice. Consult your healthcare provider.</p>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sticky top-0 z-20 backdrop-blur-md bg-white/90">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for conditions, doctors, medications, or reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none transition-all shadow-inner"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {(['all', 'appointment', 'lab', 'medication', 'note', 'vaccination', 'imaging'] as EventType[]).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${filterType === type
                                ? 'bg-arya-600 text-white border-arya-600 shadow-md shadow-arya-200'
                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {type === 'all' ? 'All' : type}
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
                        <div key={event.id} className="relative pl-8 md:pl-12 group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                            {/* Dot / Icon */}
                            <div className={`absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 -ml-4 md:-ml-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${event.bgColor} ${event.color}`}>
                                <event.icon size={16} className="md:w-5 md:h-5" />
                            </div>

                            {/* Date Label */}
                            <div className="md:absolute md:-left-32 md:top-2 md:text-right md:w-24 mb-1 md:mb-0">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                    {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="text-[10px] text-slate-300 hidden md:block">
                                    {event.date.getFullYear()}
                                </span>
                            </div>

                            {/* Card */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-arya-200 cursor-pointer overflow-hidden">
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

                                {event.metadata?.imageUrl && (
                                    <div className="mb-3 rounded-xl overflow-hidden h-32 w-full max-w-xs border border-slate-200 relative group/img">
                                        <img src={event.metadata.imageUrl} alt="Imaging" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-bold">View Image</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                        <Clock size={12} />
                                        {event.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <button className="text-arya-600 text-xs font-bold flex items-center hover:underline group/btn">
                                        View Details <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
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
