// src/components/ParallaxSection.jsx
import { motion } from "framer-motion";

export function ParallaxSection({ children, speed = 0.5, className = "" }) {
  return (
    <motion.div
      style={{}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollReveal({ children, direction = "up", delay = 0, className = "" }) {
  return (
    <motion.div
      style={{}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgress({ className = "" }) {
  return null;
}
