import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
}

const STEPS = ['Service', 'Select', 'Time', 'Review', 'Payment', 'Done'];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center px-4 md:px-12 relative w-full">
      {/* Background line */}
      <div className="absolute left-12 right-12 top-4 h-0.5 bg-slate-100 -z-10 rounded-full"></div>
      
      {/* Progress line */}
      <div 
        className="absolute left-12 top-4 h-0.5 bg-arya-500 -z-10 rounded-full transition-all duration-500" 
        style={{width: `calc(${((currentStep - 1) / 5) * 100}% - 48px)`}}
      ></div>
      
      {STEPS.map((label, idx) => {
        const isCompleted = currentStep > idx + 1;
        const isCurrent = currentStep === idx + 1;
        
        return (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
              isCompleted 
                ? 'bg-arya-500 text-white' 
                : isCurrent 
                  ? 'bg-white border-2 border-arya-500 text-arya-600 shadow-md scale-110' 
                  : 'bg-slate-100 text-slate-300'
            }`}>
              {isCompleted ? <CheckCircle size={14} /> : idx + 1}
            </div>
            <span className={`hidden md:block text-[10px] font-bold uppercase tracking-wider ${
              isCurrent ? 'text-arya-600' : 'text-slate-300'
            }`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
