import type { Variants, Transition } from 'framer-motion'

// ============================================
// PAGE TRANSITIONS
// ============================================
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

// ============================================
// STAGGER CHILDREN (for lists/grids)
// ============================================
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

// ============================================
// CARD INTERACTIONS
// ============================================
export const cardHover = {
  scale: 1.02,
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  transition: { type: 'spring', stiffness: 400, damping: 17 } as Transition,
}

export const cardTap = {
  scale: 0.98,
}

// ============================================
// MODAL / DIALOG
// ============================================
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
}

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

// ============================================
// SIDEBAR
// ============================================
export const sidebarVariants: Variants = {
  expanded: { width: 256, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  collapsed: { width: 72, transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

// ============================================
// SLIDE PANELS (AI chat, notifications)
// ============================================
export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
}

// ============================================
// EVENT-TYPE SPECIFIC ANIMATIONS
// ============================================

/** Confetti burst — for party & birthday events */
export const confettiAnimation = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200 } },
}

/** Float — for trip events (gentle up-down) */
export const floatAnimation: Variants = {
  animate: {
    y: [-4, 4, -4],
    transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
  },
}

/** Pulse — for sports events (energy ring) */
export const pulseAnimation: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
  },
}

/** Breathe — for health events (calm) */
export const breatheAnimation: Variants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.85, 1, 0.85],
    transition: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
  },
}

/** Wave — for concert events (audio waveform feel) */
export const waveAnimation: Variants = {
  animate: {
    scaleY: [1, 1.3, 0.8, 1.2, 1],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
  },
}

/** Glitch — for tech events (subtle digital glitch) */
export const glitchAnimation: Variants = {
  animate: {
    x: [0, -2, 2, -1, 0],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(0deg)',
    ],
    transition: { repeat: Infinity, duration: 3, ease: 'linear' },
  },
}

/** Sparkle — for wedding events */
export const sparkleAnimation: Variants = {
  animate: {
    opacity: [0.7, 1, 0.7],
    scale: [0.95, 1.02, 0.95],
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  },
}

/** Glow — for volunteer events (warm glow) */
export const glowAnimation: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(251, 191, 36, 0.2)',
      '0 0 40px rgba(251, 191, 36, 0.4)',
      '0 0 20px rgba(251, 191, 36, 0.2)',
    ],
    transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
  },
}

// Map event animation names to variants
export const eventAnimations: Record<string, Variants> = {
  confetti: confettiAnimation as Variants,
  float: floatAnimation,
  pulse: pulseAnimation,
  breathe: breatheAnimation,
  wave: waveAnimation,
  glitch: glitchAnimation,
  sparkle: sparkleAnimation,
  glow: glowAnimation,
  fadeSlide: { animate: {} }, // Default, no special animation
  slideUp: { animate: {} },
  splash: { animate: {} },
}

// ============================================
// COUNTER ANIMATION (for dashboard stats)
// ============================================
export const counterSpring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 1,
}

// ============================================
// SKELETON SHIMMER
// ============================================
export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { repeat: Infinity, duration: 1.5, ease: 'linear' },
  },
}
