import React, { useState } from 'react';
import {
    Sparkles, AlertTriangle, TrendingUp, TrendingDown, Activity,
    Brain, Shield, ChevronDown, ChevronUp, Zap, MapPin,
    ArrowRight, Droplet, Heart, Thermometer, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
export interface HealthInsight {
    type: 'positive' | 'warning' | 'neutral';
    title: string;
    description: string;
    metric?: string;
}

export interface OutbreakAlert {
    region: string;
    condition: string;
    severity: 'low' | 'medium' | 'high';
    cases: string; // e.g. "Rising" or "500+"
    prevention: string;
}

export interface RiskMetric {
    label: string;
    score: number; // 0-100
    trend: 'stable' | 'improving' | 'worsening';
}

export interface SmartAction {
    id: string;
    title: string;
    type: 'appointment' | 'medication' | 'lifestyle' | 'admin';
    priority: 'high' | 'medium' | 'low';
}

// --- Components ---

export const HealthInsightsCard: React.FC<{ insights: HealthInsight[], loading: boolean }> = ({ insights, loading }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-1 text-white shadow-xl overflow-hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Brain size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">AI Health Insights</h3>
                            <p className="text-xs text-indigo-100 opacity-80">Real-time analysis</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-12 bg-white/10 rounded-xl" />
                            <div className="h-12 bg-white/10 rounded-xl" />
                        </div>
                    ) : (
                        <>
                            {insights.slice(0, expanded ? undefined : 2).map((insight, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-3 rounded-xl border border-white/10 flex gap-3 items-start ${insight.type === 'positive' ? 'bg-green-500/20' :
                                            insight.type === 'warning' ? 'bg-amber-500/20' : 'bg-white/5'
                                        }`}
                                >
                                    <div className="mt-1">
                                        {insight.type === 'positive' ? <TrendingUp size={16} className="text-green-300" /> :
                                            insight.type === 'warning' ? <AlertTriangle size={16} className="text-amber-300" /> :
                                                <Info size={16} className="text-blue-300" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{insight.title}</h4>
                                        <p className="text-xs opacity-90 leading-relaxed">{insight.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const OutbreakAlertCard: React.FC<{ alerts: OutbreakAlert[] }> = ({ alerts }) => {
    if (alerts.length === 0) return null;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-5">
            <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-rose-500" />
                <h3 className="font-bold text-slate-800">Local Health Alerts</h3>
            </div>

            <div className="space-y-3">
                {alerts.map((alert, i) => (
                    <div key={i} className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                                    {alert.region}
                                </span>
                                <h4 className="font-bold text-rose-900">{alert.condition} Outbreak</h4>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${alert.severity === 'high' ? 'bg-red-500 text-white' : 'bg-amber-400 text-white'
                                }`}>
                                {alert.severity.toUpperCase()}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-rose-800/80 mb-2">
                            <div className="bg-white/50 p-2 rounded-lg">
                                <span className="block font-bold text-rose-900">Cases</span>
                                {alert.cases}
                            </div>
                            <div className="bg-white/50 p-2 rounded-lg">
                                <span className="block font-bold text-rose-900">Action</span>
                                {alert.prevention}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const WellnessScoreCard: React.FC<{ score: number, recentActivity: string }> = ({ score, recentActivity }) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-green-100 transition-colors" />

            <h3 className="font-bold text-slate-800 mb-4 z-10">Wellness Score</h3>

            <div className="relative w-32 h-32 mb-4 z-10 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r="45" fill="none" stroke={score > 80 ? '#22c55e' : score > 60 ? '#3b82f6' : '#eab308'}
                        strokeWidth="8"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * score) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">{score}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Points</span>
                </div>
            </div>

            <p className="text-xs text-slate-500 max-w-[180px] z-10">
                <Sparkles size={12} className="inline text-amber-400 mr-1" />
                {recentActivity}
            </p>
        </div>
    );
};

export const SmartActionsCard: React.FC<{ actions: SmartAction[] }> = ({ actions }) => {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <Zap size={20} className="text-amber-500" />
                <h3 className="font-bold text-slate-800">Recommended Actions</h3>
            </div>

            <div className="space-y-2">
                {actions.map(action => (
                    <button
                        key={action.id}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-arya-200 hover:bg-arya-50 transition-all group flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                                    action.type === 'medication' ? 'bg-green-100 text-green-600' :
                                        'bg-slate-100 text-slate-500'
                                }`}>
                                {action.type === 'appointment' ? <Activity size={14} /> :
                                    action.type === 'medication' ? <Droplet size={14} /> :
                                        <Info size={14} />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700 group-hover:text-arya-700">{action.title}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">{action.priority} Priority</p>
                            </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-arya-500 transform group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
                {actions.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-4">No pending actions. Great job!</p>
                )}
            </div>
        </div>
    );
};

export const RiskAssessmentCard: React.FC<{ risks: RiskMetric[] }> = ({ risks }) => {
    return (
        <div className="bg-slate-900 text-white rounded-3xl shadow-xl p-5 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="flex items-center gap-2 mb-5 relative z-10">
                <Shield size={20} className="text-blue-400" />
                <h3 className="font-bold text-lg">Health Risk Monitor</h3>
            </div>

            <div className="space-y-4 relative z-10">
                {risks.map((risk, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-sm font-medium text-slate-300">{risk.label}</span>
                            <span className={`text-xs font-bold ${risk.score < 30 ? 'text-green-400' : risk.score < 70 ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                {risk.score < 30 ? 'Low Risk' : risk.score < 70 ? 'Moderate' : 'High Risk'}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${risk.score < 30 ? 'bg-green-500' : risk.score < 70 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${risk.score}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 text-right">
                            {risk.trend === 'improving' ? 'Trend: Improving ▼' : risk.trend === 'worsening' ? 'Trend: Worsening ▲' : 'Trend: Stable -'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
