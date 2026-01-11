// src/components/ScrollAnimatedCard.jsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ScrollAnimatedCard({ children, idx = 0, className = "", delay = 0, type = "default" }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  // Simplified animations - just use basic motion props
  const animationProps = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 },
    transition: { 
      duration: 0.6, 
      delay: delay || idx * 0.1, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    },
    whileHover: { 
      y: type === "worldwide" ? -15 : -8, 
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}

export function ScrollAnimatedReview({ children, idx = 0, className = "" }) {
  const reviewRef = useRef(null);
  const isInView = useInView(reviewRef, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={reviewRef}
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      whileHover={{ y: -12, scale: 1.05, rotate: 0, z: 50 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (idx % 7) * 0.1 }}
    >
      {children}
    </motion.div>
  );
}
