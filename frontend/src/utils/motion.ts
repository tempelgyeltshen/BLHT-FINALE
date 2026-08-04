import { Variants } from 'motion/react';

/**
 * Unified luxury-hover variant for clickable cards across the site.
 * Ensures consistent elevation lift, warm ambient shadow, spring physics, and subtle tap feedback.
 */
export const luxuryHoverVariants: Variants = {
  initial: { 
    y: 0, 
    scale: 1, 
    boxShadow: "0 4px 6px -1px rgba(59, 35, 20, 0.05), 0 2px 4px -2px rgba(59, 35, 20, 0.05)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: { 
    y: -8, 
    scale: 1.015,
    boxShadow: "0 20px 30px -10px rgba(59, 35, 20, 0.18), 0 10px 15px -5px rgba(217, 107, 39, 0.12)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 22,
      mass: 0.8
    }
  },
  tap: { 
    scale: 0.985,
    y: -2,
    boxShadow: "0 8px 12px -4px rgba(59, 35, 20, 0.12)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  }
};

export const luxuryHoverProps = {
  variants: luxuryHoverVariants,
  initial: "initial",
  whileHover: "hover",
  whileTap: "tap",
};
