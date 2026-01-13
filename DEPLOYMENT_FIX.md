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

### 2. Set Variables in Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Workers & Pages** > **Pages**
2. Click on your project (`frontend-1np`)
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Add these three variables:

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_API_BASE_URL` | Your backend API URL (e.g., `https://your-api.vercel.app`) |

**Important**: 
- Set environment to **Production** (and Preview if needed)
- Variable names must match exactly (case-sensitive)

### 3. Redeploy
- Go to **Deployments** tab
- Click **Retry deployment** on the latest deployment
- OR push a new commit to trigger automatic deployment

### 4. Verify
- Open `https://frontend-1np.pages.dev`
- Open browser console (F12)
- Should NOT see errors about missing environment variables
- Try logging in or using features that require Supabase

## Why This Happens

Vite requires environment variables to be prefixed with `VITE_` to be exposed to client-side code. These variables are embedded into your JavaScript bundle at **build time**, not runtime. This means:

1. ✅ Variables must be set in Cloudflare Pages **before** deployment
2. ✅ After adding variables, you **must redeploy**
3. ❌ Old deployments don't have access to newly added variables

## Code Changes Made

I've updated the code to provide better error messages when environment variables are missing. The console will now show helpful setup instructions if variables are not configured.

See `CLOUDFLARE_SETUP.md` for detailed instructions.
