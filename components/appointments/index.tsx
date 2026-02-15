import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, Plus, Video, 
  Stethoscope, Sparkles, ChevronRight,
  CheckCircle, Zap, User, ArrowLeft, Search, X,
  Lock, List
} from 'lucide-react';
import { Appointment, Doctor, ServiceItem, SmartSlot, AIAnalysisResult } from '../../types';
import { geminiService } from '../../services/geminiService';
import { FAMILY_MEMBERS } from '../../data/mock';
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
import { ProgressBar } from './ProgressBar';
import { ServiceTypeSelection } from './ServiceTypeSelection';
import { ProviderSelection } from './ProviderSelection';
import { DateTimeSelection } from './DateTimeSelection';
import { ReviewDetails } from './ReviewDetails';
import { PaymentForm } from './PaymentForm';
import { BookingConfirmation } from './BookingConfirmation';

interface AppointmentsProps {
  appointments: Appointment[];
  onAddAppointment: (appt: Appointment) => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({ appointments, onAddAppointment }) => {
  // List view state
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'in-person'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Booking wizard state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode>('service-selection');
  const [step, setStep] = useState(1);
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('u1');

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

  // Video call state
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

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
    
    const newAppt: Appointment = {
      id: Date.now().toString(),
      doctorName: providerName || 'Arya Medical Service',
      specialty: spec || 'General',
      date: selectedSlot ? `${selectedSlot.dateIso}T10:00:00` : new Date().toISOString(),
      time: selectedSlot?.time || '10:00 AM',
      status: 'upcoming',
      location: isDoctor 
        ? (selectedSlot?.type === 'video' ? 'Virtual Video Link' : 'Building A, Room 302') 
        : (bookingMode === 'home-care' ? 'Home Visit' : 'Central Diagnostic Wing'),
      symptoms: symptomInput || (selectedService?.description || 'Routine checkup'),
      aiSummary: aiResult 
        ? `AI Triaged: ${aiResult.urgency} urgency. ${aiResult.reasoning}` 
        : 'Manually booked service.',
      matchScore: selectedSlot?.score || 100,
      visitType: isDoctor 
        ? selectedSlot?.type 
        : (bookingMode === 'home-care' ? 'home-visit' : 'in-person'),
      smartTags: selectedSlot?.tags,
      prepInstructions: aiResult?.prepTips || ['Please arrive 15 mins early'],
      patientName: FAMILY_MEMBERS.find(m => m.id === selectedFamilyMemberId)?.name || 'Self',
      patientId: selectedFamilyMemberId,
      category: bookingMode === 'manual' || bookingMode === 'ai' 
        ? 'consultation' 
        : (bookingMode as any)
    };

    onAddAppointment(newAppt);
    setIsProcessingPayment(false);
    setStep(6);
  };

  // --- LIST LOGIC ---

  const filteredAppointments = useMemo(() => {
    return appointments
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
  }, [appointments, activeTab, typeFilter, searchTerm]);

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

      {/* Main Content */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">My Appointments</h1>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                <List size={10} className="mr-1" /> {appointments.length} Total
              </span>
            </div>
            <p className="text-slate-500 text-sm">Manage scheduled visits for you and your family.</p>
          </div>
          <button 
            onClick={() => { setIsBooking(true); setStep(1); setBookingMode('service-selection'); }} 
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-arya-600 text-white px-6 py-3 rounded-xl hover:bg-arya-700 transition-all shadow-lg shadow-arya-200 font-semibold group"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <Plus size={18} />
            </div>
            <span>New Appointment</span>
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 pt-2 border-t border-slate-50">
          <div className="flex bg-slate-100 p-1 rounded-xl whitespace-nowrap overflow-x-auto no-scrollbar shrink-0">
            <button 
              onClick={() => setActiveTab('upcoming')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'upcoming' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history' 
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
        </div>
      </div>

      {/* Appointment List */}
      <div className="grid gap-6">
        {currentItems.length > 0 ? (
          currentItems.map(app => (
            <AppointmentCard 
              key={app.id} 
              appointment={app} 
              onJoinVideoCall={setActiveVideoCall}
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
                  onSelectServiceType={setSelectedServiceType}
                  onSelectBookingMode={(mode) => setBookingMode(mode as BookingMode)}
                  onSelectFamilyMember={setSelectedFamilyMemberId}
                />
              )}
              
              {step === 2 && (
                <ProviderSelection
                  bookingMode={bookingMode}
                  manualFilters={manualFilters}
                  selectedDoctor={selectedDoctor}
                  selectedService={selectedService}
                  onUpdateFilters={setManualFilters}
                  onSelectDoctor={setSelectedDoctor}
                  onSelectService={setSelectedService}
                />
              )}
              
              {step === 3 && (
                <DateTimeSelection
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  bookingMode={bookingMode}
                  onSelectDate={setSelectedDate}
                  onSelectSlot={setSelectedSlot}
                />
              )}
              
              {step === 4 && (
                <ReviewDetails
                  selectedServiceType={selectedServiceType}
                  selectedDoctor={selectedDoctor}
                  selectedService={selectedService}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedFamilyMemberId={selectedFamilyMemberId}
                  symptomInput={symptomInput}
                  isListening={isListening}
                  analyzing={analyzing}
                  aiResult={aiResult}
                  onSymptomChange={setSymptomInput}
                  onToggleListening={toggleListening}
                  onRunAiAnalysis={runAiAnalysis}
                />
              )}
              
              {step === 5 && (
                <PaymentForm
                  selectedDoctor={selectedDoctor}
                  selectedService={selectedService}
                  paymentDetails={paymentDetails}
                  isProcessing={isProcessingPayment}
                  onUpdatePaymentDetails={setPaymentDetails}
                />
              )}
              
              {step === 6 && (
                <BookingConfirmation
                  selectedServiceType={selectedServiceType}
                  selectedDoctor={selectedDoctor}
                  selectedService={selectedService}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  selectedFamilyMemberId={selectedFamilyMemberId}
                  onClose={resetBooking}
                />
              )}
            </div>
            
            {/* Footer Navigation */}
            {step < 6 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
                <button
                  onClick={() => step > 1 ? setStep(step - 1) : resetBooking()}
                  className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  <ArrowLeft size={18} />
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>
                
                <button
                  onClick={() => {
                    if (step === 5) {
                      processPaymentAndBook();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  disabled={
                    (step === 1 && !selectedServiceType) ||
                    (step === 2 && !selectedDoctor && !selectedService) ||
                    (step === 3 && !selectedSlot) ||
                    (step === 5 && isProcessingPayment)
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
                      Pay & Confirm
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
