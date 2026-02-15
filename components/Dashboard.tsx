import React, { useEffect, useState } from 'react';
import { 
  Activity, Calendar, FileText, Droplet, Thermometer, ArrowUpRight, 
  ShieldAlert, ShieldCheck, ChevronRight, Lock, QrCode, Scan, 
  Plus, Siren, HeartPulse, X, Save
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Appointment, LabResult, User } from '../types';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  user: User;
  appointments: Appointment[];
  labResults: LabResult[];
  onNavigate: (view: any) => void;
  onStartVerification: () => void;
}

const data = [
  { name: 'Mon', bp: 120, hr: 72 },
  { name: 'Tue', bp: 118, hr: 75 },
  { name: 'Wed', bp: 122, hr: 70 },
  { name: 'Thu', bp: 121, hr: 68 },
  { name: 'Fri', bp: 119, hr: 74 },
  { name: 'Sat', bp: 124, hr: 71 },
  { name: 'Sun', bp: 120, hr: 73 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, appointments, labResults, onNavigate, onStartVerification }) => {
  const [aiSummary, setAiSummary] = useState<string>("Analyzing...");
  const [showSOS, setShowSOS] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosActive, setSosActive] = useState(false);

  // Vitals State
  const [vitals, setVitals] = useState({
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      weight: 150
  });

  useEffect(() => {
    const fetchSummary = async () => {
        const summary = await geminiService.generateHealthSummary("BP avg 120/80, Heart Rate avg 72bpm, recent blood test normal.");
        setAiSummary(summary);
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    let interval: any;
    if (showSOS && sosCountdown > 0 && !sosActive) {
        interval = setInterval(() => setSosCountdown(c => c - 1), 1000);
    } else if (sosCountdown === 0 && !sosActive) {
        setSosActive(true);
    }
    return () => clearInterval(interval);
  }, [showSOS, sosCountdown, sosActive]);

  const handleCancelSOS = () => {
      setShowSOS(false);
      setSosCountdown(5);
      setSosActive(false);
  };

  const nextAppointment = appointments.find(a => a.status === 'upcoming');

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
      
      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-50 bg-red-900/90 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-bounce-slow">
                 {!sosActive ? (
                     <>
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 animate-pulse">
                            <span className="text-4xl font-bold">{sosCountdown}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Sending Emergency Alert</h2>
                        <p className="text-slate-500 mb-8">Notifying ambulance and emergency contacts with your live location.</p>
                        <button onClick={handleCancelSOS} className="w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors">Cancel SOS</button>
                     </>
                 ) : (
                     <>
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <ShieldCheck size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Help is on the way!</h2>
                        <p className="text-slate-500 mb-8">Ambulance dispatched. Contacts notified.</p>
                        <button onClick={handleCancelSOS} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl transition-colors">Close</button>
                     </>
                 )}
             </div>
        </div>
      )}

      {/* Vitals Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowVitalsModal(false)}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Log Vitals</h3>
                    <button onClick={() => setShowVitalsModal(false)} className="p-2 hover:bg-slate-50 rounded-full"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Systolic (mmHg)</label>
                            <input type="number" value={vitals.systolic} onChange={e => setVitals({...vitals, systolic: parseInt(e.target.value)})} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Diastolic (mmHg)</label>
                            <input type="number" value={vitals.diastolic} onChange={e => setVitals({...vitals, diastolic: parseInt(e.target.value)})} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" />
                         </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Heart Rate (bpm)</label>
                        <input type="number" value={vitals.heartRate} onChange={e => setVitals({...vitals, heartRate: parseInt(e.target.value)})} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Weight (lbs)</label>
                        <input type="number" value={vitals.weight} onChange={e => setVitals({...vitals, weight: parseInt(e.target.value)})} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" />
                    </div>
                    <button onClick={() => setShowVitalsModal(false)} className="w-full bg-arya-600 text-white py-3 rounded-xl font-bold hover:bg-arya-700 transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> Save Entry
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-arya-600 to-arya-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden shrink-0">
        <div className="z-10">
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.name}</h1>
               {user.isVerified ? (
                 <span className="bg-green-500/20 text-green-100 border border-green-400/30 text-[10px] font-bold px-2 py-1 rounded-full flex items-center backdrop-blur-sm whitespace-nowrap">
                   <ShieldCheck size={12} className="mr-1" /> Verified Patient
                 </span>
               ) : (
                 <span className="bg-amber-500/20 text-amber-100 border border-amber-400/30 text-[10px] font-bold px-2 py-1 rounded-full flex items-center backdrop-blur-sm whitespace-nowrap">
                   <ShieldAlert size={12} className="mr-1" /> Unverified
                 </span>
               )}
            </div>
            <p className="text-arya-100 opacity-90 max-w-xl text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">
                {aiSummary}
            </p>
            
            <div className="flex gap-3 mt-6">
                <button onClick={() => setShowSOS(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-lg shadow-red-900/20 transition-transform hover:scale-105">
                    <Siren size={16} className="mr-2 animate-pulse" /> SOS Emergency
                </button>
                <button onClick={() => setShowVitalsModal(true)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center backdrop-blur-sm transition-colors">
                    <HeartPulse size={16} className="mr-2" /> Log Vitals
                </button>
            </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <Activity size={300} />
        </div>
      </div>

      {/* VERIFIED: Arya Digital ID Card */}
      {user.isVerified && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden border border-slate-700 animate-fade-in group shrink-0">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 p-40 bg-arya-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-arya-500/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            
            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
            
            {/* Left Column: Photo & Basic Info */}
            <div className="flex gap-6 items-start">
                <div className="relative shrink-0">
                    <div className="w-20 h-24 md:w-32 md:h-40 bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-600 shadow-lg relative">
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-slate-800 shadow-sm">
                        <ShieldCheck size={16} />
                    </div>
                </div>
                
                <div className="space-y-1 py-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Scan size={14} className="text-arya-400" />
                        <span className="font-mono text-[10px] md:text-xs text-arya-400 tracking-widest uppercase">Universal Patient ID</span>
                    </div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white">{user.name}</h2>
                    <p className="font-mono text-slate-400 tracking-wider text-xs md:text-sm mb-4">{user.mrn}</p>
                    
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/30 tracking-wider flex items-center gap-1">
                            <ShieldCheck size={10} /> Identity Verified
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle Column: Medical Details (Mocked) */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-2 md:pl-8 flex-grow">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Date of Birth</p>
                    <p className="font-medium text-slate-200 font-mono text-xs md:text-sm">1985-01-15</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Blood Type</p>
                    <p className="font-bold text-white bg-red-500/20 text-red-300 inline-block px-2 rounded text-xs border border-red-500/30">O+</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Gender</p>
                    <p className="font-medium text-slate-200 text-xs md:text-sm">Female</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">Emergency</p>
                    <p className="font-medium text-slate-200 text-xs md:text-sm">Mark Jenkins</p>
                </div>
            </div>

            {/* Right Column: QR & Branding */}
            <div className="flex flex-row md:flex-col justify-between items-end min-w-[120px] gap-4 md:gap-0 border-t md:border-t-0 border-slate-700/50 pt-4 md:pt-0">
                <div className="text-left md:text-right hidden md:block">
                    <div className="flex items-center justify-start md:justify-end gap-2 text-arya-400 font-bold mb-1">
                        <Activity size={18} />
                        <span className="tracking-widest">ARYA</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Hospital System</p>
                </div>
                
                <div className="bg-white p-2 rounded-xl shadow-lg ml-auto md:ml-0">
                    <QrCode size={48} className="text-slate-900 md:w-16 md:h-16" />
                </div>
            </div>

            </div>
        </div>
      )}

      {/* UNVERIFIED: Verification Banner */}
      {!user.isVerified && (
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-fade-in shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
               <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-lg">Action Required: Verify Identity</h3>
              <p className="text-amber-700 text-sm">Access full dashboard features including medical records and smart scheduling by verifying your account.</p>
            </div>
          </div>
          <button 
             onClick={onStartVerification}
             className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md shadow-amber-200 flex items-center justify-center gap-2 whitespace-nowrap"
          >
             Start Verification <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0 ${!user.isVerified ? 'opacity-75' : ''}`}>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <div className="bg-red-50 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                <Activity className="text-red-500" size={20} />
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider">Heart Rate</span>
            <span className="text-xl md:text-2xl font-bold text-slate-800">72 <span className="text-xs font-normal text-slate-400">bpm</span></span>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                <Droplet className="text-blue-500" size={20} />
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider">Blood Pressure</span>
            <span className="text-xl md:text-2xl font-bold text-slate-800">120/80</span>
        </div>
        <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <div className="bg-amber-50 p-2 md:p-3 rounded-full mb-2 md:mb-3">
                <Thermometer className="text-amber-500" size={20} />
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider">Temp</span>
            <span className="text-xl md:text-2xl font-bold text-slate-800">98.6 <span className="text-xs font-normal text-slate-400">°F</span></span>
        </div>
         <div 
            onClick={() => user.isVerified ? onNavigate('appointments') : onStartVerification()}
            className="cursor-pointer bg-arya-50 p-4 md:p-5 rounded-2xl shadow-sm border border-arya-100 flex flex-col items-center justify-center hover:bg-arya-100 transition-colors group relative overflow-hidden"
        >
            {!user.isVerified && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                 <Lock size={24} className="text-slate-400" />
              </div>
            )}
            <div className="bg-white p-2 md:p-3 rounded-full mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="text-arya-600" size={20} />
            </div>
            <span className="text-arya-700 text-[10px] uppercase font-semibold tracking-wider">Appointments</span>
            <span className="text-lg md:text-xl font-bold text-arya-800">{appointments.length} Total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0 pb-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hidden md:block">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Health Trends</h2>
                <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-arya-200">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                </select>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Area type="monotone" dataKey="bp" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorBp)" />
                        <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Next Appointment Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full relative overflow-hidden">
             {!user.isVerified && (
               <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
                 <div className="bg-slate-100 p-3 rounded-full mb-3">
                   <Lock size={24} className="text-slate-400" />
                 </div>
                 <h3 className="font-bold text-slate-700">Detailed View Locked</h3>
                 <p className="text-xs text-slate-500 mt-1 mb-4">Verify to see appointment details</p>
                 <button onClick={onStartVerification} className="text-arya-600 text-xs font-bold hover:underline">Verify Now</button>
               </div>
             )}
            <h2 className="text-lg font-bold text-slate-800 mb-4">Next Visit</h2>
            {nextAppointment ? (
                <div className="flex flex-col flex-grow justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-arya-50 rounded-xl p-3 text-center min-w-[60px]">
                                <span className="block text-xs font-bold text-arya-500 uppercase tracking-wide">
                                    {new Date(nextAppointment.date).toLocaleString('default', { month: 'short' })}
                                </span>
                                <span className="block text-xl font-bold text-slate-800">
                                    {new Date(nextAppointment.date).getDate()}
                                </span>
                            </div>
                            <div className="flex-grow pl-4">
                                <h3 className="font-bold text-slate-800">{nextAppointment.doctorName}</h3>
                                <p className="text-sm text-slate-500">{nextAppointment.specialty}</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-6">
                             <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                <Calendar size={16} className="mr-2 text-arya-500" />
                                {nextAppointment.time}
                            </div>
                            <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                <ArrowUpRight size={16} className="mr-2 text-arya-500" />
                                {nextAppointment.location}
                            </div>
                        </div>
                    </div>
                    <button 
                        className="w-full py-3 bg-arya-600 hover:bg-arya-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-arya-200"
                        onClick={() => onNavigate('appointments')}
                    >
                        View Details
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-slate-400">
                    <Calendar size={48} className="mb-2 opacity-50" />
                    <p>No upcoming appointments</p>
                    <button 
                        className="mt-4 px-4 py-2 text-arya-600 font-semibold text-sm hover:bg-arya-50 rounded-lg transition-colors"
                        onClick={() => onNavigate('appointments')}
                    >
                        Schedule Now
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};