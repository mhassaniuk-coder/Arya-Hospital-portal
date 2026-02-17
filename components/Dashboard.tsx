import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Calendar, Droplet, Thermometer, ArrowUpRight,
  ShieldAlert, ShieldCheck, ChevronRight, Lock, QrCode, Scan,
  Siren, HeartPulse, X, Save
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Appointment, LabResult, User, InsuranceCard } from '../types';
import { geminiService } from '../services/geminiService';
import { fadeInUp, staggerContainer, scaleIn } from '../utils/animations';
import { ParticlesBackground, LoadingDots, AnimatedButton } from './ui';
import {
  HealthInsightsCard, OutbreakAlertCard, WellnessScoreCard,
  RiskAssessmentCard, SmartActionsCard,
  HealthInsight, OutbreakAlert, RiskMetric, SmartAction
} from './dashboard/DashboardWidgets';
import { VerificationPanel } from './dashboard/VerificationPanel';

interface DashboardProps {
  user: User;
  appointments: Appointment[];
  labResults: LabResult[];
  insuranceCards?: InsuranceCard[];
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

export const Dashboard: React.FC<DashboardProps> = ({ user, appointments, labResults, insuranceCards = [], onNavigate, onStartVerification }) => {
  const [showSOS, setShowSOS] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosActive, setSosActive] = useState(false);

  // AI Data State
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [alerts, setAlerts] = useState<OutbreakAlert[]>([]);
  const [risks, setRisks] = useState<RiskMetric[]>([]);
  const [smartActions, setSmartActions] = useState<SmartAction[]>([]);
  const [wellnessScore, setWellnessScore] = useState(85);

