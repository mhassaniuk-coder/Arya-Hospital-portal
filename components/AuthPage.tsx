import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowRight, Lock, User, Mail, Shield,
  CheckCircle, Activity, Heart, Calendar, MessageSquare,
  Eye, EyeOff, Sparkles, Phone, Fingerprint, Brain
} from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn, slideInFromLeft, slideInFromRight } from '../utils/animations';
import { ParticlesBackground, GradientBackground, AnimatedButton, LoadingDots } from './ui';

interface AuthPageProps {
  onLogin: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const features = [
    { icon: <Brain className="w-5 h-5" />, text: "AI Health Assistant" },
    { icon: <Calendar className="w-5 h-5" />, text: "Smart Scheduling" },
    { icon: <Shield className="w-5 h-5" />, text: "Secure Records" },
    { icon: <Heart className="w-5 h-5" />, text: "Wellness Tracking" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-arya-600 via-arya-700 to-purple-800 relative overflow-hidden"
        variants={slideInFromLeft}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <ParticlesBackground className="opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.div
                className="bg-white/20 backdrop-blur-sm p-2 rounded-2xl"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <img src="/logo.jpg" alt="Arya Hospital" className="w-12 h-12 object-contain rounded-xl" />
              </motion.div>
              <span className="text-3xl font-bold text-white">Arya Hospital</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Your Health Journey{' '}
              <span className="text-arya-200">Starts Here</span>
            </h1>

            <p className="text-lg text-arya-100 mb-10 max-w-md">
              Experience the future of healthcare with AI-powered assistance,
              smart scheduling, and comprehensive health management.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 text-white/90"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              className="mt-12 flex items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Shield className="w-5 h-5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Lock className="w-5 h-5" />
                <span>256-bit Encryption</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-20 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white relative"
        variants={slideInFromRight}
        initial="hidden"
        animate="visible"
      >
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <img src="/logo.jpg" alt="Arya Hospital" className="w-8 h-8 object-contain rounded-lg" />
          <span className="text-xl font-bold text-slate-800">Arya Hospital</span>
        </div>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* Header */}
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center mb-8"
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-arya-50 text-arya-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <Sparkles size={14} />
                <span>Secure Access</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot-password' && 'Reset Password'}
              </h2>
              <p className="text-slate-500">
                {mode === 'signin' && 'Sign in to access your health dashboard'}
                {mode === 'signup' && 'Start your health journey with us'}
                {mode === 'forgot-password' && 'We\'ll send you a reset link'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {mode === 'forgot-password' && resetSent ? (
                <motion.div
                  key="reset-sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Check Your Email</h3>
                  <p className="text-slate-500 mb-6">
                    We've sent a password reset link to <strong>{formData.email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setResetSent(false); }}
                    className="text-arya-600 font-semibold hover:underline"
                  >
                    Back to Sign In
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Name Field (Sign Up Only) */}
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-arya-500 focus:ring-0 outline-none text-slate-800 transition-all"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {mode === 'signin' ? 'Email or MRN' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-arya-500 focus:ring-0 outline-none text-slate-800 transition-all"
                        placeholder={mode === 'signin' ? "patient@example.com or MRN-123456" : "you@example.com"}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field (Not for Forgot Password) */}
                  {mode !== 'forgot-password' && (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-semibold text-slate-700">Password</label>
                          {mode === 'signin' && (
                            <button
                              type="button"
                              onClick={() => setMode('forgot-password')}
                              className="text-sm text-arya-600 font-semibold hover:underline"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-arya-500 focus:ring-0 outline-none text-slate-800 transition-all"
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password (Sign Up Only) */}
                      {mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-arya-500 focus:ring-0 outline-none text-slate-800 transition-all"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}

                  {/* Submit Button */}
                  <AnimatedButton
                    type="submit"
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${isLoading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-arya-600 hover:bg-arya-700 text-white shadow-lg shadow-arya-200'
                      }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>Please wait...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === 'signin' && 'Sign In'}
                          {mode === 'signup' && 'Create Account'}
                          {mode === 'forgot-password' && 'Send Reset Link'}
                        </span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </AnimatedButton>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Mode Switcher */}
          {mode !== 'forgot-password' && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-slate-500">
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-arya-600 font-semibold hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="text-arya-600 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          )}

          {/* Back to Sign In (Forgot Password Mode) */}
          {mode === 'forgot-password' && !resetSent && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setMode('signin')}
                className="text-slate-500 hover:text-slate-700 font-medium flex items-center gap-2 mx-auto"
              >
                <ArrowRight className="rotate-180" size={16} />
                Back to Sign In
              </button>
            </motion.div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Fingerprint size={20} />
              <span>Biometric</span>
            </motion.button>
            <motion.button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone size={20} />
              <span>Phone OTP</span>
            </motion.button>
          </div>

          {/* Terms */}
          <motion.p
            className="mt-8 text-center text-xs text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            By continuing, you agree to our{' '}
            <a href="#" className="text-arya-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-arya-600 hover:underline">Privacy Policy</a>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
