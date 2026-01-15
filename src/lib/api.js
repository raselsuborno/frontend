import axios from "axios";
import { supabase } from "./supabase";

/**
 * API Client
 * 
 * Uses Supabase session as SINGLE SOURCE OF TRUTH for authentication.
 * Always gets the current session from Supabase (never localStorage).
 */
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Validate API base URL - should NOT be Supabase URL
if (!apiBaseUrl) {
  console.warn('⚠️ VITE_API_BASE_URL is not set. API calls may fail.');
  console.warn('   Set VITE_API_BASE_URL to your backend API URL (not Supabase URL)');
} else if (apiBaseUrl.includes('supabase.co')) {
  console.error('❌ ERROR: VITE_API_BASE_URL is set to Supabase URL, but it should be your backend API URL!');
  console.error('   Current value:', apiBaseUrl);
  console.error('   Set VITE_API_BASE_URL to your backend API URL (e.g., https://your-api.vercel.app)');
}

const api = axios.create({
  baseURL: apiBaseUrl || '/api',
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
