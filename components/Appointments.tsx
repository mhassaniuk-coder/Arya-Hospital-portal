import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Plus, Video, 
  Stethoscope, Mic, Sparkles, ChevronRight,
  CheckCircle, Zap, Brain, Car, Share2, FileText,
  User, ArrowLeft, Search, Filter, X, ShieldCheck,
  Thermometer, AlertTriangle, Battery, Wifi, Activity,
  Globe, Languages, Star, ArrowRight, LayoutGrid, List,
  ChevronLeft, History, CreditCard, Lock, Users, Baby, Heart,
  Home, TestTube, Scan, BriefcaseMedical, CheckSquare, MicOff, Camera, CameraOff, PhoneOff, Bell,
  AlertCircle, Check, Trash2, CalendarClock, LogIn
} from 'lucide-react';
import { Appointment, Doctor, SmartSlot, AIAnalysisResult, ServiceItem } from '../types';
import { geminiService } from '../services/geminiService';

// --- MOCK DATA --- (Keeping existing mock data)
const MOCK_DOCTORS: Doctor[] = [
  { 
    id: 1, name: 'Dr. Emily Chen', specialty: 'Cardiology', subSpecialty: 'Interventional',
    rating: 4.9, reviews: 124, image: 'https://picsum.photos/seed/doc1/200',
    languages: ['English', 'Mandarin'], gender: 'Female', experienceYears: 12,
    bio: 'Specializes in preventative cardiology and heart rhythm disorders. Harvard Medical School graduate.',
    nextAvailable: 'Tomorrow', tags: ['Top Rated', 'Harvard Alum']
  },
  { 
    id: 2, name: 'Dr. James Wilson', specialty: 'Dermatology', subSpecialty: 'Cosmetic',
    rating: 4.8, reviews: 89, image: 'https://picsum.photos/seed/doc2/200',
    languages: ['English', 'Spanish'], gender: 'Male', experienceYears: 8,
    bio: 'Expert in treating complex skin conditions and cosmetic procedures.',
    nextAvailable: 'Today', tags: ['Video Visits', 'Fast Response']
  },
  { 
    id: 3, name: 'Dr. Sarah Smith', specialty: 'General Practice', subSpecialty: 'Family Medicine',
    rating: 4.9, reviews: 210, image: 'https://picsum.photos/seed/doc3/200',
    languages: ['English'], gender: 'Female', experienceYears: 15,
    bio: 'Dedicated to comprehensive family care and long-term wellness planning.',
    nextAvailable: 'Wed, Oct 25', tags: ['Patient Choice', 'Pediatric Friendly']
  },
  { 
    id: 4, name: 'Dr. Michael Brown', specialty: 'Neurology', subSpecialty: 'Migraine',
    rating: 4.7, reviews: 56, image: 'https://picsum.photos/seed/doc4/200',
    languages: ['English', 'German'], gender: 'Male', experienceYears: 20,
    bio: 'Leading researcher in migraine management and neuropathic pain.',
    nextAvailable: 'Next Week', tags: ['Research Lead']
  },
  { 
    id: 5, name: 'Dr. Linda Johnson', specialty: 'Pediatrics', subSpecialty: 'General',
    rating: 4.9, reviews: 312, image: 'https://picsum.photos/seed/doc5/200',
    languages: ['English', 'French'], gender: 'Female', experienceYears: 18,
    bio: 'Compassionate care for infants, children, and adolescents.',
    nextAvailable: 'Tomorrow', tags: ['Pediatric Specialist', 'Vaccinations']
  },
  { 
    id: 6, name: 'Dr. Robert Chen', specialty: 'Orthopedics', subSpecialty: 'Sports Medicine',
    rating: 4.6, reviews: 88, image: 'https://picsum.photos/seed/doc6/200',
    languages: ['English'], gender: 'Male', experienceYears: 10,
    bio: 'Focus on sports injuries and arthroscopic surgery.',
    nextAvailable: 'Fri, Oct 27', tags: ['Sports Med']
  },
];

const MOCK_HOME_CARE: ServiceItem[] = [
    { id: 'hc1', name: 'General Nursing', type: 'home-care', description: 'Vitals check, medication administration, wound dressing.', price: 50, duration: '2 hours' },
    { id: 'hc2', name: 'Physiotherapy', type: 'home-care', description: 'Rehabilitation exercises, pain management, mobility support.', price: 75, duration: '1 hour' },
    { id: 'hc3', name: 'Elderly Care', type: 'home-care', description: 'Companionship, hygiene assistance, meal prep.', price: 40, duration: '4 hours' },
    { id: 'hc4', name: 'Post-Op Care', type: 'home-care', description: 'Specialized surgical recovery support.', price: 90, duration: '4 hours' },
];

