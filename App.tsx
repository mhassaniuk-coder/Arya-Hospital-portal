import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, Calendar, FileText, Menu, X, Bell, Settings, LogOut, 
  ShieldCheck, ShieldAlert, Lock, History, Pill, Heart, CreditCard, Users, Activity
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AIChat } from './components/AIChat';
import { Appointments } from './components/Appointments';
import { MedicalRecords } from './components/MedicalRecords';
import { HistoryPage } from './components/HistoryPage';
import { NotificationsPage } from './components/NotificationsPage';
import { SettingsPage } from './components/SettingsPage';
import { PharmacyPage } from './components/PharmacyPage';
import { WellnessPage } from './components/WellnessPage';
import { InsurancePage } from './components/InsurancePage';
import { FamilyPage } from './components/FamilyPage';
import { SymptomChecker } from './components/SymptomChecker';
import { AuthPage } from './components/AuthPage';
import { VerificationModal } from './components/VerificationModal';
import { ViewState, User, Appointment, LabResult, Medication, Bill } from './types';

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Sarah Jenkins',
  avatarUrl: 'https://picsum.photos/200',
  mrn: 'MRN-882910',
  isVerified: false 
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    doctorName: 'Dr. Emily Chen',
    specialty: 'Cardiology',
    date: '2023-11-15T10:00:00',
    time: '10:00 AM',
    status: 'upcoming',
    location: 'Building A, Room 302',
    symptoms: 'Chest flutter',
    aiSummary: 'Routine follow-up for arrhythmia. Vitals stable.',
    matchScore: 98,
    travelTime: '25 mins',
    prepInstructions: ['Fast for 12 hours', 'Bring medication list'],
    smartTags: ['High Priority', 'Heart Health'],
    visitType: 'in-person'
  },
  {
    id: 'a2',
    doctorName: 'Dr. James Wilson',
    specialty: 'Dermatology',
    date: '2023-10-20T14:30:00',
    time: '2:30 PM',
    status: 'completed',
    location: 'Building B, Room 105',
    symptoms: 'Rash on arm',
    aiSummary: 'Diagnosed with contact dermatitis. Prescribed cream.',
    matchScore: 92,
    visitType: 'in-person'
  }
];

const MOCK_LAB_RESULTS: LabResult[] = [
  { id: 'l1', testName: 'Complete Blood Count', date: '2023-10-21', status: 'normal', value: 'Normal', unit: '' },
  { id: 'l2', testName: 'Lipid Panel', date: '2023-10-21', status: 'abnormal', value: '240', unit: 'mg/dL' },
];

const MOCK_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Lipitor', dosage: '20mg', frequency: 'Daily', refillsRemaining: 2, prescribedBy: 'Dr. Chen', status: 'active', nextRefill: '2023-11-01' },
  { id: 'm2', name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', refillsRemaining: 0, prescribedBy: 'Dr. Chen', status: 'completed' },
];

