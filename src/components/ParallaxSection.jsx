// src/components/ParallaxSection.jsx
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

export function ParallaxSection({ children, speed = 0.5, className = "" }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  
  // Only apply parallax effects on desktop
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Disable parallax transforms on mobile
  const y = !isMobile 
    ? useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])
    : undefined;
  const opacity = !isMobile
    ? useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    : undefined;
  const scale = !isMobile
    ? useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95])
    : undefined;

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollReveal({ children, direction = "up", delay = 0, className = "" }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  
  // On mobile: animate once on mount
  // On desktop: animate on scroll
  const isInView = useInView(ref, { 
    once: true, 
    amount: isMobile ? 1 : 0.3 
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const directions = {
    up: { from: "100px", to: "0px" },
    down: { from: "-100px", to: "0px" },
    left: { from: "-100px", to: "0px" },
    right: { from: "100px", to: "0px" },
  };

  const dir = directions[direction] || directions.up;
  
  // Only apply scroll transforms on desktop
  const x = !isMobile && (direction === "left" || direction === "right")
    ? useTransform(scrollYProgress, [0, 1], [dir.from, dir.to])
    : 0;
  const y = !isMobile && (direction === "up" || direction === "down")
    ? useTransform(scrollYProgress, [0, 1], [dir.from, dir.to])
    : 0;

  const opacity = !isMobile
    ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5])
    : isInView ? 1 : 0;
  const rotate = !isMobile
    ? useTransform(scrollYProgress, [0, 1], [0, 5])
    : 0;

  return (
    <motion.div
      ref={ref}
      style={{ x, y, opacity, rotate }}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ 
        duration: isMobile ? 0.8 : 0.6, 
        delay: isMobile ? delay : delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgress({ className = "" }) {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hide scroll progress on mobile for cleaner experience
  if (isMobile) return null;

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600 origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  );
}
