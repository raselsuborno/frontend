import React from "react";

/**
 * Card Component
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional classes
 * @param {object} props - All other div props
 */
export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-[var(--ce-surface)] border border-[var(--ce-border)] rounded-[var(--ce-radius-card)] shadow-[var(--ce-shadow-card)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader Component
 * 
 * @param {React.ReactNode} children - Header content
 * @param {string} className - Additional classes
 */
export function CardHeader({ children, className = "", ...props }) {
  return (
    <div
      className={`px-6 pt-6 pb-4 border-b border-[var(--ce-border)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardContent Component
 * 
 * @param {React.ReactNode} children - Content
 * @param {string} className - Additional classes
 */
export function CardContent({ children, className = "", ...props }) {
  return (
    <div
      className={`px-6 py-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardFooter Component
 * 
 * @param {React.ReactNode} children - Footer content
 * @param {string} className - Additional classes
 */
export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`px-6 pt-4 pb-6 border-t border-[var(--ce-border)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