const MOCK_BILLS: Bill[] = [
  { id: 'b1', amount: 45.00, description: 'Lab Work Co-pay', date: '2023-10-21', status: 'unpaid' },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const addAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleVerificationComplete = () => {
    setCurrentUser(prev => ({ ...prev, isVerified: true }));
    setShowVerificationModal(false);
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const LockedView = ({ title, description }: { title: string, description: string }) => (
    <div className="h-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in p-8 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg w-full">
        <div className="relative">
            <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 rounded-full"></div>
            <div className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-full border border-amber-100 relative shadow-sm">
              <ShieldAlert size={64} className="text-amber-500" />
              <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-100">
                 <Lock size={20} className="text-slate-400" />
              </div>
            </div>
        </div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 leading-relaxed text-lg">{description}</p>
        </div>
        <button 
          onClick={() => setShowVerificationModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:translate-y-[-2px] flex items-center gap-3 text-lg"
        >
          <ShieldCheck size={24} />
          Start Verification
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!currentUser.isVerified && (currentView === 'records' || currentView === 'history' || currentView === 'pharmacy')) {
        return <LockedView title="Restricted Medical Data" description="Verify identity to access medical records and prescriptions." />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard user={currentUser} appointments={appointments} labResults={MOCK_LAB_RESULTS} onNavigate={(view: any) => setCurrentView(view)} onStartVerification={() => setShowVerificationModal(true)} />;
      case 'chat': return <AIChat user={currentUser} appointments={appointments} labResults={MOCK_LAB_RESULTS} medications={MOCK_MEDICATIONS} bills={MOCK_BILLS} onNavigate={(view: ViewState) => setCurrentView(view)} onAddAppointment={addAppointment} />;
      case 'appointments': return <Appointments appointments={appointments} onAddAppointment={addAppointment} />;
      case 'records': return <MedicalRecords labResults={MOCK_LAB_RESULTS} />;
      case 'history': return <HistoryPage appointments={appointments} labResults={MOCK_LAB_RESULTS} medications={MOCK_MEDICATIONS} />;
      case 'notifications': return <NotificationsPage onNavigate={(view) => setCurrentView(view)} />;
      case 'settings': return <SettingsPage user={currentUser} onSignOut={() => setIsAuthenticated(false)} />;
      case 'pharmacy': return <PharmacyPage medications={MOCK_MEDICATIONS} />;
      case 'wellness': return <WellnessPage />;
      case 'insurance': return <InsurancePage />;
      case 'family': return <FamilyPage />;
      case 'symptom_checker': return <SymptomChecker />;
      default: return <Dashboard user={currentUser} appointments={appointments} labResults={MOCK_LAB_RESULTS} onNavigate={(view: any) => setCurrentView(view)} onStartVerification={() => setShowVerificationModal(true)} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${currentView === view ? 'bg-arya-600 text-white shadow-lg shadow-arya-200 font-medium' : 'text-slate-500 hover:bg-arya-50 hover:text-arya-600'}`}
    >
      <div className="relative"><Icon size={18} />{!currentUser.isVerified && (view === 'records' || view === 'history' || view === 'pharmacy') && <div className="absolute -top-1 -right-2 bg-slate-100 rounded-full p-0.5 border border-white"><Lock size={8} className="text-slate-400" /></div>}</div>
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="h-[100dvh] w-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-800 overflow-hidden">
      {showVerificationModal && <VerificationModal onComplete={handleVerificationComplete} onClose={() => setShowVerificationModal(false)} />}

      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 h-full shrink-0 z-30 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="bg-arya-600 p-2 rounded-lg"><LayoutDashboard className="text-white" size={24} /></div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-arya-700 to-arya-500">Arya</span>
          </div>
          <nav className="space-y-1">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="chat" icon={MessageSquare} label="AI Assistant" />
            <NavItem view="symptom_checker" icon={Activity} label="Symptom Checker" />
            <NavItem view="appointments" icon={Calendar} label="Appointments" />
            <NavItem view="pharmacy" icon={Pill} label="Pharmacy" />
            <NavItem view="records" icon={FileText} label="Records" />
            <NavItem view="history" icon={History} label="History" />
            <div className="pt-4 pb-2 text-xs font-bold text-slate-400 uppercase px-4">Lifestyle</div>
            <NavItem view="wellness" icon={Heart} label="Wellness" />
            <NavItem view="family" icon={Users} label="Family" />
            <NavItem view="insurance" icon={CreditCard} label="Insurance" />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100">
            <div className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-slate-50 p-2 rounded-xl" onClick={() => setCurrentView('settings')}>
                <img src={currentUser.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.isVerified ? 'Verified' : 'Unverified'}</p>
                </div>
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <div className="md:hidden h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 shrink-0 z-20">
           <div className="flex items-center space-x-2">
               <div className="bg-arya-600 p-1.5 rounded-lg"><LayoutDashboard className="text-white" size={20} /></div>
               <span className="font-bold text-lg text-slate-800">Arya</span>
           </div>
           <div className="flex items-center gap-3">
               <button onClick={() => setCurrentView('notifications')} className="p-2 relative text-slate-600"><Bell size={24} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
           </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="absolute right-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-xl p-4 flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <nav className="space-y-2 flex-grow">
                      <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
                      <NavItem view="chat" icon={MessageSquare} label="AI Assistant" />
                      <NavItem view="symptom_checker" icon={Activity} label="Symptom Checker" />
                      <NavItem view="appointments" icon={Calendar} label="Appointments" />
                      <NavItem view="pharmacy" icon={Pill} label="Pharmacy" />
                      <NavItem view="records" icon={FileText} label="Records" />
                      <NavItem view="wellness" icon={Heart} label="Wellness" />
                      <NavItem view="family" icon={Users} label="Family" />
                      <NavItem view="insurance" icon={CreditCard} label="Insurance" />
                      <NavItem view="settings" icon={Settings} label="Settings" />
                  </nav>
                  <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-2 text-sm text-red-500 font-bold w-full p-2 hover:bg-red-50 rounded-lg"><LogOut size={16} /><span>Sign Out</span></button>
              </div>
          </div>
        )}

        <header className="hidden md:flex justify-between items-center px-8 py-6 bg-gray-50 shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 capitalize flex items-center gap-2">{currentView.replace(/_/g, ' ')}{!currentUser.isVerified && (currentView === 'records' || currentView === 'pharmacy') && <Lock size={20} className="text-slate-400" />}</h2>
                <p className="text-slate-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => setCurrentView('notifications')} className="p-2 relative rounded-full hover:bg-slate-100 transition-colors"><Bell size={20} className="text-slate-500"/><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
                <button onClick={() => setCurrentView('settings')} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><Settings size={20} className="text-slate-500"/></button>
            </div>
        </header>

        <main className="flex-1 overflow-hidden relative w-full">
           <div className="h-full w-full max-w-7xl mx-auto md:px-8">
              {renderContent()}
           </div>
        </main>

        <div className="md:hidden bg-white border-t border-slate-100 py-2 px-6 flex justify-between z-40 shrink-0 pb-[env(safe-area-inset-bottom,20px)]">
          <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'dashboard' ? 'text-arya-600' : 'text-slate-400'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-medium">Home</span></button>
          <button onClick={() => setCurrentView('appointments')} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'appointments' ? 'text-arya-600' : 'text-slate-400'}`}><Calendar size={24} /><span className="text-[10px] font-medium">Visits</span></button>
          <button onClick={() => setCurrentView('chat')} className={`flex flex-col items-center -mt-8`}><div className={`p-3 rounded-full shadow-xl border-4 border-slate-50 ${currentView === 'chat' ? 'bg-arya-600 text-white' : 'bg-white text-slate-400'}`}><MessageSquare size={24} /></div><span className="text-[10px] font-medium mt-1">AI</span></button>
          <button onClick={() => setCurrentView('pharmacy')} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'pharmacy' ? 'text-arya-600' : 'text-slate-400'}`}><Pill size={24} /><span className="text-[10px] font-medium">Meds</span></button>
          <button onClick={() => setCurrentView('wellness')} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'wellness' ? 'text-arya-600' : 'text-slate-400'}`}><Heart size={24} /><span className="text-[10px] font-medium">Well</span></button>
        </div>
      </div>
    </div>
  );
}

export default App;
