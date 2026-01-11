import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Button Component
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'destructive'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} children - Button content
 * @param {object} props - All other button props
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  className = "",
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--ce-primary)] text-white hover:bg-[var(--ce-primary-hover)] active:scale-[0.98]",
    secondary: "bg-transparent border border-[var(--ce-border)] text-[var(--ce-text)] hover:bg-[var(--ce-primary-soft)] hover:border-[var(--ce-primary)]",
    ghost: "bg-transparent text-[var(--ce-text)] hover:bg-[var(--ce-bg)]",
    destructive: "bg-[var(--ce-danger)] text-white hover:opacity-90 active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm rounded-[var(--ce-radius-btn)]",
    md: "h-10 px-4 text-base rounded-[var(--ce-radius-btn)]",
    lg: "h-12 px-6 text-base rounded-[var(--ce-radius-btn)]"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

