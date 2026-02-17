import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Calendar, FileText, MessageSquare, Heart, Settings,
    LogOut, ChevronLeft, ChevronRight, Activity, Video, DollarSign,
    HeartHandshake, Users, CreditCard, History, Pill, Lock, Menu, X
} from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
    currentUser: User;
    currentView: ViewState;
    setCurrentView: (view: ViewState) => void;
    isRestricted: (view: ViewState) => boolean;
    onSignOut: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    currentUser,
    currentView,
    setCurrentView,
    isRestricted,
    onSignOut,
    isOpen,
    setIsOpen
}) => {
    const [logoError, setLogoError] = useState(false);

    const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
        const isActive = currentView === view;
        return (
            <button
                onClick={() => setCurrentView(view)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
          ${isActive
                        ? 'bg-gradient-to-r from-arya-600 to-arya-500 text-white shadow-lg shadow-arya-200'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-arya-600'
                    }
          ${!isOpen && 'justify-center px-2'}
        `}
                title={!isOpen ? label : ''}
            >
                <div className="relative shrink-0">
                    <Icon size={isOpen ? 20 : 24} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {!currentUser.isVerified && isRestricted(view) && (
                        <div className="absolute -top-1 -right-2 bg-white rounded-full p-0.5 border border-slate-100 shadow-sm">
                            <Lock size={10} className="text-slate-400" />
                        </div>
                    )}
                </div>

                {isOpen && (
                    <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {label}
                    </span>
                )}

                {!isOpen && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                        {label}
                    </div>
                )}
            </button>
        );
    };

    const SectionLabel = ({ label }: { label: string }) => (
        isOpen ? (
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider animate-fadeIn">
                {label}
            </div>
        ) : (
            <div className="pt-4 pb-2 border-t border-slate-100 mx-4 mt-2" />
        )
    );

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 280 : 88 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:flex flex-col h-full bg-white border-r border-slate-100 shrink-0 z-30 shadow-xl shadow-slate-200/50 relative"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-8 bg-white border border-slate-100 rounded-full p-1 shadow-md text-slate-400 hover:text-arya-600 transition-colors z-40"
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className="flex flex-col h-full overflow-hidden">
                {/* Header / Logo */}
                <div className={`p-6 flex items-center ${isOpen ? 'justify-start space-x-3' : 'justify-center'}`}>
                    <div className="relative shrink-0 w-10 h-10">
                        {logoError ? (
                            <div className="w-10 h-10 bg-gradient-to-br from-arya-500 to-arya-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-arya-200/50">
                                AH
                            </div>
                        ) : (
                            <img
                                src="/logo.jpg"
                                alt="Arya Hospital"
                                className="w-10 h-10 object-cover rounded-xl shadow-md"
                                onError={() => setLogoError(true)}
                            />
                        )}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    {isOpen && (
                        <div className="overflow-hidden">
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-arya-800 to-arya-500 whitespace-nowrap block"
                            >
                                Arya Hospital
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[10px] text-slate-400 font-medium uppercase tracking-widest block"
                            >
                                Portal 2.0
                            </motion.span>
                        </div>
                    )}
                </div>

                {/* Scrollable Nav Params */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3 space-y-1 custom-scrollbar">
                    <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem view="chat" icon={MessageSquare} label="AI Assistant" />
                    <NavItem view="symptom_checker" icon={Activity} label="Symptom Checker" />
                    <NavItem view="appointments" icon={Calendar} label="Appointments" />
                    <NavItem view="pharmacy" icon={Pill} label="Pharmacy" />
                    <NavItem view="records" icon={FileText} label="Records" />
                    <NavItem view="telehealth" icon={Video} label="Telehealth" />
                    <NavItem view="history" icon={History} label="History" />

                    <SectionLabel label="Lifestyle & Care" />

                    <NavItem view="wellness" icon={Heart} label="Wellness" />
                    <NavItem view="specialty_care" icon={Heart} label="Specialty Care" />
                    <NavItem view="financial" icon={DollarSign} label="Financial" />
                    <NavItem view="engagement" icon={HeartHandshake} label="Engagement" />
                    <NavItem view="family" icon={Users} label="Family" />
                    <NavItem view="insurance" icon={CreditCard} label="Insurance" />
                </div>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div
                        className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} cursor-pointer hover:bg-white p-2 rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-slate-100 group`}
                        onClick={() => setCurrentView('settings')}
                    >
                        <div className="relative shrink-0">
                            <img src={currentUser.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:border-arya-100 transition-colors" />
                            {currentUser.isVerified && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white" title="Verified">
                                    <History size={8} />
                                    {/* Using History as a checkmark placeholder if needed, or just a dot */}
                                </div>
                            )}
                        </div>

                        {isOpen && (
                            <div className="overflow-hidden flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-arya-700 transition-colors">{currentUser.name}</p>
                                <p className="text-xs text-slate-400 truncate">{currentUser.isVerified ? 'Verified Patient' : 'Unverified Account'}</p>
                            </div>
                        )}

                        {isOpen && (
                            <Settings size={16} className="text-slate-300 group-hover:text-arya-400" />
                        )}
                    </div>

                    {isOpen && (
                        <button
                            onClick={onSignOut}
                            className="mt-3 w-full flex items-center justify-center space-x-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors"
                        >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.aside>
    );
};
