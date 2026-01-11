import React from "react";

/**
 * Badge Component
 * 
 * Status variants: pending, approved, cancelled, success, warning, danger
 * 
 * @param {string} variant - 'pending' | 'approved' | 'cancelled' | 'success' | 'warning' | 'danger' | 'default'
 * @param {React.ReactNode} children - Badge content
 * @param {string} className - Additional classes
 */
export function Badge({
  variant = "default",
  children,
  className = "",
  ...props
}) {
  const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium";
  
  const variants = {
    default: "bg-[var(--ce-bg)] text-[var(--ce-text)] border border-[var(--ce-border)]",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    approved: "bg-[var(--ce-primary-soft)] text-[var(--ce-primary)] border border-[var(--ce-primary)]/20",
    cancelled: "bg-gray-50 text-[var(--ce-muted)] border border-[var(--ce-border)]",
    success: "bg-emerald-50 text-[var(--ce-success)] border border-emerald-200",
    warning: "bg-amber-50 text-[var(--ce-warning)] border border-amber-200",
    danger: "bg-red-50 text-[var(--ce-danger)] border border-red-200",
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${className}`;
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
