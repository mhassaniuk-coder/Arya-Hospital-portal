import React from 'react';
import { ShieldCheck, ShieldAlert, CreditCard, User, Mail, Smartphone, CheckCircle, ChevronRight, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationPanelProps {
    isIdentityVerified: boolean;
    isInsuranceVerified: boolean;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    onStartIdentityVerification: () => void;
    onManageInsurance: () => void;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
    isIdentityVerified,
    isInsuranceVerified,
    isEmailVerified = true,
    isPhoneVerified = false,
    onStartIdentityVerification,
    onManageInsurance,
}) => {
    // Calculate Progress
    const steps = [
        { label: 'Identity', done: isIdentityVerified },
        { label: 'Insurance', done: isInsuranceVerified },
        { label: 'Email', done: isEmailVerified },
        { label: 'Phone', done: isPhoneVerified },
    ];

    const completedSteps = steps.filter(s => s.done).length;
    const progress = (completedSteps / steps.length) * 100;

    if (progress === 100) return null; // Hide if fully verified (optional)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 rounded-3xl p-8 md:p-10 shadow-xl border-2 border-amber-200 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-32 bg-amber-100 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50"></div>

            <div className="flex flex-col md:flex-row gap-10 relative z-10">
                {/* Left Side: Header & Progress */}
                <div className="md:w-1/3 space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-amber-200 text-amber-700 rounded-xl shadow-sm">
                                <ShieldAlert size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-amber-900 leading-tight">Verification Required</h2>
                        </div>
                        <p className="text-amber-800/80 text-base leading-relaxed">
                            For your security, access to <span className="font-bold">Chat, Records, and Appointments</span> is restricted until you complete verification.
                        </p>
                    </div>

                    <div className="bg-white/50 p-4 rounded-2xl border border-amber-100">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Profile Completion</span>
                            <span className="text-2xl font-bold text-amber-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-4 bg-amber-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                        <p className="text-xs text-amber-600 mt-3 font-medium flex items-center gap-1">
                            <Lock size={12} /> {steps.length - completedSteps} steps remaining to unlock full access
                        </p>
                    </div>

                    <button
                        onClick={!isIdentityVerified ? onStartIdentityVerification : undefined}
                        className="w-full py-4 text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        Start Verification <div className="bg-white/20 p-1 rounded-full"><ArrowRight size={20} /></div>
                    </button>
                </div>

                {/* Right Side: Step Grid */}
                <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Identity */}
                    <div
                        onClick={!isIdentityVerified ? onStartIdentityVerification : undefined}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group shadow-sm hover:shadow-md ${isIdentityVerified
                                ? 'bg-green-50 border-green-100'
                                : 'bg-white border-amber-200 hover:border-amber-400'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl ${isIdentityVerified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'}`}>
                                <User size={24} />
                            </div>
                            {isIdentityVerified ? (
                                <CheckCircle size={24} className="text-green-500" />
                            ) : (
                                <span className="text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                                    <ShieldAlert size={12} /> Mandatory
                                </span>
                            )}
                        </div>
                        <h3 className={`text-lg font-bold ${isIdentityVerified ? 'text-green-800' : 'text-slate-800'}`}>Identity Check</h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">Required to access medical records and appointments.</p>
                    </div>

                    {/* Insurance */}
                    <div
                        onClick={onManageInsurance}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group shadow-sm hover:shadow-md ${isInsuranceVerified
                                ? 'bg-green-50 border-green-100'
                                : 'bg-white border-amber-200 hover:border-amber-400'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl ${isInsuranceVerified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'}`}>
                                <CreditCard size={24} />
                            </div>
                            {isInsuranceVerified && <CheckCircle size={24} className="text-green-500" />}
                        </div>
                        <h3 className={`text-lg font-bold ${isInsuranceVerified ? 'text-green-800' : 'text-slate-800'}`}>Link Insurance</h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">Verify coverage to view estimated costs.</p>
                    </div>

                    {/* Phone */}
                    <div className={`p-6 rounded-2xl border-2 transition-all shadow-sm ${isPhoneVerified
                            ? 'bg-green-50 border-green-100'
                            : 'bg-white border-slate-100 opacity-80'
                        }`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl ${isPhoneVerified ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Smartphone size={24} />
                            </div>
                            {isPhoneVerified && <CheckCircle size={24} className="text-green-500" />}
                        </div>
                        <h3 className={`text-lg font-bold ${isPhoneVerified ? 'text-green-800' : 'text-slate-700'}`}>Secure Phone</h3>
                        <p className="text-sm text-slate-400 mt-1">For important SMS alerts.</p>
                    </div>

                    {/* Email */}
                    <div className={`p-6 rounded-2xl border-2 transition-all shadow-sm ${isEmailVerified
                            ? 'bg-green-50 border-green-100'
                            : 'bg-white border-slate-100 opacity-80'
                        }`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl ${isEmailVerified ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Mail size={24} />
                            </div>
                            {isEmailVerified && <CheckCircle size={24} className="text-green-500" />}
                        </div>
                        <h3 className={`text-lg font-bold ${isEmailVerified ? 'text-green-800' : 'text-slate-700'}`}>Email Address</h3>
                        <p className="text-sm text-slate-400 mt-1">For login recovery.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
