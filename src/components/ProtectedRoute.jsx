import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Loader2 } from "lucide-react";
import { NotAuthorized } from "./ui/NotAuthorized.jsx";

export function ProtectedRoute({ children, allowedRoles = [], requireAuth = true }) {
  const { user, role, loading, session } = useAuth();
  const location = useLocation();

  // Show spinner while loading - wait for auth context to finish loading session
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
        <Loader2 className="animate-spin" size={48} style={{ color: "var(--ce-primary)" }} />
        <p style={{ color: "var(--ce-muted)" }}>Loading...</p>
      </div>
    );
  }

  // If auth required but not logged in - only redirect if loading is complete AND no session/user
  // This ensures we don't redirect while Supabase is still loading the session on reload
  if (requireAuth && !loading && !session && !user) {
    const pathname = location.pathname;
    let message = "Please log in to continue";
    
    if (pathname.startsWith("/admin")) {
      message = "Admin login required";
    } else if (pathname.startsWith("/worker")) {
      message = "Worker login required";
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
      // Show "Not Authorized" page instead of redirecting
      return (
        <NotAuthorized 
          role={normalizedRole} 
          requiredRole={normalizedAllowedRoles.join(" or ")}
        />
      );
    }
  }

  return children;
}

