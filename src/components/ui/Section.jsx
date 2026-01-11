import React from "react";

/**
 * Section Component
 * 
 * Vertical spacing: 48-72px on desktop, responsive on mobile
 * 
 * @param {React.ReactNode} children - Section content
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} className - Additional classes
 * @param {object} props - All other section props
 */
export function Section({
  children,
  size = "md",
  className = "",
  ...props
}) {
  const sizes = {
    sm: "py-8 md:py-12",      // 32px / 48px
    md: "py-12 md:py-16",     // 48px / 64px
    lg: "py-16 md:py-20",     // 64px / 80px
    xl: "py-20 md:py-24",     // 80px / 96px
  };
  
  return (
    <section
      className={`${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

