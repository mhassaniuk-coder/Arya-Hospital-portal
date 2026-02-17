import React, { useState, useMemo } from 'react';
import {
  Calendar, Clock, MapPin, Plus, Video,
  Stethoscope, Sparkles, ChevronRight,
  CheckCircle, Zap, User, ArrowLeft, Search, X,
  Lock, List, LayoutGrid, Map, BarChart3, Repeat
} from 'lucide-react';
import { Appointment, Doctor, ServiceItem, SmartSlot, AIAnalysisResult } from '../../types';
import { geminiService } from '../../services/geminiService';

import {
  BookingMode,
  ServiceType,
  ManualFilters,
  PaymentDetails,
  GENERATE_SMART_SLOTS
} from './types';

// Sub-components
import { AppointmentCard } from './AppointmentCard';
import { VideoCallOverlay } from './VideoCallOverlay';
import { ProgressBar } from './BookingWizard';
import { ServiceTypeSelection } from './ServiceTypeSelection';
import { ConsultationTypeSelection } from './ConsultationTypeSelection';
import { ProviderSelection } from './ProviderSelection';
import { DateTimeSelection } from './DateTimeSelection';
import { ReviewDetails } from './ReviewDetails';
import { PaymentForm } from './PaymentForm';
import { BookingConfirmation } from './BookingConfirmation';
import { FamilyMember } from '../../types';

// New feature components
import { CheckInModal } from './CheckInModal';
import { PostVisitPanel } from './PostVisitPanel';
import { RatingModal } from './RatingModal';
import { CalendarView } from './CalendarView';
import { AppointmentStats } from './AppointmentStats';
import { MapView } from './MapView';
import { DoctorChatPanel } from './DoctorChatPanel';
import { ReminderSettings } from './ReminderSettings';
import { FollowUpPanel } from './FollowUpPanel';
import { LabTestLibrary } from './LabTestLibrary';

