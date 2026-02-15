import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ArrowRight, Lock, User, Mail, Shield, 
  CheckCircle, Activity, Heart, Calendar, MessageSquare, 
  Stethoscope, Brain, Sparkles, Star, ChevronRight,
  Phone, MapPin, Clock, Users, Zap, ShieldCheck
} from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn, fadeIn, slideInFromLeft, slideInFromRight } from '../utils/animations';
import { ParticlesBackground, GradientBackground, AnimatedButton, LoadingDots } from './ui';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Health Assistant",
      description: "24/7 intelligent health companion powered by advanced AI for personalized care guidance"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "AI-optimized appointment booking with intelligent time slot recommendations"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Secure Records",
      description: "Military-grade encryption for your medical records with biometric verification"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Wellness Tracking",
      description: "Comprehensive health monitoring with personalized insights and recommendations"
    }
  ];

  const stats = [
    { value: "500K+", label: "Active Patients" },
    { value: "10K+", label: "Healthcare Providers" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9", label: "App Rating", icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Patient",
      content: "Arya transformed how I manage my health. The AI assistant is incredibly helpful!",
      avatar: "https://picsum.photos/seed/user1/100"
    },
    {
      name: "Dr. James K.",
      role: "Cardiologist",
      content: "The smart scheduling and patient insights have improved my practice efficiency by 40%.",
      avatar: "https://picsum.photos/seed/user2/100"
    },
    {
      name: "Maria L.",
      role: "Patient",
      content: "Finally, a healthcare app that puts patients first. The video consultations are seamless.",
      avatar: "https://picsum.photos/seed/user3/100"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <GradientBackground />
        <ParticlesBackground className="opacity-30" />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-arya-600 p-2 rounded-xl">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-arya-700 to-arya-500">
                Arya
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-arya-600 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-slate-600 hover:text-arya-600 transition-colors font-medium">Testimonials</a>
              <a href="#contact" className="text-slate-600 hover:text-arya-600 transition-colors font-medium">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={onSignIn}
                className="text-slate-600 hover:text-arya-600 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <AnimatedButton
                onClick={onGetStarted}
                className="bg-arya-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-arya-700"
              >
                Get Started
              </AnimatedButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 bg-arya-50 text-arya-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              >
                <Sparkles size={16} />
                <span>AI-Powered Healthcare Platform</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6"
              >
                Your Health,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-arya-500 to-purple-600">
                  Simplified
                </span>{' '}
                & Secured
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Experience the future of healthcare management with AI-powered assistance, 
                smart scheduling, and comprehensive health tracking — all in one beautiful platform.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <AnimatedButton
                  onClick={onGetStarted}
                  className="bg-arya-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-arya-200 hover:bg-arya-700 flex items-center justify-center gap-2"
                >
                  Start Your Journey
                  <ArrowRight size={20} />
                </AnimatedButton>
                <motion.button
                  className="px-8 py-4 rounded-xl font-semibold text-slate-700 border-2 border-slate-200 hover:border-arya-300 hover:bg-arya-50 transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Activity size={20} />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-100"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                      {stat.icon}
                    </div>
                    <span className="text-sm text-slate-500">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - App Preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main Phone Mockup */}
                <motion.div
                  className="relative z-10 mx-auto w-72 sm:w-80"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-slate-100 px-6 py-2 flex justify-between items-center">
                        <span className="text-xs font-medium">9:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-slate-400 rounded-sm" />
                          <div className="w-4 h-2 bg-slate-400 rounded-sm" />
                          <div className="w-6 h-3 bg-green-500 rounded-sm" />
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-arya-100 rounded-full flex items-center justify-center">
                            <User className="text-arya-600" size={24} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">Good Morning!</p>
                            <p className="text-sm text-slate-500">Sarah Jenkins</p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-arya-500 to-arya-600 rounded-2xl p-4 text-white">
                          <p className="text-sm opacity-80">Next Appointment</p>
                          <p className="font-bold">Dr. Emily Chen</p>
                          <p className="text-sm">Today, 10:00 AM</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <Heart className="text-red-500 mx-auto mb-1" size={20} />
                            <p className="text-xs text-slate-500">Heart Rate</p>
                            <p className="font-bold text-slate-800">72 bpm</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <Activity className="text-arya-500 mx-auto mb-1" size={20} />
                            <p className="text-xs text-slate-500">Blood Pressure</p>
                            <p className="font-bold text-slate-800">120/80</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -left-8 top-20 bg-white rounded-2xl shadow-xl p-4 hidden lg:block"
                  animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Appointment Confirmed</p>
                      <p className="text-xs text-slate-500">Dr. Wilson • Tomorrow</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-4 bottom-32 bg-white rounded-2xl shadow-xl p-4 hidden lg:block"
                  animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Brain className="text-purple-500" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">AI Health Tip</p>
                      <p className="text-xs text-slate-500">Stay hydrated today!</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Everything You Need for{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-arya-500 to-purple-600">
                Better Health
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make healthcare management effortless and intelligent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`relative bg-white rounded-2xl p-6 shadow-sm border-2 transition-all cursor-pointer ${
                  activeFeature === index 
                    ? 'border-arya-500 shadow-lg shadow-arya-100' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  activeFeature === index 
                    ? 'bg-arya-500 text-white' 
                    : 'bg-arya-50 text-arya-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
                
                {activeFeature === index && (
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle className="text-arya-500" size={20} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Loved by{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-arya-500 to-purple-600">
                Thousands
              </span>
            </h2>
            <p className="text-lg text-slate-600">
              See what our patients and healthcare providers are saying.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-r from-arya-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 opacity-10">
            <ParticlesBackground />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of patients and healthcare providers who trust Arya for their health management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                onClick={onGetStarted}
                className="bg-white text-arya-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight size={20} />
              </AnimatedButton>
              <motion.button
                className="px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone size={20} />
                Contact Sales
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-arya-600 p-2 rounded-xl">
                  <LayoutDashboard className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">Arya</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-powered healthcare platform for the modern patient.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© 2024 Arya Healthcare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
