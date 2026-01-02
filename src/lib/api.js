import axios from "axios";
import { supabase } from "./supabase";

/**
 * API Client
 * 
 * Uses Supabase session as SINGLE SOURCE OF TRUTH for authentication.
 * Always gets the current session from Supabase (never localStorage).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  // Always get token from Supabase session (single source of truth)
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    // If getSession fails, continue without token
    console.warn("[API] Could not get session:", error.message);
  }

  return config;
});

export default api;
