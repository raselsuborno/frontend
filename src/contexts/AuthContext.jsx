import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../lib/api.js";
import { supabase } from "../lib/supabase.js";

/**
 * AuthContext - Provides authentication state and user profile
 * 
 * Uses Supabase as SINGLE SOURCE OF TRUTH for authentication.
 * - Session is loaded from Supabase on mount
 * - Listens to Supabase auth state changes
 * - Profile is loaded from backend API using Supabase session token
 * 
 * Exposes:
 * - user: Supabase user object
 * - session: Supabase session object (includes access_token)
 * - profile: User profile from database (includes role)
 * - role: Derived from profile.role (CUSTOMER, WORKER, ADMIN)
 * - loading: Loading state for auth/profile
 * - logout: Function to sign out
 * - refreshProfile: Function to reload profile from API
 * 
 * Role values:
 * - "CUSTOMER" (default for all new signups)
 * - "WORKER" (set after admin approval)
 * - "ADMIN" (set manually in database)
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from Supabase (single source of truth)
  const loadSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("[AuthContext] Error loading session:", error);
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error("[AuthContext] Error loading session:", error);
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Load profile from API using Supabase session token
  const loadProfile = async () => {
    if (!session || !session.access_token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get("/api/profile/me");
      setProfile(response.data);
    } catch (error) {
      console.error("[AuthContext] Error loading profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial session load
  useEffect(() => {
    loadSession();
  }, []);

  // Load profile when session changes
  useEffect(() => {
    if (session?.access_token) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [session]);

  // Subscribe to Supabase auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] Auth state changed:", event);
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.access_token) {
        // Session exists - load profile
        await loadProfile();
      } else {
        // No session - clear profile
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // State will be cleared by onAuthStateChange listener
    } catch (error) {
      console.error("[AuthContext] Error logging out:", error);
    }
  };

  // Refresh profile manually
  const refreshProfile = async () => {
    await loadProfile();
  };

  // Derive role from profile (normalize to uppercase)
  const role = profile?.role?.toUpperCase() || null;

  const value = {
    user,
    session,
    profile,
    role, // "CUSTOMER" | "WORKER" | "ADMIN" | null
    loading,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

