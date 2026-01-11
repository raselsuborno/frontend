import React from "react";

/**
 * Input Component
 * 
 * @param {string} label - Label text
 * @param {string} error - Error message
 * @param {string} helperText - Helper text below input
 * @param {React.ReactNode} icon - Icon component (rendered on left)
 * @param {string} className - Additional classes
 * @param {object} props - All other input props
 */
export function Input({
  label,
  error,
  helperText,
  icon,
  className = "",
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const inputClasses = `
    w-full h-10 px-4
    ${icon ? 'pl-10' : ''}
    bg-[var(--ce-surface)] 
    border rounded-[var(--ce-radius-btn)]
    text-[var(--ce-text)]
    placeholder:text-[var(--ce-muted)]
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--ce-primary)] focus:ring-offset-0
    ${hasError 
      ? 'border-[var(--ce-danger)] focus:ring-[var(--ce-danger)]' 
      : 'border-[var(--ce-border)] hover:border-[var(--ce-primary)]/50'
    }
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--ce-text)] mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ce-muted)] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-[var(--ce-danger)]">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-[var(--ce-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea Component
 */
export function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;
  
  const textareaClasses = `
    w-full min-h-[120px] px-4 py-3
    bg-[var(--ce-surface)] 
    border rounded-[var(--ce-radius-btn)]
    text-[var(--ce-text)]
    placeholder:text-[var(--ce-muted)]
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[var(--ce-primary)] focus:ring-offset-0
    resize-y
    ${hasError 
      ? 'border-[var(--ce-danger)] focus:ring-[var(--ce-danger)]' 
      : 'border-[var(--ce-border)] hover:border-[var(--ce-primary)]/50'
    }
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-[var(--ce-text)] mb-2"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-[var(--ce-danger)]">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-[var(--ce-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}

