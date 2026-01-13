// src/components/ScrollAnimatedCard.jsx
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

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
  const cardRef = useRef(null);
  const isMobile = useIsMobile();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Desktop: animate on scroll into view
  // Mobile: NO scroll animations - animate once on mount only
  const isInView = useInView(cardRef, { 
    once: true, 
    amount: isMobile ? 1 : 0.3, // Mobile: require full visibility to prevent flashing
    margin: isMobile ? "0px" : "-50px"
  });

  // Mobile: animate once on mount with stagger (NO scroll tracking)
  useEffect(() => {
    if (isMobile && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, (delay || idx * 0.12) * 1000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, hasAnimated, delay, idx]);

  // Determine animation state
  // Mobile: use hasAnimated (once on load), Desktop: use isInView (scroll-based)
  const shouldAnimate = isMobile ? hasAnimated : isInView;

  // Calculate delay based on type
  const animationDelay = delay || (type === "step" ? idx * 0.2 : idx * 0.12);

  const customVariants = {
    ...cardVariants,
    visible: {
      ...cardVariants.visible,
      transition: {
        ...cardVariants.visible.transition,
        delay: isMobile ? 0 : animationDelay, // Delay handled in useEffect for mobile
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={customVariants}
      whileHover={!isMobile ? { 
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
  const reviewRef = useRef(null);
  const isMobile = useIsMobile();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const isInView = useInView(reviewRef, { 
    once: true, 
    amount: isMobile ? 1 : 0.3,
    margin: isMobile ? "0px" : "-50px"
  });

  // Mobile: animate once on mount
  useEffect(() => {
    if (isMobile && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, (idx % 7) * 0.15 * 1000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, hasAnimated, idx]);

  const shouldAnimate = isMobile ? hasAnimated : isInView;

  const customVariants = {
    ...reviewVariants,
    visible: {
      ...reviewVariants.visible,
      transition: {
        ...reviewVariants.visible.transition,
        delay: isMobile ? 0 : (idx % 7) * 0.12,
      },
    },
  };

  return (
    <motion.div
      ref={reviewRef}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={customVariants}
      whileHover={!isMobile ? { 
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
