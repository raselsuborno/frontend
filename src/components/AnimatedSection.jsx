// src/components/AnimatedSection.jsx
import { motion } from "framer-motion";

// Improved container variants with better flow and buttery smooth easing
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      ease: [0.16, 1, 0.3, 1], // Buttery smooth easing
    },
  },
};

// Enhanced item variants with smoother easing
const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1], // Ultra-smooth easing for buttery visuals
      type: "tween",
    },
  },
};

// Card variants with refined animation
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1], // Buttery smooth
      type: "tween",
    },
  },
};

export function AnimatedSection({ 
  children, 
  className = "" 
}) {
  return (
    <motion.div
      initial="visible"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className = "", delay = 0 }) {
  const customVariants = {
    ...itemVariants,
    visible: {
      ...itemVariants.visible,
      transition: {
        ...itemVariants.visible.transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className = "", delay = 0 }) {
  const isMobile = useIsMobile();
  const customVariants = {
    ...cardVariants,
    visible: {
      ...cardVariants.visible,
      transition: {
        ...cardVariants.visible.transition,
        delay,
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isMobile ? { 
        y: -10,
        scale: 1.02,
        transition: { 
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1]
        }
      } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
