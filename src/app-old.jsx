import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import { Navbar } from "./components/navbar.jsx";


// Pages
import { HomePage } from "./pages/HomePage.jsx";
import { ServicesPage } from "./pages/ServicesPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { PricingBookingPage } from "./pages/PricingBookingPage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";
import { PostChorePage } from "./pages/PostChorePage.jsx";
import { MyChoresPage } from "./pages/MyChoresPage.jsx";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { CareersPage } from "./pages/CareersPage.jsx";

import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ProfileEditPage } from "./pages/ProfileEditPage.jsx";

// Auth
import { AuthPage } from "./pages/AuthPage.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.jsx";

// API Base
export const API_BASE = "http://localhost:5001";



// ---------------------------
// App Content Component
// ---------------------------
function AppContent() {
  const location = useLocation();

  // Hide navbar on login/reset pages
  const hideNavbar =
    location.pathname === "/auth" ||
    location.pathname.startsWith("/reset-password");

  return (
    <div className="page-wrapper">
      <Toaster position="top-right" />

      {/* Main layout content pushed above footer */}
      <div className="layout">
        {!hideNavbar && <Navbar />}
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing-booking" element={<PricingBookingPage />} />
          <Route path="/shop" element={<ShopPage />} />
        <Route path="/post-chore" element={<PostChorePage />} />
        <Route path="/my-chores" element={<MyChoresPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/careers" element={<CareersPage />} />

          {/* Auth System */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
        </Routes>
      </div>


      {/* ======= FOOTER STAYS AT BOTTOM ALWAYS ======= */}
<footer className="footer">
  <hr className="footer-line" />
  <p>
    © {new Date().getFullYear()} <strong>ChoreBunny</strong>. All rights reserved.
  </p>
</footer>
    </div>
  );
}


// ---------------------------
// Main App Export
// ---------------------------
export default function App() {
  return <AppContent />;
}
