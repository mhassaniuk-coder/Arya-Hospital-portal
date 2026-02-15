import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart, Activity, Stethoscope } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

// Basic loading spinner
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'text-arya-500',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2 className={`${sizeClasses[size]} ${color} animate-spin ${className}`} />
  );
};

// Pulse loading dots
export const LoadingDots: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex gap-1 ${className}`}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-arya-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </div>
);

// Medical-themed loading animation
export const MedicalLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-16 h-16 border-4 border-arya-200 border-t-arya-500 rounded-full" />
    </motion.div>
    <motion.div
      className="relative flex items-center justify-center w-16 h-16"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <Heart className="w-6 h-6 text-arya-500" />
    </motion.div>
  </div>
);

// Heartbeat loader
export const HeartbeatLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    <motion.div
      animate={{
        scale: [1, 1.2, 1, 1.2, 1],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Activity className="w-6 h-6 text-red-500" />
    </motion.div>
    <svg className="w-24 h-8" viewBox="0 0 100 30">
      <motion.path
        d="M0,15 L20,15 L25,5 L30,25 L35,10 L40,20 L45,15 L100,15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-arya-500"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </svg>
  </div>
);

// Stethoscope animation
export const StethoscopeLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`flex items-center justify-center ${className}`}
    animate={{ rotate: [-5, 5, -5] }}
    transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Stethoscope className="w-8 h-8 text-arya-500" />
  </motion.div>
);

// Full page loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  showBackground?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = 'Loading...',
  showBackground = true 
}) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          showBackground ? 'bg-white/80 backdrop-blur-sm' : ''
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <MedicalLoader />
          <motion.p
            className="text-slate-600 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {message}
          </motion.p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Inline loading state
interface InlineLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loader?: React.ReactNode;
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  isLoading, 
  children, 
  loader,
  className = '' 
}) => (
  <div className={`relative ${className}`}>
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {loader || <LoadingDots />}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Button loading state
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => (
  <motion.button
    type={type}
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`relative flex items-center justify-center gap-2 ${className}`}
    whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
    whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
  >
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

// Progress bar loading
interface ProgressLoadingProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressLoading: React.FC<ProgressLoadingProps> = ({
  progress,
  className = '',
  showPercentage = true,
}) => (
  <div className={`space-y-2 ${className}`}>
    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-arya-500 to-arya-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
    {showPercentage && (
      <motion.p
        className="text-sm text-slate-500 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {Math.round(progress)}%
      </motion.p>
    )}
  </div>
);

// Skeleton pulse for content loading
export const ContentLoader: React.FC<{ 
  rows?: number;
  className?: string;
}> = ({ rows = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <motion.div
        key={i}
        className="h-4 bg-slate-200 rounded-full overflow-hidden"
        style={{ width: `${100 - i * 15}%` }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

export default LoadingSpinner;
