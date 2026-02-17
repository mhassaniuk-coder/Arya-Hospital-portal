import React, { useState } from 'react';
import { Activity, Flame, Moon, Footprints, Utensils, Droplet, Plus, Sparkles, Loader2, Brain, Dumbbell, Wind, BedDouble, GlassWater, Apple, X, CheckSquare, Square, Trash2, TrendingUp, LineChart, AlertTriangle } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface WellnessPlan {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    exercise: string;
    mindfulness: string;
    sleepTip: string;
    hydration: string;
}

interface Habit {
    id: string;
    name: string;
    completed: boolean;
    streak: number;
}

export const WellnessPage: React.FC = () => {
    const [waterIntake, setWaterIntake] = useState(4);
    const [isGenerating, setIsGenerating] = useState(false);
    const [plan, setPlan] = useState<WellnessPlan | null>(null);
    const [goals, setGoals] = useState('');
    const [showGoalInput, setShowGoalInput] = useState(false);

    // Predictive Vitals State
    const [predictingTrends, setPredictingTrends] = useState(false);
    const [trendResult, setTrendResult] = useState<{ trends: { vital: string; direction: string; summary: string; risk: string; recommendation: string }[]; overallSummary: string } | null>(null);

    const handlePredictTrends = async () => {
        setPredictingTrends(true);
        // Mock history for demo
        const history = [
            { name: "Blood Pressure (Sys)", values: [{ date: "2023-10-01", value: 120 }, { date: "2023-11-01", value: 125 }, { date: "2023-12-01", value: 128 }] },
            { name: "Heart Rate", values: [{ date: "2023-10-01", value: 72 }, { date: "2023-11-01", value: 75 }, { date: "2023-12-01", value: 74 }] },
            { name: "Weight", values: [{ date: "2023-10-01", value: 180 }, { date: "2023-11-01", value: 178 }, { date: "2023-12-01", value: 176 }] }
        ];
        const result = await geminiService.predictHealthTrends(history);
        setTrendResult(result);
        setPredictingTrends(false);
    };

    // Habit Tracker State
    const [habits, setHabits] = useState<Habit[]>([
        { id: 'h1', name: 'Morning Meditation (10m)', completed: true, streak: 5 },
        { id: 'h2', name: 'Read 20 pages', completed: false, streak: 12 },
        { id: 'h3', name: 'No Sugar', completed: false, streak: 3 },
        { id: 'h4', name: 'Take Vitamins', completed: true, streak: 45 },
    ]);
    const [newHabitName, setNewHabitName] = useState('');

    const toggleHabit = (id: string) => {
        setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    };

    const addHabit = () => {
        if (!newHabitName.trim()) return;
        setHabits([...habits, { id: `h${Date.now()}`, name: newHabitName, completed: false, streak: 0 }]);
        setNewHabitName('');
    };

    const deleteHabit = (id: string) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const handleGeneratePlan = async () => {
        setIsGenerating(true);
        try {
            const result = await geminiService.generateWellnessPlan({
                conditions: ['High Cholesterol'],
                medications: ['Lipitor 20mg', 'Lisinopril 10mg'],
                activity: 'moderate',
                goals: goals || 'improve heart health and reduce cholesterol'
            });
            setPlan(result);
        } catch {
            setPlan({
                breakfast: "Oatmeal with berries (350 cal)",
                lunch: "Grilled chicken salad (450 cal)",
                dinner: "Salmon with vegetables (500 cal)",
                snack: "Greek yogurt with nuts (200 cal)",
                exercise: "30 min brisk walk",
                mindfulness: "5 min deep breathing",
                sleepTip: "Avoid screens 1 hour before bed",
                hydration: "8 glasses of water"
            });
        }
        setIsGenerating(false);
    };

    const planCards = plan ? [
        { icon: Apple, label: 'Breakfast', value: plan.breakfast, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
        { icon: Utensils, label: 'Lunch', value: plan.lunch, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { icon: Utensils, label: 'Dinner', value: plan.dinner, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
        { icon: Apple, label: 'Snack', value: plan.snack, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100' },
        { icon: Dumbbell, label: 'Exercise', value: plan.exercise, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
        { icon: Wind, label: 'Mindfulness', value: plan.mindfulness, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { icon: BedDouble, label: 'Sleep Tip', value: plan.sleepTip, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
        { icon: GlassWater, label: 'Hydration', value: plan.hydration, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    ] : [];

    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-0 space-y-6 animate-fade-in pb-24 md:pb-8">
            <h1 className="text-2xl font-bold text-slate-800">Wellness & Lifestyle</h1>

            {/* Activity Rings */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex items-center gap-6 z-10">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                            <circle cx="64" cy="64" r="56" stroke="#ef4444" strokeWidth="8" fill="transparent" strokeDasharray="351" strokeDashoffset="100" strokeLinecap="round" />
                            <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                            <circle cx="64" cy="64" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset="50" strokeLinecap="round" />
                        </svg>
                        <Activity className="absolute text-white" size={24} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-400 font-bold"><Flame size={16} /> 450 / 600 Kcal</div>
                        <div className="flex items-center gap-2 text-green-400 font-bold"><Footprints size={16} /> 6,240 Steps</div>
                        <div className="flex items-center gap-2 text-blue-400 font-bold"><Moon size={16} /> 7h 20m Sleep</div>
                    </div>
                </div>
            </div>

            {/* AI Predictive Vitals */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            <TrendingUp className="text-blue-600" size={22} /> Predictive Vitals Analysis
                        </h3>
                        <p className="text-slate-500 text-sm">AI forecasts based on your recent health history.</p>
                    </div>
                    <button
                        onClick={handlePredictTrends}
                        disabled={predictingTrends}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2 transition-all"
                    >
                        {predictingTrends ? <Loader2 size={16} className="animate-spin" /> : <LineChart size={16} />}
                        {predictingTrends ? 'Analyzing Trends...' : 'Forecast Health'}
                    </button>
                </div>

                {trendResult && (
                    <div className="animate-fade-in space-y-6">
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <p className="text-blue-900 text-sm font-medium leading-relaxed">
                                <Sparkles size={14} className="inline mr-1 text-blue-600" />
                                {trendResult.overallSummary}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {trendResult.trends.map((trend, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-slate-700">{trend.vital}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase ${trend.direction === 'improving' ? 'bg-green-100 text-green-700' :
                                            trend.direction === 'worsening' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            {trend.direction}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">{trend.summary}</p>

                                    {trend.risk !== 'low' && (
                                        <div className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-100">
                                            <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                            <p className="text-[10px] text-slate-600 italic">{trend.recommendation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Wellness Plan Generator */}
            <div className="bg-gradient-to-br from-arya-50 to-indigo-50 p-6 rounded-3xl border border-arya-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                        <Sparkles className="text-arya-600" size={22} /> AI Wellness Plan
                    </h3>
                    {plan && (
                        <button onClick={() => setPlan(null)} className="text-slate-400 hover:text-slate-600 p-1">
                            <X size={18} />
                        </button>
                    )}
                </div>

                {!plan ? (
                    <div className="space-y-4">
                        <p className="text-slate-600 text-sm">Generate a personalized daily wellness plan based on your health profile, medications, and goals.</p>

                        <div>
                            <button
                                onClick={() => setShowGoalInput(!showGoalInput)}
                                className="text-sm text-arya-600 font-medium hover:underline mb-2"
                            >
                                {showGoalInput ? 'Hide' : '+ Add health goal (optional)'}
                            </button>
                            {showGoalInput && (
                                <input
                                    type="text"
                                    value={goals}
                                    onChange={(e) => setGoals(e.target.value)}
                                    placeholder="e.g., lose weight, improve sleep, reduce stress..."
                                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none bg-white"
                                />
                            )}
                        </div>

                        <button
                            onClick={handleGeneratePlan}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-arya-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-arya-200 transition-all disabled:opacity-60"
                        >
                            {isGenerating ? (
                                <><Loader2 size={18} className="animate-spin" /> Generating Your Plan...</>
                            ) : (
                                <><Brain size={18} /> Generate My Wellness Plan</>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                        {planCards.map((card, i) => (
                            <div key={i} className={`p-4 rounded-2xl border ${card.bg} ${card.border} transition-all hover:shadow-md`}>
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-xl bg-white shadow-sm ${card.color}`}>
                                        <card.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                                        <p className="text-sm font-medium text-slate-800 mt-0.5">{card.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="md:col-span-2 mt-2">
                            <button
                                onClick={handleGeneratePlan}
                                disabled={isGenerating}
                                className="w-full py-2.5 border border-arya-200 text-arya-700 rounded-xl font-medium text-sm hover:bg-arya-100 transition-all flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                Regenerate Plan
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Meal Plan */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Utensils size={20} className="text-orange-500" /> Today's Meal Plan (AI)</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden"><img src="https://picsum.photos/seed/food1/100" className="w-full h-full object-cover" /></div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Breakfast</p>
                                <p className="font-bold text-slate-800">Oatmeal & Berries</p>
                                <p className="text-xs text-slate-500">350 Kcal • High Fiber</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden"><img src="https://picsum.photos/seed/food2/100" className="w-full h-full object-cover" /></div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Lunch</p>
                                <p className="font-bold text-slate-800">Grilled Chicken Salad</p>
                                <p className="text-xs text-slate-500">450 Kcal • High Protein</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hydration & Habits */}
                <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Droplet size={20} /> Hydration Tracker</h3>
                        <div className="text-4xl font-bold text-blue-600 my-4">{waterIntake} <span className="text-lg text-blue-400">/ 8 cups</span></div>
                        <div className="flex gap-2">
                            <button onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))} className="w-10 h-10 rounded-full bg-white text-blue-500 font-bold shadow-sm">-</button>
                            <button onClick={() => setWaterIntake(waterIntake + 1)} className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold shadow-sm">+</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckSquare size={20} className="text-emerald-500" /> Lifestyle Habits</h3>
                        <div className="space-y-2 mb-4">
                            {habits.map(habit => (
                                <div key={habit.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleHabit(habit.id)}>
                                        <div className={`transition-colors text-emerald-500`}>
                                            {habit.completed ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-300" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${habit.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{habit.name}</p>
                                            <p className="text-[10px] text-slate-400">🔥 {habit.streak} day streak</p>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteHabit(habit.id)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newHabitName}
                                onChange={e => setNewHabitName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addHabit()}
                                placeholder="Add new habit..."
                                className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                            />
                            <button onClick={addHabit} disabled={!newHabitName.trim()} className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