const MOCK_LABS: ServiceItem[] = [
    { id: 'l1', name: 'Full Body Checkup', type: 'lab', description: 'CBC, Lipid, Liver, Kidney, Thyroid profiles.', price: 99, duration: '15 mins' },
    { id: 'l2', name: 'Thyroid Profile', type: 'lab', description: 'T3, T4, TSH levels.', price: 30, duration: '10 mins' },
    { id: 'l3', name: 'Vitamin Deficiency', type: 'lab', description: 'Vitamin D, B12, Calcium levels.', price: 45, duration: '10 mins' },
    { id: 'l4', name: 'Diabetes Screen', type: 'lab', description: 'HbA1c, Fasting Blood Sugar.', price: 25, duration: '5 mins' },
];

const MOCK_IMAGING: ServiceItem[] = [
    { id: 'i1', name: 'MRI Brain', type: 'imaging', description: 'Detailed imaging of brain structures.', price: 400, duration: '45 mins' },
    { id: 'i2', name: 'Chest X-Ray', type: 'imaging', description: 'Lung and heart imaging.', price: 50, duration: '15 mins' },
    { id: 'i3', name: 'Ultrasound Abdomen', type: 'imaging', description: 'Imaging of abdominal organs.', price: 120, duration: '30 mins' },
    { id: 'i4', name: 'CT Scan', type: 'imaging', description: 'Computed tomography for detailed views.', price: 250, duration: '20 mins' },
];

const FAMILY_MEMBERS = [
    { id: 'u1', name: 'Sarah Jenkins', relation: 'Self', avatar: 'https://picsum.photos/seed/u1/200' },
    { id: 'f1', name: 'Leo Jenkins', relation: 'Son', avatar: 'https://picsum.photos/seed/leo/200', isChild: true },
    { id: 'f2', name: 'Mia Jenkins', relation: 'Daughter', avatar: 'https://picsum.photos/seed/mia/200', isChild: true },
    { id: 'f3', name: 'Mark Jenkins', relation: 'Husband', avatar: 'https://picsum.photos/seed/mark/200' },
];

const GENERATE_SMART_SLOTS = (dateStr: string, type: string = 'in-person'): SmartSlot[] => [
  { id: 's1', time: '09:00 AM', date: dateStr, dateIso: '2023-10-24', score: 98, tags: ['Best Match', 'Least Wait'], type: type as any },
  { id: 's2', time: '10:30 AM', date: dateStr, dateIso: '2023-10-24', score: 85, tags: ['Quiet Hour'], type: type as any },
  { id: 's3', time: '02:00 PM', date: dateStr, dateIso: '2023-10-24', score: 92, tags: ['After Lunch'], type: type as any },
  { id: 's4', time: '04:15 PM', date: dateStr, dateIso: '2023-10-24', score: 78, tags: [], type: type as any },
];

interface AppointmentsProps {
  appointments: Appointment[];
  onAddAppointment: (appt: Appointment) => void;
}

type BookingMode = 'service-selection' | 'consultation-method' | 'ai' | 'manual' | 'home-care' | 'lab' | 'imaging';

