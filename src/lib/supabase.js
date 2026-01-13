import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables with better error messaging
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  const errorMsg = `❌ Missing Supabase environment variables: ${missingVars.join(', ')}\n\n` +
    `Please set these in your Cloudflare Pages dashboard:\n` +
    `1. Go to your Cloudflare Pages project\n` +
    `2. Navigate to Settings > Environment Variables\n` +
    `3. Add the following variables:\n` +
    `   - VITE_SUPABASE_URL: Your Supabase project URL\n` +
    `   - VITE_SUPABASE_ANON_KEY: Your Supabase anon/public key\n\n` +
    `After adding variables, trigger a new deployment.`;
  
  console.error(errorMsg);
  
  // In production, also show an alert to help with debugging
  if (import.meta.env.PROD) {
    console.warn('⚠️ Supabase client will not work without environment variables. Check the console for setup instructions.');
  }
}

// Create and export Supabase client (will fail gracefully if vars are missing)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);


