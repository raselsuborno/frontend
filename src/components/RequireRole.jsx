import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

/**
 * RequireRole - Route protection component
 * 
 * Blocks access if user's role is not in allowedRoles array.
 * Redirects to home page if unauthorized.
 * 
 * Usage:
 *   <Route path="/admin/*" element={
 *     <RequireRole allowedRoles={["admin"]}>
 *       <AdminDashboardPage />
 *     </RequireRole>
 *   } />
 * 
 * Role values (normalized to uppercase):
 * - "CUSTOMER" (default)
 * - "WORKER" (future)
 * - "ADMIN" (future)
 */
export function RequireRole({ children, allowedRoles }) {
  const { role, loading } = useAuth();
  const location = useLocation();

  // Show nothing while loading (prevents flash of wrong content)
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh" 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Normalize allowed roles to uppercase
  const normalizedAllowedRoles = Array.isArray(allowedRoles)
    ? allowedRoles.map(r => r.toUpperCase())
    : [allowedRoles.toUpperCase()];

  // Check if user's role is allowed
  const hasAccess = role && normalizedAllowedRoles.includes(role);

  if (!hasAccess) {
    // Redirect to home page if unauthorized
    // No infinite loop risk: home page doesn't require role
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // User has required role - render children
  return <>{children}</>;
}


