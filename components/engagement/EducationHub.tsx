import React from 'react';
import { BookOpen, Play, Award, CheckCircle } from 'lucide-react';

export const EducationHub: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Article Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                    <div className="h-48 bg-slate-200 relative">
                        <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Healthy Eating" className="w-full h-full object-cover" />
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-800">Nutrition</span>
                    </div>
                    <div className="p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Superfoods for Heart Health</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">Discover the top 10 foods that can lower your blood pressure and improve cardiac function naturally.</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <BookOpen size={14} /> 5 min read
                        </div>
                    </div>
                </div>

                {/* Video Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                    <div className="h-48 bg-slate-900 relative flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" alt="Yoga" className="w-full h-full object-cover opacity-60" />
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 z-10 group-hover:scale-110 transition-transform">
                            <Play size={20} className="text-white fill-white ml-1" />
                        </div>
                        <span className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white">12:45</span>
                    </div>
                    <div className="p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Morning Yoga for Flexibility</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">A gentle routine to wake up your body and improve joint mobility. Suitable for beginners.</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Play size={14} /> Video Class
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Test Your Knowledge</h3>
                    <p className="text-purple-100 mb-6 max-w-sm">Take a quick quiz about diabetes management and earn wellness points!</p>
                    <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center gap-2">
                        Start Quiz <Award size={18} />
                    </button>
                </div>
                <div className="hidden md:block w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <CheckCircle size={64} className="text-purple-200" />
                </div>
            </div>
        </div>
    );
};
