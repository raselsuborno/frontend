import React, { useState } from "react";

export function Tooltip({ children, text, position = "top" }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!text) return children;

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className="tooltip"
          style={{
            bottom: position === "top" ? "100%" : "auto",
            top: position === "bottom" ? "100%" : "auto",
            marginBottom: position === "top" ? "4px" : "0",
            marginTop: position === "bottom" ? "4px" : "0",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}


