import React from "react";

export function LoadingSpinner({ size = 24, className = "" }) {
  return (
    <div
      className={`loading-spinner ${className}`}
      style={{
        width: size,
        height: size,
        border: `${size / 8}px solid var(--border-subtle)`,
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}

export function LoadingOverlay({ children, isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div style={{ textAlign: "center", color: "white" }}>
        {children || <LoadingSpinner size={48} />}
      </div>
    </div>
  );
}


