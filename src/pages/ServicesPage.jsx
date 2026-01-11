// src/pages/ServicesPage.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/page-wrapper.jsx";
import { PostChoreModal } from "../components/PostChoreModal.jsx";
import { ServiceDetailModal } from "../components/ServiceDetailModal.jsx";
import "../styles/services.page.css";
import "../styles/unified-page-layout.css";
import { IMAGES } from "../components/serviceImages";
import toast from "react-hot-toast";
import apiClient from "../lib/api.js";

import {
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export function ServicesPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("residential");
  const [postChoreModalOpen, setPostChoreModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  const isResidential = mode === "residential";

  const handleSeeMore = (service) => {
    setSelectedService(service);
    setServiceModalOpen(true);
  };

  const handleBookFromModal = () => {
    if (!selectedService) return;
    if (isResidential) {
      handleResidentialBook(selectedService.id || selectedService.slug, selectedService.title || selectedService.name);
    } else {
      handleCorporateQuote(selectedService.id || selectedService.slug, selectedService.title || selectedService.name);
    }
    setServiceModalOpen(false);
  };

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const type = isResidential ? "RESIDENTIAL" : "CORPORATE";
        const response = await apiClient.get(`/public/services?type=${type}`);
        setServices(response.data || []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast.error("Failed to load services. Please try again later.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [isResidential]);

const handleResidentialBook = (serviceId, title) => {
  navigate("/pricing-booking", {
    state: {
      preselectedService: serviceId,
      title,
    },
  });
};
const handleCorporateQuote = (serviceId, title) => {
  navigate("/request-quote", {
    state: {
      preselectedService: serviceId,
      title,
    },
  });
};


  return (
    <PageWrapper>
      <div className="unified-page">
        {/* HERO */}
        <motion.header 
          className="unified-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="unified-hero-content">
            <motion.div 
              className="unified-hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Sparkles size={14} />
              <span>Professional services for every need</span>
            </motion.div>

            <motion.h1 
              className="unified-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Our Services
            </motion.h1>

            <motion.p 
              className="unified-hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              One platform for everyday chores, seasonal work, and long-term
              partners — for homes and businesses.
            </motion.p>

            <motion.div 
              className="svc-toggle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                className={`svc-toggle-btn ${isResidential ? "active" : ""}`}
                onClick={() => setMode("residential")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                For Home
              </motion.button>
              <motion.button
                className={`svc-toggle-btn ${!isResidential ? "active" : ""}`}
                onClick={() => setMode("corporate")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                For Business
              </motion.button>
            </motion.div>

            <motion.p 
              className="svc-mode-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {isResidential
                ? "Residential services · Book online in a few taps."
                : "Corporate services · Request a custom quote."}
            </motion.p>
          </div>
        </motion.header>

        {/* GRID */}
        <div className="page-content-container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p>Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p>No services available at the moment.</p>
            </div>
          ) : (
             <div className="svc-grid">
             {services.map((card) => {
               return (
                 <article 
                 key={card.id} 
                 className="svc-card" 
                 onClick={() => handleSeeMore(card)}
                 style={{ 
                   cursor: "pointer",
                   background: "white",
                   borderRadius: "16px",
                   border: "1px solid rgba(11, 92, 40, 0.15)",
                   overflow: "hidden",
                   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                   transition: "all 0.3s ease",
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = "translateY(-4px)";
                   e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
                   e.currentTarget.style.borderColor = "rgba(11, 92, 40, 0.25)";
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = "translateY(0)";
                   e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                   e.currentTarget.style.borderColor = "rgba(11, 92, 40, 0.15)";
                 }}
                 >
                   {/* Image Section */}
                   <div 
                     className="svc-card-media" 
                     style={{ 
                       position: "relative",
                       width: "100%",
                       height: "240px",
                       overflow: "hidden",
                     }}
                   >
                     <img
                       src={card.image || card.imageUrl || IMAGES.cleaning}
                       alt={card.title || card.name}
                       style={{
                         width: "100%",
                         height: "100%",
                         objectFit: "cover",
                       }}
                       onError={(e) => {
                         e.target.src = IMAGES.cleaning;
                       }}
                     />
                     
                     {/* Price overlay in top-right */}
                     {card.basePrice && (
                       <div style={{
                         position: "absolute",
                         top: "12px",
                         right: "12px",
                         background: "rgba(255, 255, 255, 0.95)",
                         padding: "6px 12px",
                         borderRadius: "6px",
                         fontSize: "14px",
                         fontWeight: 700,
                         color: "#1a1a1a",
                         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                       }}>
                         ${card.basePrice.toFixed(0)}+
                       </div>
                     )}

                     {/* Trending badge */}
                     {card.isTrending && (
                       <div style={{
                         position: "absolute",
                         top: "12px",
                         left: "12px",
                         background: "var(--primary, #6366f1)",
                         color: "white",
                         padding: "6px 12px",
                         borderRadius: "6px",
                         fontSize: "12px",
                         fontWeight: 600,
                         display: "flex",
                         alignItems: "center",
                         gap: "4px",
                         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                       }}>
                         <TrendingUp size={12} />
                         Trending
                       </div>
                     )}
                   </div>

                   {/* Text Section */}
                   <div style={{
                     padding: "20px",
                     background: "white",
                   }}>
                     {/* Title */}
                     <h3 style={{
                       fontSize: "18px",
                       fontWeight: 700,
                       color: "#1a1a1a",
                       margin: "0 0 8px 0",
                       lineHeight: "1.3",
                     }}>
                       {card.title || card.name}
                     </h3>

                     {/* Starting Price */}
                     {card.basePrice && (
                       <p style={{
                         fontSize: "14px",
                         color: "#666",
                         margin: "0 0 16px 0",
                         fontWeight: 400,
                       }}>
                         Starting from ${card.basePrice.toFixed(2)}
                       </p>
                     )}

                     {/* View Details Link */}
                     <div style={{
                       display: "flex",
                       justifyContent: "flex-end",
                       alignItems: "center",
                       marginTop: "12px",
                     }}>
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleSeeMore(card);
                         }}
                         style={{
                           background: "none",
                           border: "none",
                           color: "#1a1a1a",
                           fontSize: "14px",
                           fontWeight: 500,
                           cursor: "pointer",
                           display: "flex",
                           alignItems: "center",
                           gap: "6px",
                           padding: "4px 0",
                           transition: "all 0.2s ease",
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.color = "var(--primary, #6366f1)";
                           e.currentTarget.style.gap = "8px";
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.color = "#1a1a1a";
                           e.currentTarget.style.gap = "6px";
                         }}
                       >
                         View Details
                         <ArrowRight size={16} />
                       </button>
                     </div>
                   </div>
                 </article>
               );
             })}
           </div>
          )}
        </div>

        {/* Post a Chore Section - Only for Residential */}
        {isResidential && (
          <section className="svc-custom-chore-section">
            <div className="page-content-container">
              <div className="svc-custom-chore-card" onClick={() => setPostChoreModalOpen(true)}>
                <div className="svc-custom-chore-left">
                  <div className="svc-custom-chore-icon">
                    <Sparkles size={24} />
                  </div>
                  <div className="svc-custom-chore-content">
                    <p className="svc-custom-eyebrow">Can't find what you're looking for?</p>
                    <h3 className="svc-custom-title">Post a Custom Chore</h3>
                    <p className="svc-custom-sub">
                      Tell us what you need — we'll match you with the right helper ASAP.
                    </p>
                  </div>
                </div>
                <button className="svc-custom-cta" onClick={(e) => { e.stopPropagation(); setPostChoreModalOpen(true); }}>
                  Post Your Chore <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ========== POST CHORE MODAL ========== */}
      <PostChoreModal 
        isOpen={postChoreModalOpen} 
        onClose={() => setPostChoreModalOpen(false)} 
      />

      {/* ========== SERVICE DETAIL MODAL ========== */}
      <ServiceDetailModal
        isOpen={serviceModalOpen}
        service={selectedService}
        onClose={() => {
          setServiceModalOpen(false);
          setSelectedService(null);
        }}
        onBook={handleBookFromModal}
        isResidential={isResidential}
      />
    </PageWrapper>
  );
}