  // Vitals State
  const [vitals, setVitals] = useState({
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    weight: 150
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoadingInsights(true);
      try {
        // 1. Generate Health Insights
        const metrics = "BP avg 120/80, Heart Rate avg 72bpm, recent blood test normal.";
        // Simulating rich insights generation from Gemini
        // const summary = await geminiService.generateHealthSummary(metrics); 
        // In a real app we'd parse this summary into structured insights. 
        // For now, we'll mock the structured part based on the summary logic.
        setTimeout(() => {
          setInsights([
            { type: 'positive', title: 'Vitals Stable', description: 'Your blood pressure and heart rate are within optimal ranges for your age group.', metric: '120/80' },
            { type: 'neutral', title: 'Vitamin D Status', description: 'Your last test showed lower Vitamin D. Considered getting more sunlight or supplements.', metric: 'Low' }
          ]);
          setLoadingInsights(false);
        }, 1000);

        // 2. Outbreak Alerts
        const localAlerts = await geminiService.generateOutbreakAlerts("New York, USA");
        setAlerts(localAlerts);

        // 3. Risk Assessment
        const riskData = await geminiService.assessReadmissionRisk(vitals, []);
        setRisks(riskData);

        // 4. Smart Actions
        const actions = await geminiService.getDashboardSmartActions();
        setSmartActions(actions);

        // 5. Calculate Wellness Score (Mock logic for demo)
        setWellnessScore(Math.min(100, Math.max(0, 85 + (user.isVerified ? 5 : 0))));

      } catch (e) {
        console.error("Dashboard data load error", e);
        setLoadingInsights(false);
      }
    };
    loadDashboardData();
  }, [user.isVerified]);

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
    <motion.div
      className="h-full w-full overflow-y-auto overflow-x-hidden p-4 md:p-0 space-y-6 pb-24 md:pb-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* SOS Modal */}
      <AnimatePresence>
        {showSOS && (
          <motion.div
            className="fixed inset-0 z-50 bg-red-900/90 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {!sosActive ? (
                <>
                  <motion.div
                    className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <span className="text-4xl font-bold">{sosCountdown}</span>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Sending Emergency Alert</h2>
                  <p className="text-slate-500 mb-8">Notifying ambulance and emergency contacts with your live location.</p>
                  <button onClick={handleCancelSOS} className="w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors">Cancel SOS</button>
                </>
              ) : (
                <>
                  <motion.div
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <ShieldCheck size={48} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Help is on the way!</h2>
                  <p className="text-slate-500 mb-8">Ambulance dispatched. Contacts notified.</p>
                  <button onClick={handleCancelSOS} className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl transition-colors">Close</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vitals Modal */}
      <AnimatePresence>
        {showVitalsModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowVitalsModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl"
              onClick={e => e.stopPropagation()}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Log Vitals</h3>
                <button onClick={() => setShowVitalsModal(false)} className="p-2 hover:bg-slate-50 rounded-full" title="Close">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Systolic (mmHg)</label>
                    <input type="number" value={vitals.systolic} onChange={e => setVitals({ ...vitals, systolic: parseInt(e.target.value) })} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" placeholder="120" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Diastolic (mmHg)</label>
                    <input type="number" value={vitals.diastolic} onChange={e => setVitals({ ...vitals, diastolic: parseInt(e.target.value) })} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" placeholder="80" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Heart Rate (bpm)</label>
                  <input type="number" value={vitals.heartRate} onChange={e => setVitals({ ...vitals, heartRate: parseInt(e.target.value) })} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" placeholder="72" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Weight (lbs)</label>
                  <input type="number" value={vitals.weight} onChange={e => setVitals({ ...vitals, weight: parseInt(e.target.value) })} className="w-full mt-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-arya-200" placeholder="150" />
                </div>
                <button onClick={() => setShowVitalsModal(false)} className="w-full bg-arya-600 text-white py-3 rounded-xl font-bold hover:bg-arya-700 transition-colors flex items-center justify-center gap-2">
                  <Save size={18} /> Save Entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-arya-600 to-arya-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden shrink-0"
        variants={fadeInUp}
      >
        <ParticlesBackground className="opacity-30" />

        <div className="z-10 w-full md:w-2/3">
          <div className="flex items-center gap-3 mb-2">
            <motion.h1
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, {user.name}
            </motion.h1>
            {user.isVerified ? (
              <motion.span
                className="bg-green-500/20 text-green-100 border border-green-400/30 text-[10px] font-bold px-2 py-1 rounded-full flex items-center backdrop-blur-sm whitespace-nowrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ShieldCheck size={12} className="mr-1" /> Verified Patient
              </motion.span>
            ) : (
              <motion.span
                className="bg-amber-500/20 text-amber-100 border border-amber-400/30 text-[10px] font-bold px-2 py-1 rounded-full flex items-center backdrop-blur-sm whitespace-nowrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ShieldAlert size={12} className="mr-1" /> Unverified
              </motion.span>
            )}
          </div>

          {/* F47: Health Insights Widget - REPLACING STATIC SUMMARY */}
          <div className="mt-4 max-w-xl">
            <HealthInsightsCard insights={insights} loading={loadingInsights} />
          </div>

          <motion.div
            className="flex gap-3 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatedButton
              onClick={() => setShowSOS(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-lg shadow-red-900/20"
            >
              <Siren size={16} className="mr-2 animate-pulse" /> SOS Emergency
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setShowVitalsModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center backdrop-blur-sm"
            >
              <HeartPulse size={16} className="mr-2" /> Log Vitals
            </AnimatedButton>
          </motion.div>
        </div>
        <motion.div
          className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <Activity size={300} />
        </motion.div>
      </motion.div>

      {/* Verification Panel */}
      <VerificationPanel
        isIdentityVerified={user.isVerified}
        isInsuranceVerified={insuranceCards.length > 0}
        onStartIdentityVerification={onStartVerification}
        onManageInsurance={() => onNavigate('insurance')}
      />

      {/* NEW: AI Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Col 1: Outbreak Alerts & Wellness Score */}
        <div className="space-y-6">
          <OutbreakAlertCard alerts={alerts} />
          <WellnessScoreCard score={wellnessScore} recentActivity="Kept up with meds!" />
        </div>

        {/* Col 2: Risk Assessment */}
        <div className="space-y-6">
          <RiskAssessmentCard risks={risks} />
          <SmartActionsCard actions={smartActions} />
        </div>

        {/* Col 3: Quick Stats (Existing + Compact) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="bg-red-50 p-2 rounded-full mb-2">
              <Activity className="text-red-500" size={20} />
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Heart Rate</span>
            <span className="text-xl font-bold text-slate-800">72</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="bg-blue-50 p-2 rounded-full mb-2">
              <Droplet className="text-blue-500" size={20} />
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">BP</span>
            <span className="text-xl font-bold text-slate-800">120/80</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="bg-amber-50 p-2 rounded-full mb-2">
              <Thermometer className="text-amber-500" size={20} />
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Temp</span>
            <span className="text-xl font-bold text-slate-800">98.6</span>
          </div>
          <div
            onClick={() => user.isVerified ? onNavigate('appointments') : onStartVerification()}
            className="cursor-pointer bg-arya-50 p-4 rounded-2xl shadow-sm border border-arya-100 flex flex-col items-center justify-center hover:bg-arya-100 transition-colors"
          >
            <div className="bg-white p-2 rounded-full mb-2">
              <Calendar className="text-arya-600" size={20} />
            </div>
            <span className="text-arya-700 text-[10px] uppercase font-semibold">Appts</span>
            <span className="text-lg font-bold text-arya-800">{appointments.length}</span>
          </div>
        </div>
      </div>

      {/* Main Chart + Next Appt (Existing Layout Modified) */}
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
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
    </motion.div>
  );
};