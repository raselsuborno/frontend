import React, { useEffect, useRef } from "react";
import { X, ArrowRight, Check, TrendingUp, DollarSign } from "lucide-react";

export function ServiceDetailModal({ isOpen, service, onClose, onBook, isResidential }) {
  const modalRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  return (
    <div 
      className="service-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        ref={modalRef}
        className="service-modal-container"
        style={{
          background: "var(--bg, #ffffff)",
          borderRadius: "24px",
          maxWidth: "1100px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          animation: "slideUp 0.3s ease-out",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(0, 0, 0, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Image Header */}
        <div
          style={{
            width: "100%",
            height: "250px",
            position: "relative",
            overflow: "hidden",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
          }}
        >
          <img
            src={service.image || service.imageUrl}
            alt={service.title || service.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1758273705627-937374bfa978?q=80&w=1200&auto=format&fit=crop";
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          {service.isTrending && (
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                background: "var(--primary, #6366f1)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <TrendingUp size={16} />
              Trending
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {/* Title and Price */}
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                marginBottom: "10px",
                color: "var(--text, #1a1a1a)",
                lineHeight: "1.2",
              }}
            >
              {service.title || service.name}
            </h2>
            {service.basePrice && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "6px",
                }}
              >
                <DollarSign size={18} style={{ color: "var(--primary, #6366f1)" }} />
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--primary, #6366f1)",
                  }}
                >
                  Starting from ${service.basePrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {service.description && (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "var(--text-secondary, #666)",
                }}
              >
                {service.description}
              </p>
            </div>
          )}

          {/* Sub-services */}
          {service.bullets && service.bullets.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "var(--text, #1a1a1a)",
                }}
              >
                What's included:
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "grid",
                  gap: "12px",
                }}
              >
                {service.bullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px",
                      background: "var(--bg-soft, #f8f9fa)",
                      borderRadius: "10px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--primary-soft, #eef2ff)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--bg-soft, #f8f9fa)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <Check
                      size={18}
                      style={{
                        color: "var(--primary, #6366f1)",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: "var(--text, #1a1a1a)",
                      }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-subtle, #e5e7eb)",
            }}
          >
            {isResidential ? (
              <button
                onClick={onBook}
                style={{
                  flex: 1,
                  background: "var(--primary, #6366f1)",
                  color: "white",
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary-hover, #4f46e5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(99, 102, 241, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--primary, #6366f1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Book this service
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={onBook}
                style={{
                  flex: 1,
                  background: "transparent",
                  color: "var(--primary, #6366f1)",
                  border: "2px solid var(--primary, #6366f1)",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary-soft, #eef2ff)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Request a quote
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .service-modal-container::-webkit-scrollbar {
            display: none;
            width: 0;
          }

          .service-modal-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}
