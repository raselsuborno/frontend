# Fixing CORS Error: API URL Configuration Issue

## Problem

You're seeing this error:
```
Access to XMLHttpRequest at 'https://xxsyfxxeqjkicqlmvwbx.supabase.co/api/profile/me' 
from origin 'https://b2c52c96.frontend-1np.pages.dev' has been blocked by CORS policy
```

This means your `VITE_API_BASE_URL` is incorrectly set to your **Supabase URL** instead of your **backend API URL**.

## Root Cause

The app is trying to call your backend API at `/api/profile/me`, but because `VITE_API_BASE_URL` is set to the Supabase URL, it's making the request to:
```
https://xxsyfxxeqjkicqlmvwbx.supabase.co/api/profile/me
```

Supabase doesn't have this endpoint and doesn't allow CORS from your domain, causing the error.

## Solution

### Step 1: Identify Your Backend API URL

You need to have a **separate backend API server** that handles endpoints like:
- `/api/profile/me`
- `/api/bookings/mine`
- `/api/chores`
- etc.

**If you don't have a backend API yet:**
- You need to create one (Node.js/Express, Python/Flask, etc.)
- Deploy it (Vercel, Railway, Render, etc.)
- Then use that URL for `VITE_API_BASE_URL`

### Step 2: Update Cloudflare Environment Variables

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** > **Pages** > Your project
3. Click **Settings** → **Environment Variables**
4. Find `VITE_API_BASE_URL` and update it to your **backend API URL** (NOT Supabase URL)

**Correct setup:**
```
VITE_SUPABASE_URL = https://xxsyfxxeqjkicqlmvwbx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIs...
VITE_API_BASE_URL = https://your-backend-api.vercel.app  ← Your backend API
```

**Wrong setup (causes CORS error):**
```
VITE_API_BASE_URL = https://xxsyfxxeqjkicqlmvwbx.supabase.co  ← ❌ This is wrong!
```

### Step 3: Configure CORS on Your Backend

Your backend API must allow requests from your Cloudflare Pages domain.

**Example for Node.js/Express:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://frontend-1np.pages.dev',
    'https://*.pages.dev',  // Allow all Cloudflare Pages previews
    'http://localhost:5173'  // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Example for Python/Flask:**
```python
from flask_cors import CORS

CORS(app, origins=[
    'https://frontend-1np.pages.dev',
    'https://*.pages.dev',
    'http://localhost:5173'
], supports_credentials=True)
```

### Step 4: Redeploy

After updating environment variables:
1. Go to **Deployments** tab in Cloudflare Pages
2. Click **Retry deployment** on the latest deployment
3. Or push a new commit to trigger automatic deployment

### Step 5: Verify

1. Open your site: `https://frontend-1np.pages.dev`
2. Open DevTools (F12) → Console
3. Should NOT see CORS errors
4. Check Network tab - API requests should go to your backend URL, not Supabase

## Architecture Overview

```
┌─────────────────────┐
│  Cloudflare Pages   │
│  (Frontend)         │
│                     │
│  VITE_SUPABASE_URL  │──────┐
│  VITE_SUPABASE_ANON │      │
│  VITE_API_BASE_URL  │      │
└─────────────────────┘      │
                             │
        ┌────────────────────┴──────────────┐
        │                                   │
        ▼                                   ▼
┌──────────────────┐              ┌──────────────────┐
│   Supabase       │              │   Backend API    │
│                  │              │                  │
│  - Auth          │              │  - /api/profile  │
│  - Database      │              │  - /api/bookings │
│  - Storage       │              │  - /api/chores   │
└──────────────────┘              └──────────────────┘
```

- **Supabase**: Handles authentication and database
- **Backend API**: Handles business logic, custom endpoints, data processing
- **Frontend**: Uses both - Supabase for auth, Backend API for data operations

## Still Having Issues?

1. **Check browser console** for the exact error message
2. **Check Network tab** to see where requests are being sent
3. **Verify backend is running** and accessible
4. **Test backend API directly** using curl or Postman:
   ```bash
   curl https://your-backend-api.vercel.app/api/profile/me \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
5. **Check backend logs** for CORS or other errors