export const Appointments: React.FC<AppointmentsProps> = ({ appointments, onAddAppointment }) => {
  // Existing State
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'in-person'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Wizard State
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMode, setBookingMode] = useState<BookingMode>('service-selection');
  const [step, setStep] = useState(1); 
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState('u1');
  
  // Payment State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', expiry: '', cvc: '', name: '' });

  // AI Flow State
  const [symptomInput, setSymptomInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  
  // Manual Flow State
  const [manualFilters, setManualFilters] = useState({ search: '', specialty: 'All', gender: 'All', language: 'All', videoOnly: false });
  
  // Selection State
  const [selectedServiceType, setSelectedServiceType] = useState<'consultation' | 'home-care' | 'lab' | 'imaging'>('consultation');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SmartSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Video Call State
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  // ... (Keep all existing helper functions logic: resetBooking, toggleListening, runAiAnalysis, processPaymentAndBook, getFilteredDoctors, renderProgressBar) ...
  const resetBooking = () => {
    setIsBooking(false);
    setTimeout(() => {
      setStep(1); setBookingMode('service-selection'); setSymptomInput(''); setAiResult(null); setSelectedDoctor(null); setSelectedService(null); setSelectedSlot(null); setPaymentDetails({ cardNumber: '', expiry: '', cvc: '', name: '' }); setIsProcessingPayment(false); setSelectedFamilyMemberId('u1');
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
    setStep(2);
  };

  const processPaymentAndBook = async () => {
      setIsProcessingPayment(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const isDoctor = bookingMode === 'ai' || bookingMode === 'manual';
      const providerName = isDoctor ? selectedDoctor?.name : selectedService?.name;
      const spec = isDoctor ? selectedDoctor?.specialty : (bookingMode === 'home-care' ? 'Home Care' : bookingMode === 'lab' ? 'Pathology Lab' : 'Radiology Center');
      const newAppt: Appointment = {
          id: Date.now().toString(),
          doctorName: providerName || 'Arya Medical Service',
          specialty: spec || 'General',
          date: selectedSlot ? `${selectedSlot.dateIso}T10:00:00` : new Date().toISOString(),
          time: selectedSlot?.time || '10:00 AM',
          status: 'upcoming',
          location: isDoctor ? (selectedSlot?.type === 'video' ? 'Virtual Video Link' : 'Building A, Room 302') : (bookingMode === 'home-care' ? 'Home Visit' : 'Central Diagnostic Wing'),
          symptoms: symptomInput || (selectedService?.description || 'Routine checkup'),
          aiSummary: aiResult ? `AI Triaged: ${aiResult.urgency} urgency. ${aiResult.reasoning}` : 'Manually booked service.',
          matchScore: selectedSlot?.score || 100,
          visitType: isDoctor ? selectedSlot?.type : (bookingMode === 'home-care' ? 'home-visit' : 'in-person'),
          smartTags: selectedSlot?.tags,
          prepInstructions: aiResult?.prepTips || ['Please arrive 15 mins early'],
          patientName: FAMILY_MEMBERS.find(m => m.id === selectedFamilyMemberId)?.name || 'Self',
          patientId: selectedFamilyMemberId,
          category: bookingMode === 'manual' || bookingMode === 'ai' ? 'consultation' : (bookingMode as any)
      };
      onAddAppointment(newAppt);
      setIsProcessingPayment(false);
      setStep(6);
  };

  const getFilteredDoctors = () => {
    return MOCK_DOCTORS.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(manualFilters.search.toLowerCase()) || doc.specialty.toLowerCase().includes(manualFilters.search.toLowerCase());
      const matchSpec = manualFilters.specialty === 'All' || doc.specialty === manualFilters.specialty;
      const matchGender = manualFilters.gender === 'All' || doc.gender === manualFilters.gender;
      const matchLang = manualFilters.language === 'All' || doc.languages.includes(manualFilters.language);
      const matchAi = bookingMode === 'ai' && aiResult ? doc.specialty.toLowerCase().includes(aiResult.specialty.split(' ')[0].toLowerCase()) : true;
      return matchSearch && matchSpec && matchGender && matchLang && matchAi;
    });
  };

  const renderProgressBar = () => {
    const steps = ['Service', 'Select', 'Time', 'Review', 'Payment', 'Done'];
    return (
      <div className="flex justify-between items-center px-4 md:px-12 relative w-full">
        <div className="absolute left-12 right-12 top-4 h-0.5 bg-slate-100 -z-10 rounded-full"></div>
        <div className={`absolute left-12 top-4 h-0.5 bg-arya-500 -z-10 rounded-full transition-all duration-500`} style={{width: `calc(${((step - 1) / 5) * 100}% - 48px)`}}></div>
        {steps.map((label, idx) => {
          const isCompleted = step > idx + 1;
          const isCurrent = step === idx + 1;
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${isCompleted ? 'bg-arya-500 text-white' : isCurrent ? 'bg-white border-2 border-arya-500 text-arya-600 shadow-md scale-110' : 'bg-slate-100 text-slate-300'}`}>
                {isCompleted ? <CheckCircle size={14} /> : idx + 1}
              </div>
              <span className={`hidden md:block text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-arya-600' : 'text-slate-300'}`}>{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // --- LIST LOGIC ---
  const filteredAppointments = appointments
    .filter(app => {
      const matchesTab = activeTab === 'upcoming' ? (app.status === 'upcoming') : (app.status === 'completed' || app.status === 'cancelled');
      const matchesType = typeFilter === 'all' || app.visitType === typeFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch = app.doctorName.toLowerCase().includes(term) || app.specialty.toLowerCase().includes(term) || (app.symptoms?.toLowerCase().includes(term));
      return matchesTab && matchesType && matchesSearch;
    })
    .sort((a, b) => activeTab === 'upcoming' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentItems = filteredAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in relative">
      
      {/* Video Call Overlay */}
      {activeVideoCall && (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
            <div className="flex-1 relative bg-slate-800">
                <div className="absolute inset-0 flex items-center justify-center text-white/50">
                    <div className="text-center">
                        <div className="w-32 h-32 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                             <User size={64} />
                        </div>
                        <p className="text-xl font-bold">{activeVideoCall.doctorName}</p>
                        <p>Connecting...</p>
                    </div>
                </div>
                {/* Self View */}
                <div className="absolute bottom-4 right-4 w-32 h-48 bg-black rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl">
                    {!cameraOff ? <div className="w-full h-full bg-slate-600 flex items-center justify-center"><User size={20} className="text-white"/></div> : <div className="w-full h-full bg-black flex items-center justify-center text-white text-xs">Camera Off</div>}
                </div>
            </div>
            <div className="h-24 bg-slate-900 flex items-center justify-center gap-6">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>{isMuted ? <MicOff /> : <Mic />}</button>
                <button onClick={() => setActiveVideoCall(null)} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 px-8 flex items-center gap-2 font-bold"><PhoneOff /> End</button>
                <button onClick={() => setCameraOff(!cameraOff)} className={`p-4 rounded-full ${cameraOff ? 'bg-red-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>{cameraOff ? <CameraOff /> : <Camera />}</button>
            </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        {/* Header content ... */}
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
           <button onClick={() => { setIsBooking(true); setStep(1); setBookingMode('service-selection'); }} className="w-full md:w-auto flex items-center justify-center space-x-2 bg-arya-600 text-white px-6 py-3 rounded-xl hover:bg-arya-700 transition-all shadow-lg shadow-arya-200 font-semibold group">
             <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform"><Plus size={18} /></div>
             <span>New Appointment</span>
           </button>
        </div>
        
        {/* Filters ... (Keeping existing filters UI) */}
        <div className="flex flex-col md:flex-row gap-4 pt-2 border-t border-slate-50">
           <div className="flex bg-slate-100 p-1 rounded-xl whitespace-nowrap overflow-x-auto no-scrollbar shrink-0">
               <button onClick={() => setActiveTab('upcoming')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Upcoming</button>
               <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>History</button>
           </div>
           <div className="flex-grow flex flex-col md:flex-row gap-2 w-full">
               <div className="relative flex-grow">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input type="text" placeholder="Search doctor, specialty, or patient..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none transition-all" />
               </div>
               <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none text-slate-600 w-full md:w-auto" title="Filter by appointment type">
                  <option value="all">All Types</option>
                  <option value="in-person">In-Person</option>
                  <option value="video">Video Visit</option>
                  <option value="home-visit">Home Visit</option>
               </select>
           </div>
        </div>
      </div>

      <div className="grid gap-6">
          {currentItems.length > 0 ? (
            currentItems.map(app => (
                <div key={app.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                   <div className="p-6 flex flex-col md:flex-row gap-6 relative">
                      <div className={`absolute left-0 top-0 bottom-0 md:h-full w-full h-1.5 md:w-1.5 ${app.status === 'upcoming' ? 'bg-arya-500' : app.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <div className="mt-2 md:mt-0 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex md:flex-col flex-row items-center justify-between md:justify-center md:min-w-[100px] text-center gap-4 md:gap-0">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(app.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-3xl font-bold text-slate-800 my-1">{new Date(app.date).getDate()}</span>
                          <span className="text-xs text-slate-500">{new Date(app.date).toLocaleString('default', { weekday: 'short' })}</span>
                      </div>
                      <div className="flex-grow space-y-3">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                  <h3 className="font-bold text-slate-800 text-xl">{app.doctorName}</h3>
                                  <div className="flex flex-wrap gap-2 text-arya-600 font-medium text-sm items-center">
                                     <span>{app.specialty}</span>
                                     <span>•</span>
                                     <span className="capitalize">{app.category === 'home-care' ? 'Home Care' : app.category === 'lab' ? 'Lab Test' : app.category === 'imaging' ? 'Imaging' : 'Consultation'}</span>
                                     {app.patientName && (
                                       <><span>•</span><span className="text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100"><User size={12} /> {app.patientName}</span></>
                                     )}
                                  </div>
                              </div>
                              {app.status === 'upcoming' && app.matchScore && <div className="flex gap-2"><span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center border border-green-100"><Zap size={12} className="mr-1" /> {app.matchScore}% Match</span></div>}
                              {app.status === 'completed' && <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-bold">Completed</span>}
                              {app.status === 'cancelled' && <span className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full font-bold">Cancelled</span>}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock size={16} className="mr-2 text-arya-500" />{app.time}</div>
                              <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{app.visitType === 'video' ? <Video size={16} className="mr-2 text-arya-500" /> : app.visitType === 'home-visit' ? <Home size={16} className="mr-2 text-arya-500" /> : <MapPin size={16} className="mr-2 text-arya-500" />}{app.location}</div>
                              {app.smartTags && app.smartTags.map(tag => <div key={tag} className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold uppercase tracking-wider"><Sparkles size={12} className="mr-1" /> {tag}</div>)}
                          </div>
                      </div>
                   </div>
                   {(app.aiSummary || app.prepInstructions) && (
                       <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                          <div className="flex items-start gap-3 max-w-xl">
                              <div className="bg-white p-2 rounded-full shadow-sm text-arya-600 mt-1 min-w-[32px]"><Brain size={16} /></div>
                              <div>
                                  <p className="text-xs font-bold text-slate-700 uppercase mb-1">AI Details</p>
                                  <p className="text-sm text-slate-500 leading-relaxed">{app.aiSummary || app.prepInstructions?.join('. ')}</p>
                              </div>
                          </div>
                          {app.status === 'upcoming' && (
                              <div className="flex items-center gap-2 w-full md:w-auto">
                                  {app.visitType === 'video' && <button onClick={() => setActiveVideoCall(app)} className="flex-1 md:flex-none py-2 px-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"><Video size={16}/> Join Call</button>}
                                  <button className="flex-1 md:flex-none py-2 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">Reschedule</button>
                                  <button className="flex-1 md:flex-none py-2 px-4 bg-arya-600 text-white rounded-xl text-sm font-medium hover:bg-arya-700 transition-colors shadow-sm">Check In</button>
                              </div>
                          )}
                       </div>
                   )}
                </div>
              ))
          ) : (
             <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="text-slate-300" size={40} /></div>
                 <h3 className="text-lg font-bold text-slate-800">No appointments found</h3>
                 <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your filters or search terms.</p>
             </div>
          )}
      </div>

      {isBooking && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-white md:bg-slate-900/60 md:backdrop-blur-md md:p-4 animate-fade-in overflow-hidden">
             <div className="w-full h-[100dvh] md:h-[90vh] md:max-w-6xl md:rounded-[2rem] bg-white shadow-2xl overflow-hidden flex flex-col relative">
                {/* Header */}
                <div className="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 flex justify-between items-center bg-white z-20 shrink-0">
                    <div className="flex items-center gap-3">
                        {step > 1 && step < 6 && (
                            <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title="Go back">
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
                    <button onClick={resetBooking} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors" title="Close booking wizard">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Progress Bar */}
                {step < 6 && (
                    <div className="px-4 py-4 md:px-6 md:py-6 bg-slate-50/50 border-b border-slate-100">
                        {renderProgressBar()}
                    </div>
                )}
                
                {/* Content Area */}
                <div className="flex-grow overflow-y-auto overflow-x-hidden">
                    {/* STEP 1: Service Type Selection */}
                    {step === 1 && (
                        <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                            {/* Family Member Selection */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    <Users size={16} className="inline mr-2" />
                                    Booking for
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {FAMILY_MEMBERS.map(member => (
                                        <button
                                            key={member.id}
                                            onClick={() => setSelectedFamilyMemberId(member.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                                                selectedFamilyMemberId === member.id
                                                    ? 'border-arya-500 bg-arya-50 text-arya-700'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                                            <span className="font-medium text-sm">{member.name}</span>
                                            <span className="text-xs text-slate-400">({member.relation})</span>
                                            {member.isChild && <Baby size={12} className="text-pink-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Service Type Cards */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-4">Select Service Type</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Consultation */}
                                    <button
                                        onClick={() => { setSelectedServiceType('consultation'); setBookingMode('manual'); }}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                                            selectedServiceType === 'consultation'
                                                ? 'border-arya-500 bg-arya-50 shadow-lg shadow-arya-100'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                                            selectedServiceType === 'consultation' ? 'bg-arya-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <Stethoscope size={28} />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Consultation</h4>
                                        <p className="text-sm text-slate-500">Video or in-person visit with a doctor</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">From $50</span>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Video Available</span>
                                        </div>
                                        {selectedServiceType === 'consultation' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center">
                                                <CheckCircle size={16} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Home Care */}
                                    <button
                                        onClick={() => { setSelectedServiceType('home-care'); setBookingMode('home-care'); }}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                                            selectedServiceType === 'home-care'
                                                ? 'border-arya-500 bg-arya-50 shadow-lg shadow-arya-100'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                                            selectedServiceType === 'home-care' ? 'bg-arya-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <Home size={28} />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Home Care</h4>
                                        <p className="text-sm text-slate-500">Professional healthcare at your doorstep</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">From $40</span>
                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">At Home</span>
                                        </div>
                                        {selectedServiceType === 'home-care' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center">
                                                <CheckCircle size={16} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Lab Tests */}
                                    <button
                                        onClick={() => { setSelectedServiceType('lab'); setBookingMode('lab'); }}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                                            selectedServiceType === 'lab'
                                                ? 'border-arya-500 bg-arya-50 shadow-lg shadow-arya-100'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                                            selectedServiceType === 'lab' ? 'bg-arya-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <TestTube size={28} />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Lab Tests</h4>
                                        <p className="text-sm text-slate-500">Blood work, diagnostics, and screenings</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">From $25</span>
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Fast Results</span>
                                        </div>
                                        {selectedServiceType === 'lab' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center">
                                                <CheckCircle size={16} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Imaging */}
                                    <button
                                        onClick={() => { setSelectedServiceType('imaging'); setBookingMode('imaging'); }}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${
                                            selectedServiceType === 'imaging'
                                                ? 'border-arya-500 bg-arya-50 shadow-lg shadow-arya-100'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                                            selectedServiceType === 'imaging' ? 'bg-arya-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <Scan size={28} />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">Imaging</h4>
                                        <p className="text-sm text-slate-500">X-rays, MRI, CT scans, and ultrasounds</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">From $50</span>
                                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">Advanced</span>
                                        </div>
                                        {selectedServiceType === 'imaging' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center">
                                                <CheckCircle size={16} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* STEP 2: Provider/Service Selection */}
                    {step === 2 && (
                        <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                            {/* Search and Filters for Consultation */}
                            {(bookingMode === 'manual' || bookingMode === 'ai') && (
                                <>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="relative flex-grow">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search doctors by name or specialty..."
                                                value={manualFilters.search}
                                                onChange={(e) => setManualFilters({...manualFilters, search: e.target.value})}
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                                            />
                                        </div>
                                        <select
                                            value={manualFilters.specialty}
                                            onChange={(e) => setManualFilters({...manualFilters, specialty: e.target.value})}
                                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none text-slate-600"
                                            title="Filter by specialty"
                                        >
                                            <option value="All">All Specialties</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="General Practice">General Practice</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                        </select>
                                    </div>
                                    
                                    {/* Doctor Cards */}
                                    <div className="space-y-4">
                                        {getFilteredDoctors().length > 0 ? (
                                            getFilteredDoctors().map(doctor => (
                                                <button
                                                    key={doctor.id}
                                                    onClick={() => setSelectedDoctor(doctor)}
                                                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                                        selectedDoctor?.id === doctor.id
                                                            ? 'border-arya-500 bg-arya-50 shadow-lg'
                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                                    }`}
                                                >
                                                    <div className="flex gap-4">
                                                        <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover" />
                                                        <div className="flex-grow">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h4 className="font-bold text-slate-800">{doctor.name}</h4>
                                                                    <p className="text-sm text-arya-600 font-medium">{doctor.specialty} • {doctor.subSpecialty}</p>
                                                                </div>
                                                                {selectedDoctor?.id === doctor.id && (
                                                                    <div className="w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center">
                                                                        <CheckCircle size={14} className="text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                                                <div className="flex items-center gap-1 text-sm">
                                                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                                    <span className="font-semibold text-slate-700">{doctor.rating}</span>
                                                                    <span className="text-slate-400">({doctor.reviews})</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                                    <Clock size={14} />
                                                                    <span>{doctor.nextAvailable}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                                                    <Languages size={14} />
                                                                    <span>{doctor.languages.join(', ')}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {doctor.tags.map(tag => (
                                                                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tag}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-500">
                                                <Search size={40} className="mx-auto mb-3 text-slate-300" />
                                                <p>No doctors found matching your criteria</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                            
                            {/* Home Care Services */}
                            {bookingMode === 'home-care' && (
                                <div className="space-y-4">
                                    {MOCK_HOME_CARE.map(service => (
                                        <button
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                                selectedService?.id === service.id
                                                    ? 'border-arya-500 bg-arya-50 shadow-lg'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{service.name}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-sm text-slate-500"><Clock size={14} className="inline mr-1" />{service.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-arya-600">${service.price}</span>
                                                    {selectedService?.id === service.id && (
                                                        <div className="mt-2 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center ml-auto">
                                                            <CheckCircle size={14} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {/* Lab Tests */}
                            {bookingMode === 'lab' && (
                                <div className="space-y-4">
                                    {MOCK_LABS.map(service => (
                                        <button
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                                selectedService?.id === service.id
                                                    ? 'border-arya-500 bg-arya-50 shadow-lg'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{service.name}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-sm text-slate-500"><Clock size={14} className="inline mr-1" />{service.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-arya-600">${service.price}</span>
                                                    {selectedService?.id === service.id && (
                                                        <div className="mt-2 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center ml-auto">
                                                            <CheckCircle size={14} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {/* Imaging Services */}
                            {bookingMode === 'imaging' && (
                                <div className="space-y-4">
                                    {MOCK_IMAGING.map(service => (
                                        <button
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                                                selectedService?.id === service.id
                                                    ? 'border-arya-500 bg-arya-50 shadow-lg'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{service.name}</h4>
                                                    <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-sm text-slate-500"><Clock size={14} className="inline mr-1" />{service.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-arya-600">${service.price}</span>
                                                    {selectedService?.id === service.id && (
                                                        <div className="mt-2 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center ml-auto">
                                                            <CheckCircle size={14} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* STEP 3: Date/Time Selection */}
                    {step === 3 && (
                        <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                            {/* Date Selection */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <Calendar size={16} />
                                    Select Date
                                </h3>
                                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                                    {Array.from({length: 14}, (_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + i);
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isSelected = selectedDate === dateStr;
                                        const isToday = i === 0;
                                        
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDate(dateStr)}
                                                className={`p-3 rounded-xl border-2 transition-all text-center ${
                                                    isSelected
                                                        ? 'border-arya-500 bg-arya-50 shadow-md'
                                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                            >
                                                <span className="block text-xs font-medium text-slate-400 uppercase">
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className={`block text-lg font-bold ${isSelected ? 'text-arya-600' : 'text-slate-700'}`}>
                                                    {date.getDate()}
                                                </span>
                                                {isToday && (
                                                    <span className="block text-[10px] text-arya-500 font-semibold">TODAY</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Time Slot Selection */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <Clock size={16} />
                                    Select Time Slot
                                </h3>
                                {(() => {
                                    const slots = GENERATE_SMART_SLOTS(selectedDate, bookingMode === 'ai' || bookingMode === 'manual' ? 'in-person' : 'in-person');
                                    const morningSlots = slots.filter(s => ['09:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'].includes(s.time));
                                    const afternoonSlots = slots.filter(s => ['12:00 PM', '01:00 PM', '02:00 PM', '02:30 PM'].includes(s.time));
                                    const eveningSlots = slots.filter(s => ['04:00 PM', '04:15 PM', '05:00 PM', '06:00 PM'].includes(s.time));
                                    
                                    const renderSlotGroup = (title: string, groupSlots: SmartSlot[], icon: React.ReactNode) => (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                {icon}
                                                <span className="text-sm font-medium text-slate-500">{title}</span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {groupSlots.map(slot => (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`p-3 rounded-xl border-2 transition-all text-center relative ${
                                                            selectedSlot?.id === slot.id
                                                                ? 'border-arya-500 bg-arya-50 shadow-md'
                                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <span className={`font-semibold ${selectedSlot?.id === slot.id ? 'text-arya-600' : 'text-slate-700'}`}>
                                                            {slot.time}
                                                        </span>
                                                        {slot.score && slot.score > 90 && (
                                                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                                Best
                                                            </span>
                                                        )}
                                                        {slot.tags.length > 0 && (
                                                            <span className="block text-[10px] text-slate-400 mt-1">{slot.tags[0]}</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                    
                                    return (
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            {renderSlotGroup('Morning', [...morningSlots, ...slots.filter(s => s.time === '09:00 AM' || s.time === '10:30 AM')], <span className="text-yellow-500">🌅</span>)}
                                            {renderSlotGroup('Afternoon', [...afternoonSlots, ...slots.filter(s => s.time === '02:00 PM')], <span className="text-orange-500">☀️</span>)}
                                            {renderSlotGroup('Evening', [...eveningSlots, ...slots.filter(s => s.time === '04:15 PM')], <span className="text-purple-500">🌙</span>)}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                    
                    {/* STEP 4: Review & Details */}
                    {step === 4 && (
                        <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                            {/* Booking Summary */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText size={18} />
                                    Booking Summary
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <span className="text-xs text-slate-400 uppercase font-semibold">Service Type</span>
                                        <p className="font-semibold text-slate-700 capitalize mt-1">
                                            {selectedServiceType === 'consultation' ? 'Doctor Consultation' : 
                                             selectedServiceType === 'home-care' ? 'Home Care Service' :
                                             selectedServiceType === 'lab' ? 'Lab Test' : 'Imaging'}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <span className="text-xs text-slate-400 uppercase font-semibold">Provider</span>
                                        <p className="font-semibold text-slate-700 mt-1">
                                            {selectedDoctor?.name || selectedService?.name || 'Not selected'}
                                        </p>
                                        {selectedDoctor && (
                                            <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
                                        )}
                                    </div>
                                    
                                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <span className="text-xs text-slate-400 uppercase font-semibold">Date</span>
                                        <p className="font-semibold text-slate-700 mt-1">
                                            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <span className="text-xs text-slate-400 uppercase font-semibold">Time</span>
                                        <p className="font-semibold text-slate-700 mt-1">{selectedSlot?.time || 'Not selected'}</p>
                                    </div>
                                    
                                    <div className="bg-white rounded-xl p-4 border border-slate-100 md:col-span-2">
                                        <span className="text-xs text-slate-400 uppercase font-semibold">Patient</span>
                                        <p className="font-semibold text-slate-700 mt-1">
                                            {FAMILY_MEMBERS.find(m => m.id === selectedFamilyMemberId)?.name || 'Self'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Symptoms/Reason Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Reason for Visit / Symptoms
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={symptomInput}
                                        onChange={(e) => setSymptomInput(e.target.value)}
                                        placeholder="Describe your symptoms or reason for this appointment..."
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none resize-none h-32"
                                    />
                                    <button
                                        onClick={toggleListening}
                                        className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${
                                            isListening 
                                                ? 'bg-red-500 text-white animate-pulse' 
                                                : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                        }`}
                                        title={isListening ? 'Stop listening' : 'Voice input'}
                                    >
                                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                                    </button>
                                </div>
                                
                                {/* AI Analysis Button */}
                                <button
                                    onClick={runAiAnalysis}
                                    disabled={!symptomInput.trim() || analyzing}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {analyzing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            AI Symptom Analysis
                                        </>
                                    )}
                                </button>
                                
                                {/* AI Result */}
                                {aiResult && (
                                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Brain size={18} className="text-purple-600" />
                                            <span className="font-semibold text-purple-700">AI Analysis Result</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="font-medium text-slate-600">Urgency:</span> <span className={`font-semibold ${
                                                aiResult.urgency === 'high' ? 'text-red-600' : 
                                                aiResult.urgency === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                            }`}>{aiResult.urgency.toUpperCase()}</span></p>
                                            <p><span className="font-medium text-slate-600">Suggested Specialty:</span> {aiResult.specialty}</p>
                                            <p><span className="font-medium text-slate-600">Reasoning:</span> {aiResult.reasoning}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* STEP 5: Payment */}
                    {step === 5 && (
                        <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                            {/* Price Summary */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <CreditCard size={18} />
                                    Price Summary
                                </h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Service Fee</span>
                                        <span className="font-semibold text-slate-700">
                                            ${selectedDoctor ? 75 : selectedService?.price || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Platform Fee</span>
                                        <span className="font-semibold text-slate-700">$5.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>New User Discount</span>
                                        <span className="font-semibold">-$10.00</span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-3 flex justify-between">
                                        <span className="font-semibold text-slate-700">Total</span>
                                        <span className="font-bold text-xl text-arya-600">
                                            ${Math.max(0, (selectedDoctor ? 75 : selectedService?.price || 0) + 5 - 10)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Payment Method Selection */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-700">Payment Method</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <button className="p-4 rounded-xl border-2 border-arya-500 bg-arya-50 text-left">
                                        <CreditCard size={24} className="text-arya-600 mb-2" />
                                        <span className="font-semibold text-slate-700">Credit/Debit Card</span>
                                    </button>
                                    <button className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 text-left">
                                        <ShieldCheck size={24} className="text-slate-400 mb-2" />
                                        <span className="font-semibold text-slate-700">Insurance</span>
                                    </button>
                                    <button className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 text-left">
                                        <Home size={24} className="text-slate-400 mb-2" />
                                        <span className="font-semibold text-slate-700">Cash on Visit</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Card Details Form */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <Lock size={16} className="text-green-500" />
                                    Card Details
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={paymentDetails.cardNumber}
                                            onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-slate-600 mb-1">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={paymentDetails.expiry}
                                                onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-600 mb-1">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={paymentDetails.cvc}
                                                onChange={(e) => setPaymentDetails({...paymentDetails, cvc: e.target.value})}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm text-slate-600 mb-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={paymentDetails.name}
                                            onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* STEP 6: Confirmation */}
                    {step === 6 && (
                        <div className="p-6 md:p-8 animate-fade-in">
                            <div className="text-center max-w-md mx-auto">
                                {/* Success Icon */}
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={48} className="text-green-500" />
                                </div>
                                
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
                                <p className="text-slate-500 mb-6">Your appointment has been successfully scheduled.</p>
                                
                                {/* Appointment Details Card */}
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-arya-100 rounded-xl flex items-center justify-center">
                                            {selectedServiceType === 'consultation' ? <Stethoscope size={24} className="text-arya-600" /> :
                                             selectedServiceType === 'home-care' ? <Home size={24} className="text-arya-600" /> :
                                             selectedServiceType === 'lab' ? <TestTube size={24} className="text-arya-600" /> :
                                             <Scan size={24} className="text-arya-600" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{selectedDoctor?.name || selectedService?.name}</p>
                                            <p className="text-sm text-slate-500">{selectedDoctor?.specialty || selectedService?.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Date</p>
                                            <p className="font-semibold text-slate-700">
                                                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Time</p>
                                            <p className="font-semibold text-slate-700">{selectedSlot?.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Patient</p>
                                            <p className="font-semibold text-slate-700">
                                                {FAMILY_MEMBERS.find(m => m.id === selectedFamilyMemberId)?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold">Confirmation #</p>
                                            <p className="font-semibold text-slate-700">ARY-{Date.now().toString().slice(-6)}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3">
                                    <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                                        <Calendar size={18} />
                                        Add to Calendar
                                    </button>
                                    <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                                        <Bell size={18} />
                                        Set Reminder
                                    </button>
                                    <button
                                        onClick={resetBooking}
                                        className="w-full py-3 px-4 bg-arya-600 text-white rounded-xl font-semibold hover:bg-arya-700 transition-colors shadow-lg shadow-arya-200"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                    Next
                                    <ArrowRight size={18} />
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
