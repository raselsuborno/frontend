// src/components/ParallaxSection.jsx
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef } from "react";

export function ParallaxSection({ children, speed = 0.5, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95]);

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
  const isInView = useInView(ref, { once: false, amount: 0.3 });
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
  const x = direction === "left" || direction === "right" 
    ? useTransform(scrollYProgress, [0, 1], [dir.from, dir.to])
    : 0;
  const y = direction === "up" || direction === "down"
    ? useTransform(scrollYProgress, [0, 1], [dir.from, dir.to])
    : 0;

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, opacity, rotate }}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgress({ className = "" }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-600 origin-left z-50 ${className}`}
      style={{ scaleX }}
    />
  );
}
