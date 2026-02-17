import React, { useState } from 'react';
import {
  Clock, MapPin, Video, Home, User, Zap, Brain, Sparkles,
  PhoneOff, Mic, MicOff, Camera, CameraOff,
  XCircle, CalendarClock, ClipboardCheck, FileText, Star,
  MessageCircle, Bell, Share2, Printer, Wand2, AlertTriangle,
  ChevronDown, ChevronUp, MoreHorizontal, Loader2, Copy, Check
} from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentCardProps {
  appointment: Appointment;
  onJoinVideoCall: (appointment: Appointment) => void;
  onCancelAppointment?: (id: string, reason: string) => void;
  onRescheduleAppointment?: (appointment: Appointment) => void;
  onCheckIn?: (appointment: Appointment) => void;
  onViewNotes?: (appointment: Appointment) => void;
  onRateVisit?: (appointment: Appointment) => void;
  onChatDoctor?: (appointment: Appointment) => void;
  onSetReminder?: (appointment: Appointment) => void;
  onFollowUp?: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onJoinVideoCall,
  onCancelAppointment,
  onRescheduleAppointment,
  onCheckIn,
  onViewNotes,
  onRateVisit,
  onChatDoctor,
  onSetReminder,
  onFollowUp,
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [aiPrep, setAiPrep] = useState<string[] | null>(null);
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [aiReminder, setAiReminder] = useState<string | null>(null);
  const [loadingReminder, setLoadingReminder] = useState(false);
  const [copied, setCopied] = useState(false);

  // No-show risk (simulated based on appointment attributes)
  const noShowRisk = appointment.status === 'upcoming' ? (
    appointment.visitType === 'video' ? 'Low' :
      appointment.matchScore && appointment.matchScore < 80 ? 'Medium' : 'Low'
  ) : null;

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise(r => setTimeout(r, 1200));
    onCancelAppointment?.(appointment.id, cancelReason);
    setCancelling(false);
    setShowCancelDialog(false);
  };

  const handleGeneratePrep = async () => {
    setLoadingPrep(true);
    // Simulated AI prep checklist
    await new Promise(r => setTimeout(r, 1000));
    const preps: Record<string, string[]> = {
      'Cardiology': ['Wear comfortable clothing for ECG', 'List all current medications', 'Note any chest pain episodes', 'Bring previous ECG reports', 'Fast 4 hours before if blood work needed'],
      'Dermatology': ['Avoid applying makeup to affected area', 'List all skincare products used', 'Take photos of any changes', 'Wear loose clothing for easy exam'],
      'General Practice': ['List your symptoms with duration', 'Bring medication list', 'Note any allergies', 'Have insurance card ready', 'Write down questions to ask'],
      'Neurology': ['Keep a headache diary if applicable', 'List all medications including OTC', 'Note any vision or speech changes', 'Bring previous scan results'],
      'Pediatrics': ['Bring vaccination records', 'Note any recent illnesses', 'List allergies and medications', 'Prepare growth/feeding logs'],
      'Orthopedics': ['Wear shorts/loose clothing for joint exam', 'Bring previous X-rays/MRIs', 'Note pain levels and triggers', 'List any exercises that help or hurt'],
    };
    setAiPrep(preps[appointment.specialty] || preps['General Practice']);
    setLoadingPrep(false);
  };

  const handleSmartReminder = async () => {
    setLoadingReminder(true);
    await new Promise(r => setTimeout(r, 800));
    const reminders: Record<string, string> = {
      'Cardiology': `🫀 Your cardiology appointment is at ${appointment.time}. Remember to fast 4 hours before and bring your previous ECG reports.`,
      'Dermatology': `🧴 Don't forget your dermatology visit at ${appointment.time}. Avoid applying makeup to the affected area today.`,
      'General Practice': `📋 Your checkup with ${appointment.doctorName} is at ${appointment.time}. Bring your medication list and insurance card.`,
      'Neurology': `🧠 Neurology appointment at ${appointment.time}. Remember to bring your headache diary and any scan CDs.`,
      'Pediatrics': `👶 Pediatric visit at ${appointment.time}. Don't forget the vaccination record and growth log.`,
      'Orthopedics': `🦴 Ortho appointment at ${appointment.time}. Wear comfortable, loose clothing for the exam.`,
    };
    setAiReminder(reminders[appointment.specialty] || reminders['General Practice']);
    setLoadingReminder(false);
  };

  const handleShare = () => {
    const text = `Appointment: ${appointment.doctorName}\nSpecialty: ${appointment.specialty}\nDate: ${new Date(appointment.date).toLocaleDateString()}\nTime: ${appointment.time}\nLocation: ${appointment.location}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(`<html><head><title>Appointment - ${appointment.doctorName}</title><style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:auto}h1{color:#4f46e5}dl{display:grid;grid-template-columns:1fr 2fr;gap:8px}dt{font-weight:bold;color:#374151}dd{margin:0;color:#6b7280}</style></head><body>
        <h1>Appointment Details</h1>
        <dl><dt>Doctor</dt><dd>${appointment.doctorName}</dd><dt>Specialty</dt><dd>${appointment.specialty}</dd><dt>Date</dt><dd>${new Date(appointment.date).toLocaleDateString()}</dd><dt>Time</dt><dd>${appointment.time}</dd><dt>Location</dt><dd>${appointment.location}</dd><dt>Status</dt><dd>${appointment.status}</dd></dl>
        ${appointment.aiSummary ? `<h2>AI Summary</h2><p>${appointment.aiSummary}</p>` : ''}
        <p style="margin-top:40px;color:#9ca3af;font-size:12px">Arya Hospital Portal</p></body></html>`);
      w.document.close();
      w.print();
    }
  };

  const cancelReasons = ['Schedule conflict', 'Feeling better', 'Found another provider', 'Transportation issue', 'Cost concern', 'Other'];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6 flex flex-col md:flex-row gap-6 relative">
        {/* Status indicator */}
        <div className={`absolute left-0 top-0 bottom-0 md:h-full w-full h-1.5 md:w-1.5 ${appointment.status === 'upcoming' ? 'bg-arya-500' :
            appointment.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'
          }`}></div>

        {/* Date display */}
        <div className="mt-2 md:mt-0 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex md:flex-col flex-row items-center justify-between md:justify-center md:min-w-[100px] text-center gap-4 md:gap-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {new Date(appointment.date).toLocaleString('default', { month: 'short' })}
          </span>
          <span className="text-3xl font-bold text-slate-800 my-1">
            {new Date(appointment.date).getDate()}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(appointment.date).toLocaleString('default', { weekday: 'short' })}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-grow space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-800 text-xl">{appointment.doctorName}</h3>
              <div className="flex flex-wrap gap-2 text-arya-600 font-medium text-sm items-center">
                <span>{appointment.specialty}</span>
                <span>•</span>
                <span className="capitalize">
                  {appointment.category === 'home-care' ? 'Home Care' :
                    appointment.category === 'lab' ? 'Lab Test' :
                      appointment.category === 'imaging' ? 'Imaging' : 'Consultation'}
                </span>
                {appointment.patientName && (
                  <>
                    <span>•</span>
                    <span className="text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      <User size={12} /> {appointment.patientName}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 items-center">
              {appointment.status === 'upcoming' && appointment.matchScore && (
                <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center border border-green-100">
                  <Zap size={12} className="mr-1" /> {appointment.matchScore}% Match
                </span>
              )}
              {/* F20: No-Show Risk Badge */}
              {noShowRisk && appointment.status === 'upcoming' && (
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center border ${noShowRisk === 'Low' ? 'bg-green-50 text-green-600 border-green-100' :
                    noShowRisk === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-red-50 text-red-600 border-red-100'
                  }`}>
                  <AlertTriangle size={10} className="mr-1" /> {noShowRisk} Risk
                </span>
              )}
              {/* Checked-in badge */}
              {(appointment as any).checkedIn && (
                <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center border border-emerald-100">
                  <ClipboardCheck size={12} className="mr-1" /> Checked In
                </span>
              )}
              {appointment.status === 'completed' && (
                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-bold">Completed</span>
              )}
              {appointment.status === 'cancelled' && (
                <span className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full font-bold">Cancelled</span>
              )}
            </div>
          </div>

          {/* Time and location */}
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Clock size={16} className="mr-2 text-arya-500" />
              {appointment.time}
            </div>
            <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {appointment.visitType === 'video' ? (
                <Video size={16} className="mr-2 text-arya-500" />
              ) : appointment.visitType === 'home-visit' ? (
                <Home size={16} className="mr-2 text-arya-500" />
              ) : (
                <MapPin size={16} className="mr-2 text-arya-500" />
              )}
              {appointment.location}
            </div>
            {appointment.smartTags && appointment.smartTags.map(tag => (
              <div key={tag} className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={12} className="mr-1" /> {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary and actions */}
      {(appointment.aiSummary || appointment.prepInstructions || appointment.status !== 'cancelled') && (
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 space-y-3">
          {/* AI Summary */}
          {(appointment.aiSummary || appointment.prepInstructions) && (
            <div className="flex items-start gap-3 max-w-xl">
              <div className="bg-white p-2 rounded-full shadow-sm text-arya-600 mt-1 min-w-[32px]">
                <Brain size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase mb-1">AI Details</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {appointment.aiSummary || appointment.prepInstructions?.join('. ')}
                </p>
              </div>
            </div>
          )}

          {/* AI Smart Reminder */}
          {aiReminder && (
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm text-amber-800 flex items-start gap-2 animate-fade-in">
              <Bell size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p>{aiReminder}</p>
            </div>
          )}

          {/* AI Prep Checklist */}
          {aiPrep && (
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 animate-fade-in">
              <p className="text-xs font-bold text-purple-700 uppercase mb-2 flex items-center gap-1"><Wand2 size={12} /> Pre-Visit Checklist</p>
              <ul className="space-y-1">
                {aiPrep.map((item, i) => (
                  <li key={i} className="text-xs text-purple-700 flex items-start gap-2">
                    <Check size={12} className="text-purple-500 mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Primary Actions */}
          {appointment.status === 'upcoming' && (
            <div className="flex flex-wrap items-center gap-2">
              {appointment.visitType === 'video' && (
                <button onClick={() => onJoinVideoCall(appointment)} className="py-2 px-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                  <Video size={16} /> Join Call
                </button>
              )}
              <button onClick={() => onCheckIn?.(appointment)} className="py-2 px-4 bg-arya-600 text-white rounded-xl text-sm font-medium hover:bg-arya-700 transition-colors shadow-sm flex items-center gap-2">
                <ClipboardCheck size={14} /> Check In
              </button>
              <button onClick={() => onRescheduleAppointment?.(appointment)} className="py-2 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <CalendarClock size={14} /> Reschedule
              </button>
              <button onClick={() => onChatDoctor?.(appointment)} className="py-2 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <MessageCircle size={14} /> Chat
              </button>

              {/* Expand for more */}
              <button onClick={() => setExpanded(!expanded)} className="py-2 px-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-sm hover:bg-slate-50 transition-colors">
                {expanded ? <ChevronUp size={14} /> : <MoreHorizontal size={14} />}
              </button>
            </div>
          )}

          {/* Completed actions */}
          {appointment.status === 'completed' && (
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => onViewNotes?.(appointment)} className="py-2 px-4 bg-arya-600 text-white rounded-xl text-sm font-medium hover:bg-arya-700 transition-colors shadow-sm flex items-center gap-2">
                <FileText size={14} /> View Notes
              </button>
              <button onClick={() => onRateVisit?.(appointment)} className="py-2 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Star size={14} /> Rate Visit
              </button>
              <button onClick={() => onFollowUp?.(appointment)} className="py-2 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all flex items-center gap-2">
                <Wand2 size={14} /> AI Follow-Up
              </button>
              <button onClick={() => setExpanded(!expanded)} className="py-2 px-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-sm hover:bg-slate-50 transition-colors">
                {expanded ? <ChevronUp size={14} /> : <MoreHorizontal size={14} />}
              </button>
            </div>
          )}

          {/* Expanded extra actions */}
          {expanded && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 animate-fade-in">
              {appointment.status === 'upcoming' && (
                <>
                  <button onClick={() => onSetReminder?.(appointment)} className="py-2 px-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <Bell size={12} /> Reminders
                  </button>
                  <button onClick={handleGeneratePrep} disabled={loadingPrep} className="py-2 px-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-xs font-medium hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50">
                    {loadingPrep ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} AI Prep
                  </button>
                  <button onClick={handleSmartReminder} disabled={loadingReminder} className="py-2 px-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-medium hover:bg-amber-100 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                    {loadingReminder ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Smart Reminder
                  </button>
                  <button onClick={handleShare} className="py-2 px-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    {copied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Copy size={12} /> Share</>}
                  </button>
                  <button onClick={handlePrint} className="py-2 px-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <Printer size={12} /> Print
                  </button>
                  <button onClick={() => setShowCancelDialog(true)} className="py-2 px-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5">
                    <XCircle size={12} /> Cancel
                  </button>
                </>
              )}
              {appointment.status === 'completed' && (
                <>
                  <button onClick={handleShare} className="py-2 px-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    {copied ? <><Check size={12} className="text-green-500" /> Copied!</> : <><Share2 size={12} /> Share</>}
                  </button>
                  <button onClick={handlePrint} className="py-2 px-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                    <Printer size={12} /> Print
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="p-6 border-t border-red-100 bg-red-50/50 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-500" />
            <h4 className="font-bold text-red-700 text-sm">Cancel this appointment?</h4>
          </div>
          <div className="space-y-3">
            <select
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              className="w-full p-2.5 bg-white border border-red-200 rounded-xl text-sm focus:ring-2 focus:ring-red-200 outline-none text-slate-600"
              title="Select reason"
            >
              <option value="">Select a reason...</option>
              {cancelReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowCancelDialog(false)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason || cancelling}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelling ? <><Loader2 size={14} className="animate-spin" /> Cancelling...</> : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
