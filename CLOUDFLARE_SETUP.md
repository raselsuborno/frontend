# Cloudflare Pages Deployment Setup

This guide will help you configure environment variables for your Cloudflare Pages deployment so that Supabase and API calls work correctly.

## Required Environment Variables

Your application requires the following environment variables to be set in Cloudflare Pages:

### 1. VITE_SUPABASE_URL
- **Description**: Your Supabase project URL
- **Example**: `https://xxxxxxxxxxxxx.supabase.co`
- **Where to find**: 
  - Go to your Supabase dashboard
  - Navigate to Project Settings > API
  - Copy the "Project URL" value

### 2. VITE_SUPABASE_ANON_KEY
- **Description**: Your Supabase anonymous/public key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**:
  - Go to your Supabase dashboard
  - Navigate to Project Settings > API
  - Copy the "anon" or "public" key value

### 3. VITE_API_BASE_URL
- **Description**: Your backend API base URL
- **Example**: `https://your-api-domain.com` or `https://your-backend.vercel.app`
- **Where to find**: 
  - This is the URL of your backend/API server
  - If using a relative path, you can set it to an empty string or use a proxy

## How to Set Environment Variables in Cloudflare Pages

1. **Log into Cloudflare Dashboard**
   - Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Workers & Pages** > **Pages**

2. **Select Your Project**
   - Click on your frontend project (the one deployed at `frontend-1np.pages.dev`)

3. **Go to Settings**
   - Click on the **Settings** tab in your project dashboard

4. **Navigate to Environment Variables**
   - In the left sidebar, click on **Environment Variables**

5. **Add Variables**
   - Click **Add variable** for each required variable
   - For each variable:
     - **Variable name**: Enter exactly (case-sensitive):
       - `VITE_SUPABASE_URL`
       - `VITE_SUPABASE_ANON_KEY`
       - `VITE_API_BASE_URL`
     - **Value**: Enter your actual values
     - **Environment**: Select **Production** (and optionally Preview/Production)

6. **Redeploy**
   - After adding all variables, you need to trigger a new deployment
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest deployment, or push a new commit to trigger automatic deployment

## Verification

After setting the environment variables and redeploying:

1. Open your deployed site: `https://frontend-1np.pages.dev`
2. Open browser DevTools (F12) > Console
3. Check for any error messages about missing environment variables
4. Try logging in or making an API call to verify everything works

## Troubleshooting

### Still not working after setting variables?

1. **Ensure variables are set for Production environment**
   - Check that you selected "Production" when adding variables

2. **Redeploy after adding variables**
   - Environment variables are only available to new deployments
   - Old deployments won't have access to newly added variables

3. **Check variable names are exact**
   - Must be exactly: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`
   - Case-sensitive, no typos

4. **Verify values are correct**
   - Double-check that you copied the full URL/key values
   - No extra spaces or line breaks

5. **Check browser console**
   - Open DevTools > Console
   - Look for error messages about missing environment variables

### Local Development

For local development, create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=https://your-api-domain.com
```

**Note**: The `.env` file is already in `.gitignore` and won't be committed to the repository.

## Security Notes

- **Never commit** `.env` files or environment variable values to git
- The `VITE_SUPABASE_ANON_KEY` is safe to expose in client-side code (it's designed for public use)
- Never expose your Supabase **service_role** key in client-side code
- Keep your backend API keys secure and never expose them to the client
