import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

// Shimmer effect for skeleton loading
const shimmerTransition = {
  repeat: Infinity,
  duration: 1.5,
  ease: 'linear',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'wave',
}) => {
  const baseClasses = 'bg-slate-200 relative overflow-hidden';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? 40 : '100%'),
    height: height || (variant === 'circular' ? 40 : variant === 'text' ? 16 : 100),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {animation === 'wave' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={shimmerTransition}
        />
      )}
      {animation === 'pulse' && (
        <motion.div
          className="absolute inset-0 bg-slate-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ ...shimmerTransition, duration: 1 }}
        />
      )}
    </div>
  );
};

// Card skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 p-6 space-y-4 ${className}`}>
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    <Skeleton height={12} />
    <Skeleton height={12} width="80%" />
    <div className="flex gap-2">
      <Skeleton width={80} height={32} variant="rounded" />
      <Skeleton width={80} height={32} variant="rounded" />
    </div>
  </div>
);

// Appointment card skeleton
export const AppointmentCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-3xl border border-slate-100 p-6 ${className}`}>
    <div className="flex gap-6">
      {/* Date box */}
      <Skeleton variant="rounded" width={100} height={100} />
      
      {/* Content */}
      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton height={24} width="40%" />
            <Skeleton height={16} width="60%" />
          </div>
          <Skeleton variant="rounded" width={80} height={24} />
        </div>
        <div className="flex gap-3">
          <Skeleton variant="rounded" width={100} height={32} />
          <Skeleton variant="rounded" width={120} height={32} />
        </div>
      </div>
    </div>
  </div>
);

// Doctor card skeleton
export const DoctorCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 p-4 ${className}`}>
    <div className="flex gap-4">
      <Skeleton variant="rounded" width={64} height={64} />
      <div className="flex-1 space-y-2">
        <Skeleton height={18} width="50%" />
        <Skeleton height={14} width="70%" />
        <div className="flex gap-2 pt-1">
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="rounded" width={80} height={20} />
        </div>
      </div>
    </div>
  </div>
);

// List skeleton
export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 5, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        <CardSkeleton />
      </motion.div>
    ))}
  </div>
);

// Dashboard stats skeleton
export const StatsSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton height={24} width="60%" />
        <Skeleton height={12} width="80%" />
      </div>
    ))}
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number;
  className?: string 
}> = ({ 
  rows = 5, 
  columns = 4,
  className = '' 
}) => (
  <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="flex gap-4 p-4 border-b border-slate-100 bg-slate-50">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={16} className="flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 p-4 border-b border-slate-50">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton 
            key={colIndex} 
            height={14} 
            className="flex-1"
          />
        ))}
      </div>
    ))}
  </div>
);

// Chat message skeleton
export const ChatMessageSkeleton: React.FC<{ isUser?: boolean; className?: string }> = ({ 
  isUser = false, 
  className = '' 
}) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`}>
    <div className={`max-w-[70%] ${isUser ? 'order-1' : ''}`}>
      {!isUser && (
        <div className="flex items-center gap-2 mb-1">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton width={80} height={12} />
        </div>
      )}
      <div className={`p-3 rounded-2xl ${isUser ? 'bg-arya-500' : 'bg-slate-100'}`}>
        <Skeleton height={14} width={200} />
        <Skeleton height={14} width={150} className="mt-1" />
      </div>
    </div>
  </div>
);

// Full page loading skeleton
export const PageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`space-y-6 p-6 ${className}`}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton height={32} width={200} />
        <Skeleton height={16} width={300} />
      </div>
      <Skeleton variant="rounded" width={120} height={40} />
    </div>
    
    {/* Stats */}
    <StatsSkeleton />
    
    {/* Content */}
    <div className="grid md:grid-cols-2 gap-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
    
    {/* List */}
    <ListSkeleton items={3} />
  </div>
);

export default Skeleton;
