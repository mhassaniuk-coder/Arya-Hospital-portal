import { Variants, Transition } from 'framer-motion';

// ============================================
// ANIMATION VARIANTS - Reusable animation configs
// ============================================

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.3 }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: 0.3 }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: { duration: 0.3 }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: { duration: 0.3 }
  }
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

export const scaleInCenter: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.5,
    transition: { duration: 0.2 }
  }
};

// Slide animations
export const slideInFromRight: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    x: '100%',
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideInFromLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    x: '-100%',
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideInFromBottom: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: { 
    y: '100%',
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Card animations
export const cardHover: Variants = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Button animations
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Pulse animation
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Glow animation
export const glow: Variants = {
  initial: { boxShadow: '0 0 0px rgba(14, 165, 233, 0)' },
  animate: {
    boxShadow: [
      '0 0 0px rgba(14, 165, 233, 0)',
      '0 0 20px rgba(14, 165, 233, 0.5)',
      '0 0 0px rgba(14, 165, 233, 0)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Floating animation
export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Rotate animation
export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Shimmer for loading states
export const shimmer: Variants = {
  initial: { backgroundPosition: '200% 0' },
  animate: {
    backgroundPosition: ['-200% 0', '200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

export const modalTransition: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

export const overlayTransition: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// ============================================
// SPRING CONFIGURATIONS
// ============================================

export const springConfig: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25
};

export const springConfigGentle: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 30
};

export const springConfigBouncy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 15
};

export const springConfigStiff: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 30
};

// ============================================
// CONTAINER VARIANTS FOR LISTS
// ============================================

export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// ============================================
// SPECIAL EFFECTS
// ============================================

export const successPop: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

export const bounce: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeOut'
    }
  }
};

// 3D Card flip
export const flipCard: Variants = {
  front: { rotateY: 0 },
  back: { 
    rotateY: 180,
    transition: { duration: 0.6 }
  }
};

// Accordion/collapse
export const accordion: Variants = {
  collapsed: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  expanded: { 
    height: 'auto', 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

// Tooltip
export const tooltip: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 5,
    transition: { duration: 0.15 }
  }
};
