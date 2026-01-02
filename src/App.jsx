import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Components
import { Navbar } from "./components/navbar.jsx";
import { Footer } from "./components/footer.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";


// Pages
import { HomePage } from "./pages/HomePage.jsx";
import { ServicesPage } from "./pages/ServicesPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { PricingBookingPage } from "./pages/PricingBookingPage.jsx";
import CorporateQuotePage from "./pages/CorporateQuotePage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";
import { PostChorePage } from "./pages/PostChorePage.jsx";
import { MyChoresPage } from "./pages/MyChoresPage.jsx";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
import { WorkerDashboardPage } from "./pages/WorkerDashboardPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { CareersPage } from "./pages/CareersPage.jsx";

import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ProfileEditPage } from "./pages/ProfileEditPage.jsx";
import { WorkerApplicationPage } from "./pages/WorkerApplicationPage.jsx";

// Auth
import { AuthPage } from "./pages/AuthPage.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.jsx";

// ---------------------------
// App Content Component
// ---------------------------
function AppContent() {
  const location = useLocation();

  // Hide navbar on login/reset pages
  const hideNavbar =
    location.pathname === "/auth" ||
    location.pathname.startsWith("/reset-password");
  
  // Show navbar on admin/worker pages but with limited nav items
  const isAdminOrWorkerPage = location.pathname.startsWith("/admin") || location.pathname.startsWith("/worker");

  return (
    <AuthProvider>
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
          <Route path="/request-quote" element={<CorporateQuotePage />} />
          <Route path="/shop" element={<ShopPage />} />
        <Route path="/post-chore" element={<PostChorePage />} />
        <Route path="/my-chores" element={<MyChoresPage />} />
        
          {/* Admin & Worker Portals */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          {/* Worker Dashboard */}
          <Route 
            path="/worker" 
            element={
              <ProtectedRoute allowedRoles={["worker", "admin"]}>
                <WorkerDashboardPage />
              </ProtectedRoute>
            } 
          />
        
          <Route path="/cart" element={<CartPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/apply/worker" element={<WorkerApplicationPage />} />

          {/* Auth System */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* User Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAuth={true}>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
        </Routes>
      </div>

      {/* ======= MODERN FOOTER ======= */}
      {!hideNavbar && <Footer />}
      </div>
    </AuthProvider>
  );
}


// ---------------------------
// Main App Export
// ---------------------------
export default function App() {
  return <AppContent />;
}
