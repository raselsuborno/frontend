# Quick Fix: Cloudflare Pages Supabase Connection Issue

## Problem
Your Cloudflare Pages deployment isn't fetching data from Supabase because environment variables are not configured.

## Solution
You need to add environment variables in Cloudflare Pages dashboard.

## Quick Steps

### 1. Get Your Supabase Credentials
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Go to **Settings** > **API**
- Copy:
  - **Project URL** → Use for `VITE_SUPABASE_URL`
  - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

### 2. Get Your Backend API URL
- **This is NOT the Supabase URL!**
- This is your separate backend/API server URL
- Examples:
  - `https://your-backend.vercel.app`
  - `https://your-api.railway.app`
  - `https://api.yourdomain.com`
- If you don't have a separate backend, you may need to create one or use a different architecture

### 3. Set Variables in Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages** > **Pages**
2. Click on your project (`frontend-1np`)
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Add these three variables:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_API_BASE_URL` | **Your backend API URL** (NOT Supabase!) | `https://your-api.vercel.app` |

**⚠️ CRITICAL**: 
- `VITE_API_BASE_URL` must be your **backend API server URL**, NOT the Supabase URL
- Setting it to the Supabase URL will cause CORS errors and API calls will fail
- Set environment to **Production** (and Preview if needed)
- Variable names must match exactly (case-sensitive)

### 4. Redeploy
- Go to **Deployments** tab
- Click **Retry deployment** on the latest deployment
- OR push a new commit to trigger automatic deployment

### 5. Verify
- Open `https://frontend-1np.pages.dev`
- Open browser console (F12)
- Should NOT see errors about missing environment variables
- Check Network tab - API requests should go to your backend URL, not Supabase
- Try logging in or using features that require Supabase

## Troubleshooting CORS Errors

If you see CORS errors like:
```
Access to XMLHttpRequest at 'https://xxx.supabase.co/api/profile/me' has been blocked
```

This means `VITE_API_BASE_URL` is set to your Supabase URL instead of your backend API URL.

**Fix:**
1. Go to Cloudflare Pages → Settings → Environment Variables
2. Update `VITE_API_BASE_URL` to your backend API URL (NOT Supabase URL)
3. Make sure your backend API has CORS configured to allow requests from `https://*.pages.dev`
4. Redeploy

See `CORS_FIX.md` for detailed CORS troubleshooting steps.

## Why This Happens

Vite requires environment variables to be prefixed with `VITE_` to be exposed to client-side code. These variables are embedded into your JavaScript bundle at **build time**, not runtime. This means:

1. ✅ Variables must be set in Cloudflare Pages **before** deployment
2. ✅ After adding variables, you **must redeploy**
3. ❌ Old deployments don't have access to newly added variables

## Code Changes Made

I've updated the code to provide better error messages when environment variables are missing. The console will now show helpful setup instructions if variables are not configured.

See `CLOUDFLARE_SETUP.md` for detailed instructions.
