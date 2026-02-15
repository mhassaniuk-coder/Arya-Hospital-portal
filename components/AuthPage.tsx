import React, { useState } from 'react';
import { LayoutDashboard, ArrowRight, Lock, User, Mail, Shield, ChevronLeft, CheckCircle } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API Calls
    setTimeout(() => {
      if (mode === 'forgot-password') {
        setResetSent(true);
        setIsLoading(false);
      } else {
        // Sign In or Sign Up success
        onLogin();
      }
    }, 1500);
  };

  const renderHeader = () => (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-arya-600 p-3 rounded-2xl shadow-lg shadow-arya-200 mb-4 transform transition-transform hover:scale-105 duration-300">
        <LayoutDashboard className="text-white" size={32} />
      </div>
      <h1 className="text-2xl font-bold text-slate-800">Arya Hospital Portal</h1>
      <p className="text-slate-500 text-sm mt-2 text-center">
        {mode === 'signin' && 'Secure Patient Access & AI Health Companion'}
        {mode === 'signup' && 'Create your secure patient account'}
        {mode === 'forgot-password' && 'Recover access to your account'}
      </p>
    </div>
  );

  const renderSignIn = () => (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email or MRN</label>
        <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 transition-all"
              placeholder="patient@example.com"
            />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <button 
                type="button"
                onClick={() => { setMode('forgot-password'); setResetSent(false); }}
                className="text-xs text-arya-600 font-bold hover:underline"
            >
                Forgot Password?
            </button>
        </div>
        <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 transition-all"
              placeholder="••••••••"
            />
        </div>
      </div>
    </div>
  );

  const renderSignUp = () => (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
        <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 transition-all"
              placeholder="Jane Doe"
            />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
        <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 transition-all"
              placeholder="jane@example.com"
            />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
        <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 transition-all"
              placeholder="Create a password"
            />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
        <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 transition-all"
              placeholder="Confirm password"
            />
        </div>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="space-y-6 animate-fade-in">
      {resetSent ? (
        <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <CheckCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Check your email</h3>
            <p className="text-green-700 text-sm">We've sent password reset instructions to <strong>{formData.email}</strong></p>
            <button 
                type="button"
                onClick={() => setMode('signin')}
                className="mt-6 text-sm font-bold text-green-700 hover:underline"
            >
                Back to Sign In
            </button>
        </div>
      ) : (
        <>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm">
                Enter the email address associated with your account and we'll send you a link to reset your password.
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 transition-all"
                    placeholder="patient@example.com"
                    />
                </div>
            </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-arya-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
        
        {/* Back Button for Forgot Password/Signup */}
        {mode !== 'signin' && !resetSent && (
            <button 
                onClick={() => setMode('signin')}
                className="absolute top-8 left-8 p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
            >
                <ChevronLeft size={20} />
            </button>
        )}

        {renderHeader()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signin' && renderSignIn()}
          {mode === 'signup' && renderSignUp()}
          {mode === 'forgot-password' && renderForgotPassword()}
          
          {!resetSent && (
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-arya-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-arya-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-arya-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-y-[-1px]"
              >
                {isLoading ? (
                    'Processing...' 
                ) : (
                    <>
                        {mode === 'signin' && 'Sign In'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'forgot-password' && 'Send Reset Link'}
                        <ArrowRight size={20} />
                    </>
                )}
              </button>
          )}
        </form>

        {!resetSent && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4">
            {mode === 'signin' && (
                <p className="text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <button onClick={() => setMode('signup')} className="font-bold text-arya-600 hover:text-arya-800 transition-colors">
                        Sign Up
                    </button>
                </p>
            )}
            {mode === 'signup' && (
                <p className="text-slate-500 text-sm">
                    Already have an account?{' '}
                    <button onClick={() => setMode('signin')} className="font-bold text-arya-600 hover:text-arya-800 transition-colors">
                        Sign In
                    </button>
                </p>
            )}
            
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-6">
                <Lock size={12} /> 256-bit HIPAA Compliant Encryption
            </p>
            </div>
        )}
      </div>
    </div>
  );
};