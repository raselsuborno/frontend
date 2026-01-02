import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, allowedRoles = [], requireAuth = true }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Show spinner while loading
  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "16px"
      }}>
        <Loader2 className="animate-spin" size={48} style={{ color: "#3b82f6" }} />
        <p style={{ color: "#6b7280" }}>Loading...</p>
      </div>
    );
  }

  // If auth required but not logged in
  if (requireAuth && !user) {
    const pathname = location.pathname;
    let message = "Please log in to continue";
    
    if (pathname.startsWith("/admin")) {
      message = "Admin login for ChorEscape";
    } else if (pathname.startsWith("/worker")) {
      message = "Worker login for ChorEscape";
    }

    return (
      <Navigate
        to="/auth"
        state={{ message, returnTo: pathname }}
        replace
      />
    );
  }

  // If role required but wrong role
  if (allowedRoles.length > 0 && role) {
    const normalizedRole = role.toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());
    
    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      // For /worker route, if CUSTOMER, allow access (will show application status)
      if (location.pathname.startsWith("/worker") && normalizedRole === 'CUSTOMER') {
        return children;
      }
      // For /admin, always redirect to dashboard if not admin
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

