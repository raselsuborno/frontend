// src/components/AnimatedSection.jsx
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
  },
};

export function AnimatedSection({ children, className = "", parallax = false, speed = 0.3 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = parallax 
    ? useTransform(scrollYProgress, [0, 1], [0, speed * 100])
    : undefined;
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      style={{ y, opacity: parallax ? opacity : undefined, scale: parallax ? scale : undefined }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      variants={itemVariants}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.65,
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }}
      whileHover={{ 
        y: -8,
        transition: { 
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
