import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, User, Upload, CreditCard, CheckCircle, 
  FileText, X, ArrowRight, MapPin, Phone, Globe, 
  Camera, Sparkles, Calendar, Edit2, Smartphone, Lock, Check 
} from 'lucide-react';

interface VerificationModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form Data State
  const [formData, setFormData] = useState({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    profileImage: null as string | null,
    country: '',
    state: '',
    city: '',
    address: '',
    phone: '',
    otp: '',
    idType: 'passport', // passport, dl, cnic
    idImage: null as string | null,
    dob: '', // To be filled by AI
    gender: '' // To be filled by AI
  });

  const [agreements, setAgreements] = useState({
      privacy: false,
      terms: false
  });

  const [otpSent, setOtpSent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'idImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 3 && !otpSent) {
        // Simulate sending OTP
        setIsLoading(true);
        setTimeout(() => {
            setOtpSent(true);
            setIsLoading(false);
        }, 1000);
        return;
    }

    if (step === 4) {
        // Simulate AI Analysis
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            // Simulate AI extraction
            setFormData(prev => ({
                ...prev,
                dob: '1985-01-15',
                gender: 'Female'
            }));
            setStep(5);
        }, 2500);
        return;
    }

    if (step < 6) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 1500);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
        <div className="flex justify-between items-center px-2 relative mb-2">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
            <div 
                className="absolute left-0 top-1/2 h-1 bg-arya-500 -z-10 rounded-full transition-all duration-500" 
                style={{width: `${((step - 1) / 5) * 100}%`}}
            ></div>
            {[1, 2, 3, 4, 5, 6].map((s) => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-4 ${
                s <= step 
                    ? 'bg-arya-500 border-white text-white shadow-md' 
                    : 'bg-white border-slate-100 text-slate-300'
                }`}>
                {s < step ? <CheckCircle size={14} /> : s}
                </div>
            ))}
        </div>
        <div className="flex justify-between px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Info</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Addr</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Doc</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">AI</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Done</span>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="bg-arya-50 p-2 rounded-xl text-arya-600">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Identity Verification</h2>
                    <p className="text-slate-400 text-xs font-medium">Secure HIPAA Compliant Process</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">
          {renderProgressBar()}

          <div className="min-h-[300px]">
            {/* STEP 1: PERSONAL INFO */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
                    <p className="text-slate-500 text-sm">Let's start with your basic details.</p>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload')?.click()}>
                        <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group-hover:border-arya-200 transition-all">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <User size={40} className="text-slate-300" />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-arya-600 p-2 rounded-full text-white shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </div>
                        <input 
                            id="profile-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'profileImage')} 
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Address Details</h3>
                    <p className="text-slate-500 text-sm">Where do you currently reside?</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Country / Region</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                        type="text" 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800"
                        placeholder="United States"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">State / Province</label>
                        <input 
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800"
                        placeholder="California"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                        <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800"
                        placeholder="San Francisco"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Street Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800"
                        placeholder="123 Medical Plaza Blvd, Suite 400"
                        />
                    </div>
                </div>
              </div>
            )}

            {/* STEP 3: PHONE VERIFICATION */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                 <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Phone Verification</h3>
                    <p className="text-slate-500 text-sm">We'll send a secure code to your device.</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="flex gap-3">
                         <div className="relative flex-grow">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={otpSent}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 disabled:opacity-70 disabled:bg-slate-100"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        {!otpSent && (
                            <button 
                                onClick={handleNext}
                                disabled={isLoading || !formData.phone}
                                className="bg-slate-800 text-white px-4 rounded-xl font-bold text-sm whitespace-nowrap hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Sending...' : 'Send Code'}
                            </button>
                        )}
                    </div>
                </div>

                {otpSent && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                             <Smartphone className="text-indigo-600 mt-1" size={20} />
                             <div>
                                 <p className="font-bold text-indigo-900 text-sm">Code sent to {formData.phone}</p>
                                 <p className="text-indigo-700 text-xs">Please check your messages and enter the 6-digit code.</p>
                             </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Verification Code</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    name="otp"
                                    value={formData.otp}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-indigo-100 rounded-xl focus:ring-0 focus:border-indigo-500 outline-none text-slate-800 font-mono text-lg tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                        <p className="text-center text-xs text-slate-400 cursor-pointer hover:text-arya-600">Resend code in 30s</p>
                    </div>
                )}
              </div>
            )}

            {/* STEP 4: DOCUMENT UPLOAD */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                 <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Document Verification</h3>
                    <p className="text-slate-500 text-sm">Upload a valid government-issued ID.</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Document Type</label>
                    <select 
                        name="idType" 
                        value={formData.idType} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-arya-200 outline-none text-slate-800 appearance-none"
                    >
                        <option value="passport">Passport</option>
                        <option value="dl">Driving License</option>
                        <option value="cnic">National ID / CNIC</option>
                    </select>
                </div>

                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-arya-400 rounded-full blur-xl animate-pulse opacity-50"></div>
                            <div className="relative bg-white p-4 rounded-full shadow-lg text-arya-600">
                                <Sparkles size={32} className="animate-spin-slow" />
                            </div>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg">AI Analysis in Progress</h4>
                        <p className="text-slate-500 text-sm text-center max-w-xs">Our AI is securely scanning your document to auto-fill your details...</p>
                    </div>
                ) : (
                    <div 
                        onClick={() => document.getElementById('id-upload')?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                            formData.idImage ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-arya-500 hover:bg-arya-50'
                        }`}
                    >
                        {formData.idImage ? (
                            <>
                                <CheckCircle className="text-green-600 mb-3" size={40} />
                                <p className="font-bold text-green-800">File Uploaded Successfully</p>
                                <p className="text-xs text-green-600 mt-1">Click to change file</p>
                            </>
                        ) : (
                            <>
                                <Upload size={40} className="mb-4 text-slate-300 group-hover:text-arya-500" />
                                <p className="font-medium text-slate-400 group-hover:text-arya-600">Click to upload document</p>
                                <p className="text-xs mt-2 text-slate-300">JPG, PNG or PDF (Max 5MB)</p>
                            </>
                        )}
                        <input 
                            id="id-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*,.pdf"
                            onChange={(e) => handleImageUpload(e, 'idImage')} 
                        />
                    </div>
                )}
              </div>
            )}

            {/* STEP 5: AI REVIEW */}
            {step === 5 && (
              <div className="space-y-6 animate-fade-in">
                 <div className="text-center mb-6">
                     <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-md">
                         <Sparkles size={12} /> AI Auto-Fill Complete
                     </div>
                    <h3 className="text-lg font-bold text-slate-800">Review Extracted Data</h3>
                    <p className="text-slate-500 text-sm">Please correct any information AI might have missed.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                        <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                             {formData.profileImage && <img src={formData.profileImage} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-lg">{formData.firstName} {formData.lastName}</p>
                            <p className="text-sm text-slate-500 capitalize">{formData.idType.toUpperCase()} Verified</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input 
                                    type="text" 
                                    name="gender" 
                                    value={formData.gender} 
                                    onChange={handleInputChange}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 w-full focus:ring-2 focus:ring-arya-200 outline-none"
                                />
                                <Edit2 size={14} className="text-slate-300" />
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Date of Birth</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input 
                                    type="date" 
                                    name="dob" 
                                    value={formData.dob} 
                                    onChange={handleInputChange}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 w-full focus:ring-2 focus:ring-arya-200 outline-none"
                                />
                            </div>
                         </div>
                    </div>
                </div>
              </div>
            )}

            {/* STEP 6: FINAL SUMMARY */}
            {step === 6 && (
              <div className="space-y-6 animate-fade-in">
                 <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 shadow-sm">
                        <Check size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Confirm All Details</h3>
                    <p className="text-slate-500 text-sm">Review your final verification profile.</p>
                </div>

                <div className="space-y-4">
                    {/* ID Card Style Preview */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-arya-400" size={20} />
                                <span className="font-bold tracking-wider">ARYA ID</span>
                            </div>
                            <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Ready to Issue</span>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="w-20 h-24 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600 flex-shrink-0">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-slate-500"/></div>
                                )}
                            </div>
                            <div className="flex-grow space-y-3">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Full Name</p>
                                    <p className="font-bold text-lg leading-tight">{formData.firstName} {formData.lastName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">DOB</p>
                                        <p className="text-sm font-medium">{formData.dob}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Gender</p>
                                        <p className="text-sm font-medium">{formData.gender}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-sm space-y-3">
                         <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                             <span className="text-slate-500 flex items-center gap-2"><MapPin size={14}/> Address</span>
                             <span className="font-semibold text-slate-700 text-right max-w-[60%] truncate">
                                 {formData.address}, {formData.city}
                             </span>
                         </div>
                         <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                             <span className="text-slate-500 flex items-center gap-2"><Phone size={14}/> Phone</span>
                             <span className="font-semibold text-slate-700 flex items-center gap-1">
                                 {formData.phone} <CheckCircle size={12} className="text-green-500"/>
                             </span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-slate-500 flex items-center gap-2"><FileText size={14}/> Document</span>
                             <span className="font-semibold text-slate-700 uppercase">
                                 {formData.idType}
                             </span>
                         </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-arya-200">
                            <input 
                                type="checkbox" 
                                className="mt-1 w-4 h-4 text-arya-600 rounded border-slate-300 focus:ring-arya-500" 
                                checked={agreements.privacy}
                                onChange={(e) => setAgreements({...agreements, privacy: e.target.checked})}
                            />
                            <div className="text-xs text-slate-600">
                                I agree to the <span className="text-arya-600 font-bold hover:underline">Privacy Policy</span>. I understand how my personal and medical data will be handled securely.
                            </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-transparent hover:border-arya-200">
                            <input 
                                type="checkbox" 
                                className="mt-1 w-4 h-4 text-arya-600 rounded border-slate-300 focus:ring-arya-500" 
                                checked={agreements.terms}
                                onChange={(e) => setAgreements({...agreements, terms: e.target.checked})}
                            />
                            <div className="text-xs text-slate-600">
                                I agree to the <span className="text-arya-600 font-bold hover:underline">Terms & Conditions</span> regarding the use of the Arya Hospital Portal and AI services.
                            </div>
                        </label>
                    </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-50 bg-slate-50 flex gap-4">
            {step > 1 && (
                <button 
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    Back
                </button>
            )}
            <button 
                onClick={handleNext}
                disabled={
                    isLoading || isAnalyzing || 
                    (step === 3 && !otpSent && !formData.phone) ||
                    (step === 3 && otpSent && !formData.otp) ||
                    (step === 4 && !formData.idImage) ||
                    (step === 6 && (!agreements.privacy || !agreements.terms))
                }
                className="flex-grow bg-arya-600 text-white py-3 rounded-xl font-bold hover:bg-arya-700 transition-all shadow-lg shadow-arya-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Processing...' : step === 6 ? 'Complete Verification' : 'Continue'} 
                {!isLoading && <ArrowRight size={18} />}
            </button>
        </div>

      </div>
    </div>
  );
};