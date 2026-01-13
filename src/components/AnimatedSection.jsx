// src/components/AnimatedSection.jsx
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

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
  className = "", 
  parallax = false, 
  speed = 0.3,
  delay = 0 
}) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // On mobile: animate once on mount, no scroll tracking
  // On desktop: animate on scroll into view
  const isInView = useInView(ref, { 
    once: isMobile ? false : true, // On mobile, we'll handle once manually
    amount: isMobile ? 1 : 0.2,
    margin: isMobile ? "0px" : "-100px"
  });

  // Only use scroll transforms on desktop - completely disabled on mobile
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false // Prevent layout thrashing on mobile
  });

  const y = parallax && !isMobile
    ? useTransform(scrollYProgress, [0, 1], [0, speed * 100])
    : undefined;
  const opacity = parallax && !isMobile
    ? useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])
    : undefined;
  const scale = parallax && !isMobile
    ? useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98])
    : undefined;

  // On mobile: trigger animation once on mount (immediately, no scroll)
  useEffect(() => {
    if (isMobile && !hasAnimated) {
      // Small delay to ensure component is mounted, then animate
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, Math.max(100, delay * 1000));
      return () => clearTimeout(timer);
    }
  }, [isMobile, hasAnimated, delay]);

  // Determine if we should animate
  // On mobile: animate once on mount (NO scroll), on desktop: animate on scroll into view
  const shouldAnimate = isMobile ? hasAnimated : isInView;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ 
        y, 
        opacity: parallax ? opacity : undefined, 
        scale: parallax ? scale : undefined 
      }}
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
