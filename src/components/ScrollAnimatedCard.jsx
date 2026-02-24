// src/components/ScrollAnimatedCard.jsx
import { motion } from "framer-motion";

// Enhanced animation variants with buttery smooth flow
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60, 
    scale: 0.92,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1], // Ultra-smooth buttery easing
      type: "tween",
    }
  },
};

const reviewVariants = {
  hidden: { 
    opacity: 0, 
    x: -30,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1], // Buttery smooth
      type: "tween",
    }
  },
};

export function ScrollAnimatedCard({ 
  children, 
  idx = 0, 
  className = "", 
  delay = 0, 
  type = "default" 
}) {
  // Calculate delay based on type
  const animationDelay = delay || (type === "step" ? idx * 0.2 : idx * 0.12);

  return (
    <motion.div
      className={className}
      initial="visible"
      animate="visible"
      variants={cardVariants}
      whileHover={{ 
        y: type === "worldwide" ? -18 : -12, 
        scale: 1.03,
        transition: { 
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1] // Buttery smooth hover
        }
      } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function ScrollAnimatedReview({ children, idx = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="visible"
      animate="visible"
      variants={reviewVariants}
      whileHover={{ 
        y: -12, 
        scale: 1.04, 
        rotate: 0, 
        z: 50,
        transition: { 
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1] // Buttery smooth
        }
      } : undefined}
    >
      {children}
    </motion.div>
  );
}
