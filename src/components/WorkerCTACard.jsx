// src/components/WorkerCTACard.jsx
// Subtle, professional CTA component for becoming a worker
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, DollarSign, Clock, Users } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

export function WorkerCTACard({ variant = "default", className = "" }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [hasAnimated, setHasAnimated] = useState(false);

  // On mobile: animate once on mount, no scroll tracking
  useEffect(() => {
    if (isMobile && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobile, hasAnimated]);

  const variants = {
    default: {
      background: "linear-gradient(135deg, rgba(11, 92, 40, 0.08) 0%, rgba(11, 92, 40, 0.03) 100%)",
      border: "1px solid rgba(11, 92, 40, 0.15)",
      padding: "28px",
    },
    subtle: {
      background: "rgba(11, 92, 40, 0.04)",
      border: "1px solid rgba(11, 92, 40, 0.1)",
      padding: "24px",
    },
    prominent: {
      background: "linear-gradient(135deg, #0b5c28 0%, #094a20 100%)",
      border: "1px solid #0b5c28",
      padding: "32px",
      color: "white",
    },
  };

  const currentVariant = variants[variant] || variants.default;
  const isProminent = variant === "prominent";

  // Determine animation state
  const shouldAnimate = isMobile ? hasAnimated : true; // Desktop will use whileInView

  return (
    <motion.div
      className={`worker-cta-card ${className}`}
      style={{
        ...currentVariant,
        borderRadius: "16px",
        cursor: "pointer",
      }}
      onClick={() => navigate("/apply/worker")}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
      whileInView={!isMobile ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={!isMobile ? { once: true, amount: 0.3, margin: "-50px" } : undefined}
      transition={{ 
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1], // Smooth, buttery easing
        type: "tween"
      }}
      whileHover={!isMobile ? { 
        scale: 1.02,
        y: -4,
        boxShadow: "0 12px 32px rgba(11, 92, 40, 0.2)",
        transition: { 
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1]
        }
      } : undefined}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <div
          style={{
            background: isProminent ? "rgba(255, 255, 255, 0.2)" : "rgba(11, 92, 40, 0.1)",
            borderRadius: "12px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Briefcase 
            size={24} 
            color={isProminent ? "white" : "#0b5c28"} 
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 600,
              margin: "0 0 8px 0",
              color: isProminent ? "white" : "#1e293b",
            }}
          >
            Become a ChorEscape Worker
          </h3>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              margin: "0 0 16px 0",
              color: isProminent ? "rgba(255, 255, 255, 0.9)" : "#64748b",
            }}
          >
            {variant === "subtle"
              ? "Earn on your schedule with flexible hours and competitive pay."
              : "Join our team of trusted professionals. Set your own hours, earn competitive pay, and make a difference in your community."}
          </p>
          {variant !== "subtle" && (
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <DollarSign 
                  size={16} 
                  color={isProminent ? "rgba(255, 255, 255, 0.8)" : "#0b5c28"} 
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: isProminent ? "rgba(255, 255, 255, 0.9)" : "#64748b",
                  }}
                >
                  Competitive Pay
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock 
                  size={16} 
                  color={isProminent ? "rgba(255, 255, 255, 0.8)" : "#0b5c28"} 
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: isProminent ? "rgba(255, 255, 255, 0.9)" : "#64748b",
                  }}
                >
                  Flexible Hours
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Users 
                  size={16} 
                  color={isProminent ? "rgba(255, 255, 255, 0.8)" : "#0b5c28"} 
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: isProminent ? "rgba(255, 255, 255, 0.9)" : "#64748b",
                  }}
                >
                  Supportive Team
                </span>
              </div>
            </div>
          )}
          <motion.button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              background: isProminent ? "white" : "#0b5c28",
              color: isProminent ? "#0b5c28" : "white",
              transition: "all 0.2s ease",
            }}
            whileHover={{ 
              background: isProminent ? "rgba(255, 255, 255, 0.95)" : "#094a20",
              transform: "translateX(2px)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            Learn More & Apply
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
