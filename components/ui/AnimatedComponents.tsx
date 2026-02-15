import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeInUp, scaleIn, cardHover, buttonHover } from '../../utils/animations';

// ============================================
// ANIMATED BUTTON COMPONENT
// ============================================

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'relative font-semibold rounded-xl transition-colors flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-arya-600 text-white hover:bg-arya-700 shadow-lg shadow-arya-200',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      variants={buttonHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {isLoading ? (
        <motion.div
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

// ============================================
// ANIMATED CARD COMPONENT
// ============================================

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  delay = 0,
}) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay }}
      whileHover={hoverEffect ? { 
        y: -4, 
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// ANIMATED PAGE WRAPPER
// ============================================

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);

// ============================================
// ANIMATED LIST CONTAINER
// ============================================

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ 
  children, 
  className = '',
  staggerDelay = 0.1 
}) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

// ============================================
// ANIMATED LIST ITEM
// ============================================

interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    variants={fadeInUp}
    layout
  >
    {children}
  </motion.div>
);

// ============================================
// ANIMATED MODAL
// ============================================

interface AnimatedModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
}) => (
  <motion.div
    className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: isOpen ? 1 : 0 }}
    exit={{ opacity: 0 }}
    style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
  >
    {/* Backdrop */}
    <motion.div
      className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
    />
    
    {/* Modal content */}
    <motion.div
      className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: isOpen ? 1 : 0, 
        scale: isOpen ? 1 : 0.95,
        y: isOpen ? 0 : 20
      }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// ============================================
// ANIMATED COUNTER
// ============================================

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration * 0.3 }}
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  );
};

// ============================================
// ANIMATED ICON
// ============================================

interface AnimatedIconProps {
  icon: React.ReactNode;
  className?: string;
  animate?: 'pulse' | 'bounce' | 'spin' | 'shake' | 'none';
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  className = '',
  animate = 'none',
}) => {
  const animations = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: { duration: 1, repeat: Infinity },
    },
    bounce: {
      y: [0, -5, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    spin: {
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: 'linear' },
    },
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.5 },
    },
    none: {},
  };

  return (
    <motion.span
      className={`inline-flex ${className}`}
      animate={animations[animate]}
    >
      {icon}
    </motion.span>
  );
};

// ============================================
// ANIMATED BADGE
// ============================================

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  pulse?: boolean;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  pulse = false,
}) => {
  const variantClasses = {
    primary: 'bg-arya-100 text-arya-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <motion.span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      {pulse && (
        <motion.span
          className="w-2 h-2 mr-1.5 rounded-full bg-current"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      {children}
    </motion.span>
  );
};

// ============================================
// ANIMATED PROGRESS BAR
// ============================================

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className = '',
  color = 'bg-arya-500',
  showLabel = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <motion.p
          className="text-xs text-slate-500 mt-1 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(percentage)}%
        </motion.p>
      )}
    </div>
  );
};

// ============================================
// ANIMATED TOOLTIP
// ============================================

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  children,
  content,
  position = 'top',
}) => {
  const [show, setShow] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <motion.div
        className={`absolute ${positionClasses[position]} px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap z-50`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: show ? 1 : 0, 
          scale: show ? 1 : 0.8 
        }}
        transition={{ duration: 0.15 }}
        style={{ pointerEvents: 'none' }}
      >
        {content}
      </motion.div>
    </div>
  );
};

export default AnimatedButton;
