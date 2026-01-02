import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs({ items }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "24px",
        fontSize: "14px",
      }}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          color: "var(--text-soft)",
          textDecoration: "none",
        }}
      >
        <Home size={16} />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} style={{ color: "var(--text-soft)" }} />
          {item.href ? (
            <Link
              to={item.href}
              style={{
                color: index === items.length - 1 ? "var(--text-main)" : "var(--text-soft)",
                textDecoration: "none",
                fontWeight: index === items.length - 1 ? 500 : 400,
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                color: "var(--text-main)",
                fontWeight: 500,
              }}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}


