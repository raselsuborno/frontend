import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SearchBar({ placeholder = "Search services...", onSearch, className = "" }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate("/services", { state: { searchQuery: query.trim() } });
      }
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Search
          size={20}
          style={{
            position: "absolute",
            left: "16px",
            color: "var(--text-soft)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "14px 16px 14px 48px",
            border: "1.5px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            fontSize: "16px",
            background: "var(--bg-soft)",
            color: "var(--text-main)",
            transition: "all var(--transition-fast)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--primary)";
            e.target.style.boxShadow = "0 0 0 3px var(--primary-soft)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-subtle)";
            e.target.style.boxShadow = "none";
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            style={{
              position: "absolute",
              right: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-soft)",
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
}


