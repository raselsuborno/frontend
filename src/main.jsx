import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

/* ============================================================
   STYLES — Consolidated Enterprise Architecture
   =========================================================== */

// 1. Design Tokens (Single Source of Truth)
import "./styles/tokens.css";

// 2. Tailwind CSS
import "./styles/tailwind.css";

// 3. Base & Global Styles
import "./styles/globals.css";
import "./styles/typography.css";
import "./styles/layout.css";
import "./styles/utilities.css";

// 4. Component Styles (Consolidated)
import "./styles/components/index.css"; // Imports button, card, form, table, etc.

// 5. Global Layout Systems
import "./styles/global-unified.css";
import "./styles/global-edge-to-edge.css";
import "./styles/mobile-enhancements.css";

// 6. Legacy Theme (for backward compatibility - contains page-specific styles)
import "./theme.css";

// 7. Page-Specific Styles (Layout Only)
import "./styles/contact-unified.css";
import "./styles/components/navbar-enhanced.css";
import "./styles/dashboard-enhanced.css";
import "./styles/dashboard-unified.css";
import "./styles/home.css";
import "./styles/services.page.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
