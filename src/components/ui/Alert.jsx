import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Alert({
  variant = "info",
  title,
  children,
  onClose,
  className = "",
}) {
  const Icon = icons[variant];

  return (
    <div className={`alert alert-${variant} ${className}`}>
      {Icon && <Icon size={20} style={{ flexShrink: 0, marginTop: "2px" }} />}
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: "block", marginBottom: "4px" }}>{title}</strong>}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            color: "inherit",
            opacity: 0.7,
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}


