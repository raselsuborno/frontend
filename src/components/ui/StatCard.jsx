import React from "react";

export function StatCard({ icon: Icon, label, value, trend, onClick, className = "" }) {
  const content = (
    <div className={`stat-card ${onClick ? "card-interactive" : ""} ${className}`}>
      {Icon && (
        <div className="stat-icon">
          <Icon size={24} />
        </div>
      )}
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "13px",
            color: trend > 0 ? "var(--success)" : "var(--error)",
          }}
        >
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        {content}
      </button>
    );
  }

  return content;
}

