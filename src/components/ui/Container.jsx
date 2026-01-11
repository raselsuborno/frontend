import React from "react";

/**
 * Container Component
 * 
 * Responsive container with max-width 1280px and responsive padding
 * 
 * @param {React.ReactNode} children - Content
 * @param {string} className - Additional classes
 * @param {object} props - All other div props
 */
export function Container({ children, className = "", ...props }) {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

