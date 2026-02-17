import React from 'react';
import { FileText, Mic, MicOff, Sparkles, Brain } from 'lucide-react';
import { Doctor, ServiceItem, AIAnalysisResult, FamilyMember } from '../../types';
import { ServiceType } from './types';

interface ReviewDetailsProps {
  selectedServiceType: ServiceType;
  selectedDoctor: Doctor | null;
  selectedService: ServiceItem | null;
  selectedDate: string;
  selectedSlot: { time: string } | null;
  selectedFamilyMemberId: string;
  familyMembers: FamilyMember[];
  symptomInput: string;
  isListening: boolean;
  analyzing: boolean;
  aiResult: AIAnalysisResult | null;
  onSymptomChange: (symptoms: string) => void;
  onToggleListening: () => void;
  onRunAiAnalysis: () => void;
}

export const ReviewDetails: React.FC<ReviewDetailsProps> = ({
  selectedServiceType,
  selectedDoctor,
  selectedService,
  selectedDate,
  selectedSlot,
  selectedFamilyMemberId,
  familyMembers,
  symptomInput,
  isListening,
  analyzing,
  aiResult,
  onSymptomChange,
  onToggleListening,
  onRunAiAnalysis,
}) => {
  const selectedFamilyMember = familyMembers.find(m => m.id === selectedFamilyMemberId);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Booking Summary */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <FileText size={18} />
          Booking Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <span className="text-xs text-slate-400 uppercase font-semibold">Service Type</span>
            <p className="font-semibold text-slate-700 capitalize mt-1">
              {selectedServiceType === 'consultation' ? 'Doctor Consultation' :
                selectedServiceType === 'home-care' ? 'Home Care Service' :
                  selectedServiceType === 'lab' ? 'Lab Test' : 'Imaging'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <span className="text-xs text-slate-400 uppercase font-semibold">Provider</span>
            <p className="font-semibold text-slate-700 mt-1">
              {selectedDoctor?.name || selectedService?.name || 'Not selected'}
            </p>
            {selectedDoctor && (
              <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
            )}
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <span className="text-xs text-slate-400 uppercase font-semibold">Date</span>
            <p className="font-semibold text-slate-700 mt-1">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <span className="text-xs text-slate-400 uppercase font-semibold">Time</span>
            <p className="font-semibold text-slate-700 mt-1">{selectedSlot?.time || 'Not selected'}</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 md:col-span-2">
            <span className="text-xs text-slate-400 uppercase font-semibold">Patient</span>
            <p className="font-semibold text-slate-700 mt-1">
              {selectedFamilyMember?.name || 'Self'}
            </p>
          </div>
        </div>
      </div>

      {/* Symptoms/Reason Input */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700">
          Reason for Visit / Symptoms
        </label>
        <div className="relative">
          <textarea
            value={symptomInput}
            onChange={(e) => onSymptomChange(e.target.value)}
            placeholder="Describe your symptoms or reason for this appointment..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none resize-none h-32"
          />
          <button
            onClick={onToggleListening}
            className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all ${isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
              }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>

        {/* AI Analysis Button */}
        <button
          onClick={onRunAiAnalysis}
          disabled={!symptomInput.trim() || analyzing}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              AI Symptom Analysis
            </>
          )}
        </button>

        {/* AI Result */}
        {aiResult && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={18} className="text-purple-600" />
              <span className="font-semibold text-purple-700">AI Analysis Result</span>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-slate-600">Urgency:</span>{' '}
                <span className={`font-semibold ${aiResult.urgency === 'High' ? 'text-red-600' :
                    aiResult.urgency === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                  {aiResult.urgency.toUpperCase()}
                </span>
              </p>
              <p><span className="font-medium text-slate-600">Suggested Specialty:</span> {aiResult.specialty}</p>
              <p><span className="font-medium text-slate-600">Reasoning:</span> {aiResult.reasoning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
