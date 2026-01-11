import React from "react";
import { motion } from "framer-motion";

export function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{ 
        width: "100%", 
        maxWidth: "100%", 
        overflowX: "hidden",
        boxSizing: "border-box"
      }}
    >
      {children}
    </motion.div>
  );
}