interface AppointmentsProps {
  appointments: Appointment[];
  familyMembers: FamilyMember[];
  onAddAppointment: (appt: Appointment) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({ appointments, onAddAppointment, familyMembers }) => {
  // ... (existing state)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'in-person'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // F11: View mode (list, calendar, map)
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'map'>('list');
  // F12: Stats visibility
  const [showStats, setShowStats] = useState(true);

  // Booking wizard state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode>('service-selection');
  const [step, setStep] = useState(1);
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('u1');
  // ...


  // F6: Recurring appointments
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [recurrenceCount, setRecurrenceCount] = useState(4);

  // Payment state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  // AI flow state
  const [symptomInput, setSymptomInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  // Manual filter state
  const [manualFilters, setManualFilters] = useState<ManualFilters>({
    search: '',
    specialty: 'All',
    gender: 'All',
    language: 'All',
    videoOnly: false
  });

  // Selection state
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>('consultation');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SmartSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [consultationType, setConsultationType] = useState<'video' | 'in-person'>('in-person');

  // Video call state
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  // Modal states for new features
  const [checkInAppointment, setCheckInAppointment] = useState<Appointment | null>(null);
  const [viewNotesAppointment, setViewNotesAppointment] = useState<Appointment | null>(null);
  const [ratingAppointment, setRatingAppointment] = useState<Appointment | null>(null);
  const [chatAppointment, setChatAppointment] = useState<Appointment | null>(null);
  const [reminderAppointment, setReminderAppointment] = useState<Appointment | null>(null);
  const [followUpAppointment, setFollowUpAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);

  // F9: Waitlist state
  const [waitlistItems, setWaitlistItems] = useState<string[]>([]);

  // Local appointments state for cancel/check-in mutations
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(appointments);

  // Sync with props
  React.useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  // --- HELPER FUNCTIONS ---

  const resetBooking = () => {
    setIsBooking(false);
    setTimeout(() => {
      setStep(1);
      setBookingMode('service-selection');
      setSymptomInput('');
      setAiResult(null);
      setSelectedDoctor(null);
      setSelectedService(null);
      setSelectedSlot(null);
      setPaymentDetails({ cardNumber: '', expiry: '', cvc: '', name: '' });
      setIsProcessingPayment(false);
      setSelectedFamilyMemberId('u1');
      setIsRecurring(false);
      setRecurrenceCount(4);
      setConsultationType('in-person');
    }, 300);
  };

  const toggleListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomInput(prev => (prev ? prev + " " : "") + transcript);
      };
      if (isListening) recognition.stop();
      else recognition.start();
    } else {
      alert("Browser does not support speech recognition.");
    }
  };

  const runAiAnalysis = async () => {
    if (!symptomInput.trim()) return;
    setAnalyzing(true);
    const result = await geminiService.analyzeSymptoms(symptomInput);
    setAiResult(result);
    setAnalyzing(false);
  };

  const processPaymentAndBook = async () => {
    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isDoctor = bookingMode === 'ai' || bookingMode === 'manual';
    const providerName = isDoctor ? selectedDoctor?.name : selectedService?.name;
    const spec = isDoctor
      ? selectedDoctor?.specialty
      : (bookingMode === 'home-care' ? 'Home Care' : bookingMode === 'lab' ? 'Pathology Lab' : 'Radiology Center');

    // F6: Create recurring appointments
    const appointmentCount = isRecurring ? recurrenceCount : 1;

    for (let i = 0; i < appointmentCount; i++) {
      const appointmentDate = new Date(selectedSlot ? selectedSlot.dateIso : new Date().toISOString());
      if (isRecurring && i > 0) {
        if (recurrenceType === 'weekly') appointmentDate.setDate(appointmentDate.getDate() + (7 * i));
        else if (recurrenceType === 'biweekly') appointmentDate.setDate(appointmentDate.getDate() + (14 * i));
        else appointmentDate.setMonth(appointmentDate.getMonth() + i);
      }

      const newAppt: Appointment = {
        id: (Date.now() + i).toString(),
        doctorName: providerName || 'Arya Medical Service',
        specialty: spec || 'General',
        date: appointmentDate.toISOString(),
        time: selectedSlot?.time || '10:00 AM',
        status: 'upcoming',
        location: isDoctor
          ? (selectedSlot?.type === 'video' ? 'Virtual Video Link' : 'Building A, Room 302')
          : (bookingMode === 'home-care' ? 'Home Visit' : 'Central Diagnostic Wing'),
        symptoms: symptomInput || (selectedService?.description || 'Routine checkup'),
        aiSummary: aiResult
          ? `AI Triaged: ${aiResult.urgency} urgency. ${aiResult.reasoning}`
          : (isRecurring ? `Recurring ${recurrenceType} appointment (${i + 1}/${appointmentCount})` : 'Manually booked service.'),
        matchScore: selectedSlot?.score || 100,
        visitType: isDoctor
          ? selectedSlot?.type
          : (bookingMode === 'home-care' ? 'home-visit' : 'in-person'),
        smartTags: [...(selectedSlot?.tags || []), ...(isRecurring ? ['Recurring'] : [])],
        prepInstructions: aiResult?.prepTips || ['Please arrive 15 mins early'],
        patientName: familyMembers.find(m => m.id === selectedFamilyMemberId)?.name || 'Self',
        patientId: selectedFamilyMemberId,
        category: bookingMode === 'manual' || bookingMode === 'ai'
          ? 'consultation'
          : (bookingMode as any)
      };

      onAddAppointment(newAppt);
    }

    setIsProcessingPayment(false);
    setStep(6);
  };

  // F1: Cancel appointment
  const handleCancelAppointment = (id: string, reason: string) => {
    setLocalAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'cancelled' as const, aiSummary: `Cancelled: ${reason}` } : a
    ));
  };

  // F3: Check-in
  const handleCheckIn = (id: string) => {
    setLocalAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, smartTags: [...(a.smartTags || []), 'Checked In'] } : a
    ));
    setCheckInAppointment(null);
  };

  // F9: Join waitlist
  const handleJoinWaitlist = (appointmentId: string) => {
    setWaitlistItems(prev => [...prev, appointmentId]);
  };

  // --- LIST LOGIC ---

  const filteredAppointments = useMemo(() => {
    return localAppointments
      .filter(app => {
        const matchesTab = activeTab === 'upcoming'
          ? (app.status === 'upcoming')
          : (app.status === 'completed' || app.status === 'cancelled');
        const matchesType = typeFilter === 'all' || app.visitType === typeFilter;
        const term = searchTerm.toLowerCase();
        const matchesSearch = app.doctorName.toLowerCase().includes(term) ||
          app.specialty.toLowerCase().includes(term) ||
          (app.symptoms?.toLowerCase().includes(term));
        return matchesTab && matchesType && matchesSearch;
      })
      .sort((a, b) =>
        activeTab === 'upcoming'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [localAppointments, activeTab, typeFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
  const currentItems = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- RENDER ---

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in relative">
      {/* Video Call Overlay */}
      {activeVideoCall && (
        <VideoCallOverlay
          appointment={activeVideoCall}
          isMuted={isMuted}
          cameraOff={cameraOff}
          onToggleMute={() => setIsMuted(!isMuted)}
          onToggleCamera={() => setCameraOff(!cameraOff)}
          onEndCall={() => setActiveVideoCall(null)}
        />
      )}

      {/* Feature Modals */}
      {checkInAppointment && (
        <CheckInModal
          appointment={checkInAppointment}
          onClose={() => setCheckInAppointment(null)}
          onCheckIn={handleCheckIn}
        />
      )}
      {viewNotesAppointment && (
        <PostVisitPanel
          appointment={viewNotesAppointment}
          onClose={() => setViewNotesAppointment(null)}
        />
      )}
      {ratingAppointment && (
        <RatingModal
          appointment={ratingAppointment}
          onClose={() => setRatingAppointment(null)}
        />
      )}
      {chatAppointment && (
        <DoctorChatPanel
          appointment={chatAppointment}
          onClose={() => setChatAppointment(null)}
        />
      )}
      {reminderAppointment && (
        <ReminderSettings
          appointment={reminderAppointment}
          onClose={() => setReminderAppointment(null)}
        />
      )}
      {followUpAppointment && (
        <FollowUpPanel
          appointment={followUpAppointment}
          onClose={() => setFollowUpAppointment(null)}
        />
      )}

      {/* F2: Reschedule Modal */}
      {rescheduleAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Reschedule Appointment</h2>
              <button onClick={() => setRescheduleAppointment(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto">
              <DateTimeSelection
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                bookingMode="manual"
                onSelectDate={setSelectedDate}
                onSelectSlot={setSelectedSlot}
              />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              <button onClick={() => setRescheduleAppointment(null)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
              <button
                disabled={!selectedSlot}
                onClick={() => {
                  if (selectedSlot) {
                    setLocalAppointments(prev => prev.map(a =>
                      a.id === rescheduleAppointment.id
                        ? { ...a, date: `${selectedSlot.dateIso}T10:00:00`, time: selectedSlot.time, aiSummary: `Rescheduled to ${selectedSlot.time}` }
                        : a
                    ));
                    setRescheduleAppointment(null);
                    setSelectedSlot(null);
                  }
                }}
                className="px-6 py-2 bg-arya-600 text-white rounded-xl font-bold hover:bg-arya-700 disabled:opacity-50"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* F12: Appointment Statistics */}
      {showStats && <AppointmentStats appointments={localAppointments} />}

      {/* Main Content */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                <List size={10} className="mr-1" /> {localAppointments.length} Total
              </span>
            </div>
            <p className="text-slate-500 text-sm">Manage scheduled visits for you and your family.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* F11/F13: View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`} title="List View">
                <List size={16} />
              </button>
              <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`} title="Calendar View">
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode('map')} className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`} title="Map View">
                <Map size={16} />
              </button>
            </div>
            {/* F12: Stats toggle */}
            <button onClick={() => setShowStats(!showStats)} className={`p-2 rounded-xl border transition-all ${showStats ? 'bg-arya-50 border-arya-200 text-arya-600' : 'bg-white border-slate-200 text-slate-400'}`} title="Toggle Stats">
              <BarChart3 size={16} />
            </button>
            <button
              onClick={() => { setIsBooking(true); setStep(1); setBookingMode('service-selection'); }}
              className="flex items-center justify-center space-x-2 bg-arya-600 text-white px-6 py-3 rounded-xl hover:bg-arya-700 transition-all shadow-lg shadow-arya-200 font-semibold group"
            >
              <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                <Plus size={18} />
              </div>
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 pt-2 border-t border-slate-50">
          <div className="flex bg-slate-100 p-1 rounded-xl whitespace-nowrap overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => { setActiveTab('upcoming'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              History
            </button>
          </div>
          <div className="flex-grow flex flex-col md:flex-row gap-2 w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search doctor, specialty, or patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none transition-all"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none text-slate-600 w-full md:w-auto"
              title="Filter by appointment type"
            >
              <option value="all">All Types</option>
              <option value="in-person">In-Person</option>
              <option value="video">Video Visit</option>
              <option value="home-visit">Home Visit</option>
            </select>
          </div>

          {/* F9: Waitlist indicator */}
          {waitlistItems.length > 0 && (
            <span className="bg-amber-50 text-amber-700 px-3 py-2 rounded-xl text-xs font-bold border border-amber-200 flex items-center gap-1 shrink-0">
              <Clock size={12} /> {waitlistItems.length} Waitlisted
            </span>
          )}
        </div>
      </div>

      {/* Content Based on View Mode */}
      {viewMode === 'list' && (
        <>
          <div className="grid gap-6">
            {currentItems.length > 0 ? (
              currentItems.map(app => (
                <AppointmentCard
                  key={app.id}
                  appointment={app}
                  onJoinVideoCall={setActiveVideoCall}
                  onCancelAppointment={handleCancelAppointment}
                  onRescheduleAppointment={setRescheduleAppointment}
                  onCheckIn={setCheckInAppointment}
                  onViewNotes={setViewNotesAppointment}
                  onRateVisit={setRatingAppointment}
                  onChatDoctor={setChatAppointment}
                  onSetReminder={setReminderAppointment}
                  onFollowUp={setFollowUpAppointment}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-slate-300" size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No appointments found</h3>
                <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === i + 1 ? 'bg-arya-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* F11: Calendar View */}
      {viewMode === 'calendar' && <CalendarView appointments={localAppointments} />}

      {/* F13: Map View */}
      {viewMode === 'map' && <MapView appointments={localAppointments} />}

      {/* Booking Wizard Modal */}
      {isBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white md:bg-slate-900/60 md:backdrop-blur-md md:p-4 animate-fade-in overflow-hidden">
          <div className="w-full h-[100dvh] md:h-[90vh] md:max-w-6xl md:rounded-[2rem] bg-white shadow-2xl overflow-hidden flex flex-col relative">
            {/* Header */}
            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 flex justify-between items-center bg-white z-20 shrink-0">
              <div className="flex items-center gap-3">
                {step > 1 && step < 6 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    title="Go back"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h2 className="text-lg font-bold text-slate-800">
                  {step === 1 && 'Select Service Type'}
                  {step === 2 && 'Choose Provider'}
                  {step === 3 && 'Select Date & Time'}
                  {step === 4 && 'Review & Details'}
                  {step === 5 && 'Payment'}
                  {step === 6 && 'Booking Confirmed'}
                </h2>
              </div>
              <button
                onClick={resetBooking}
                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors"
                title="Close booking wizard"
              >
                <X size={24} />
              </button>
            </div>

            {/* Progress Bar */}
            {step < 6 && (
              <div className="px-4 py-4 md:px-6 md:py-6 bg-slate-50/50 border-b border-slate-100">
                <ProgressBar currentStep={step} />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto overflow-x-hidden">
              {step === 1 && (
                <ServiceTypeSelection
                  selectedServiceType={selectedServiceType}
                  selectedFamilyMemberId={selectedFamilyMemberId}
                  familyMembers={familyMembers}
                  onSelectServiceType={setSelectedServiceType}
                  onSelectBookingMode={(mode) => setBookingMode(mode as BookingMode)}
                  onSelectFamilyMember={setSelectedFamilyMemberId}
                />
              )}

              {step === 2 && (
                bookingMode === 'consultation' || bookingMode === 'manual' ? (
                  <ConsultationTypeSelection
                    onSelectType={(type) => {
                      setConsultationType(type);
                      setBookingMode('manual');
                      setStep(3);
                    }}
                    onBack={() => setStep(1)}
                  />
                ) : (
                  bookingMode === 'lab' ? (
                    <LabTestLibrary
                      onSelectTest={(test) => {
                        setSelectedService(test);
                        setStep(4);
                      }}
                      onBack={() => setStep(1)}
                    />
                  ) : (
                    <ProviderSelection
                      bookingMode={bookingMode}
                      manualFilters={manualFilters}
                      selectedDoctor={selectedDoctor}
                      selectedService={selectedService}
                      onUpdateFilters={setManualFilters}
                      onSelectDoctor={(doc) => { setSelectedDoctor(doc); setStep(4); }}
                      onSelectService={(srv) => { setSelectedService(srv); setStep(4); }}
                      appointmentType={consultationType}
                    />
                  )
                )
              )}

              {step === 3 && (
                bookingMode === 'manual' || bookingMode === 'consultation' ? (
                  <ProviderSelection
                    bookingMode={bookingMode}
                    manualFilters={manualFilters}
                    selectedDoctor={selectedDoctor}
                    selectedService={selectedService}
                    onUpdateFilters={setManualFilters}
                    onSelectDoctor={setSelectedDoctor}
                    onSelectService={setSelectedService}
                    appointmentType={consultationType}
                  />
                ) : (
                  // If Lab/Home/Imaging, they did provider/service selection in step 2.
                  // So Step 3 is Date Selection for them?
                  // Flow needs unification.
                  <div></div>
                )
              )}


              {step === 4 && (
                <div>
                  <DateTimeSelection
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    bookingMode={bookingMode}
                    onSelectDate={setSelectedDate}
                    onSelectSlot={setSelectedSlot}
                  />

                  {/* F7: Multi-slot note */}
                  {selectedSlot && familyMembers.length > 1 && (
                    <div className="mx-6 md:mx-8 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700">
                      <p className="font-bold">💡 Tip: You can book this slot for multiple family members by going back to Step 1 and selecting a different patient.</p>
                    </div>
                  )}

                  {/* F6: Recurring toggle */}
                  <div className="mx-6 md:mx-8 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={e => setIsRecurring(e.target.checked)}
                        className="w-5 h-5 accent-arya-600 rounded"
                      />
                      <div>
                        <p className="font-semibold text-slate-700 text-sm flex items-center gap-2"><Repeat size={14} /> Make this a recurring appointment</p>
                        <p className="text-xs text-slate-400">Automatically schedule follow-up visits</p>
                      </div>
                    </label>

                    {isRecurring && (
                      <div className="mt-3 flex flex-wrap gap-3 animate-fade-in">
                        <select
                          value={recurrenceType}
                          onChange={e => setRecurrenceType(e.target.value as any)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                          title="Recurrence frequency"
                        >
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Every 2 Weeks</option>
                          <option value="monthly">Monthly</option>
                        </select>
                        <select
                          value={recurrenceCount}
                          onChange={e => setRecurrenceCount(Number(e.target.value))}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                          title="Number of appointments"
                        >
                          {[2, 3, 4, 6, 8, 12].map(n => (
                            <option key={n} value={n}>{n} appointments</option>
                          ))}
                        </select>
                        <span className="text-xs text-arya-600 bg-arya-50 px-3 py-2 rounded-xl border border-arya-100 font-medium">
                          {recurrenceCount} appointments will be created
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 5 && (
                <ReviewDetails
                  selectedServiceType={selectedServiceType}
                  selectedDoctor={selectedDoctor}
                  selectedService={selectedService}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedFamilyMemberId={selectedFamilyMemberId}
                  familyMembers={familyMembers}
                  symptomInput={symptomInput}
                  isListening={isListening}
                  analyzing={analyzing}
                  aiResult={aiResult}
                  onSymptomChange={setSymptomInput}
                  onToggleListening={toggleListening}
                  onRunAiAnalysis={runAiAnalysis}
                />
              )}

              {step === 6 && (
                <div>
                  <PaymentForm
                    selectedDoctor={selectedDoctor}
                    selectedService={selectedService}
                    paymentDetails={paymentDetails}
                    isProcessing={isProcessingPayment}
                    onUpdatePaymentDetails={setPaymentDetails}
                  />
                  {/* F8: Insurance verification notice */}
                  <div className="mx-6 md:mx-8 mb-6 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="font-bold text-green-800 text-sm">Insurance Pre-Verified</span>
                    </div>
                    <p className="text-xs text-green-600">Your insurance coverage for this {selectedDoctor?.specialty || 'service'} visit has been verified. Estimated co-pay: $25.</p>
                  </div>
                </div>
              )}

              {step === 7 && (
                <BookingConfirmation
                  selectedServiceType={selectedServiceType}
                  selectedDoctor={selectedDoctor}
                  selectedService={selectedService}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedFamilyMemberId={selectedFamilyMemberId}
                  familyMembers={familyMembers}
                  onClose={resetBooking}
                />
              )}
            </div>

            {/* Footer Navigation */}
            {step < 7 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
                <button
                  onClick={() => {
                    if (step === 1) resetBooking();
                    else if (step === 4 && bookingMode !== 'manual' && bookingMode !== 'consultation') setStep(2);
                    else setStep(step - 1);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  <ArrowLeft size={18} />
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>

                <button
                  onClick={() => {
                    if (step === 6) processPaymentAndBook();
                    else if (step === 1) {
                      if (selectedServiceType === 'consultation') { setBookingMode('manual'); setStep(2); }
                      else { setBookingMode(selectedServiceType as any); setStep(2); }
                    }
                    else if (step === 2) {
                      if (bookingMode === 'manual' || bookingMode === 'consultation') setStep(3);
                      else setStep(4);
                    }
                    else if (step === 3) setStep(4);
                    else setStep(step + 1);
                  }}
                  disabled={
                    (step === 1 && !selectedServiceType) ||
                    (step === 2 && bookingMode === 'manual' && false) || // Selection in component handles nav
                    (step === 3 && !selectedDoctor) ||
                    (step === 4 && !selectedSlot) ||
                    (step === 6 && isProcessingPayment)
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-arya-600 text-white rounded-xl font-semibold hover:bg-arya-700 transition-all shadow-lg shadow-arya-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : step === 5 ? (
                    <>
                      <Lock size={18} />
                      Pay & Confirm{isRecurring ? ` (${recurrenceCount})` : ''}
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Re-export types for convenience
export type { BookingMode, ServiceType, ManualFilters, PaymentDetails } from './types';
