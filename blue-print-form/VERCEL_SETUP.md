# Vercel Deployment Setup

## Environment Variables Required

After deploying to Vercel, you MUST add these environment variables in the Vercel dashboard:

### How to Add Environment Variables:

1. Go to https://vercel.com/dashboard
2. Select your `IT-blueprint-v2` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable below:

### Required Variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MONGO_URI` | `mongodb+srv://kishansingh:t1hlngA8bOT6wYeo@kishankart.4eveq.mongodb.net/blueprint` | Your MongoDB connection string |
| `JWT_SECRET` | `supersecretkey123` | Secret key for JWT tokens |
| `BCRYPT_SALT_ROUNDS` | `12` | Number of salt rounds for password hashing |
| `NEXT_PUBLIC_BACKEND_URL` | `https://YOUR-VERCEL-URL.vercel.app` | **IMPORTANT:** Replace with your actual Vercel deployment URL |

### Important Notes:

- ✅ Check **Production**, **Preview**, and **Development** for all variables
- ✅ For `NEXT_PUBLIC_BACKEND_URL`, use your actual Vercel URL (e.g., `https://it-blueprint-v2.vercel.app`)
- ✅ After adding variables, **redeploy** your application

### To Redeploy:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**

## Local Development

For local development, copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values.

## Troubleshooting

### Issue: "Something went wrong" on login

**Cause:** Environment variables not set in Vercel

**Solution:** Follow the steps above to add environment variables

### Issue: API calls failing

**Cause:** `NEXT_PUBLIC_BACKEND_URL` pointing to localhost

**Solution:** Update `NEXT_PUBLIC_BACKEND_URL` in Vercel to your actual deployment URL

### Issue: Database connection failed

**Cause:** MongoDB URI missing database name or incorrect credentials

**Solution:** Ensure MONGO_URI includes `/blueprint` at the end
