# Frontend Environment Variables - Vercel Configuration

This document outlines all environment variables required for the Arch Project frontend deployment on Vercel.

## Required Environment Variables

### Clerk Authentication (Production)

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_PLACEHOLDER_KEY
CLERK_SECRET_KEY=sk_live_PLACEHOLDER_KEY
```

**Setup Steps:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to your production instance
3. Add your Vercel domain to "Allowed domains":
   - `arch-project-git-main-andy01hbs-projects.vercel.app`
   - Or your custom domain
4. Copy the production API keys from the API Keys section
5. Add them to Vercel environment variables

### Backend API

```env
NEXT_PUBLIC_API_URL=https://arch-backend-90c5.onrender.com/api
```

**Note:** This should point to your production backend on Render.

### Stripe Payment (Production or Test)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_PLACEHOLDER_KEY
```

**Options:**
- **Test Mode** (Recommended for initial deployment):
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PLACEHOLDER_KEY
  ```
  
- **Production Mode** (Requires business verification):
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_PLACEHOLDER_KEY
  ```

**Setup Steps:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API Keys
3. Copy the appropriate publishable key (test or live)
4. Add to Vercel environment variables

## Optional Environment Variables

### UploadThing (If using file uploads)

```env
UPLOADTHING_SECRET=sk_live_PLACEHOLDER_KEY
UPLOADTHING_APP_ID=PLACEHOLDER_APP_ID
```

## How to Add Environment Variables to Vercel

### Via Vercel Dashboard:

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on "Settings" tab
3. Navigate to "Environment Variables"
4. Add each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
   - **Value**: The actual value
   - **Environments**: Select "Production", "Preview", and "Development" as needed
5. Click "Save"
6. Redeploy your application for changes to take effect

### Via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Then paste the value when prompted

# Pull environment variables to local
vercel env pull .env.local
```

## Environment Variable Naming Convention

- **`NEXT_PUBLIC_*`**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- **No prefix**: Server-side only variables (not accessible in browser)

⚠️ **Security Warning**: Never expose secret keys (like `CLERK_SECRET_KEY`) with the `NEXT_PUBLIC_` prefix!

## Verification Checklist

After adding all environment variables:

- [ ] Clerk production keys added
- [ ] Vercel domain added to Clerk allowed domains
- [ ] Backend API URL configured
- [ ] Stripe publishable key added (test or live)
- [ ] All variables saved in Vercel dashboard
- [ ] Application redeployed
- [ ] Test authentication flow
- [ ] Test product loading
- [ ] Test payment flow (with Stripe test card if in test mode)

## Test Stripe Card (Test Mode Only)

If using test mode, use these test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC.

## Troubleshooting

### Issue: "Clerk is not defined" error
**Solution**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set and starts with `pk_`

### Issue: Products not loading
**Solution**: Verify `NEXT_PUBLIC_API_URL` is correct and backend is running

### Issue: Payment not working
**Solution**: 
1. Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
2. Verify backend has matching Stripe secret key
3. Ensure webhook is configured in Stripe dashboard

### Issue: Images not displaying
**Solution**: 
1. Check `next.config.ts` has `utfs.io` in `remotePatterns`
2. Verify product images are valid URLs
3. Check browser console for CORS errors

## Production Deployment Checklist

Before going live:

- [ ] Switch Clerk to production instance
- [ ] Decide on Stripe mode (test vs production)
- [ ] Configure email service (Resend recommended)
- [ ] Set up proper error monitoring (Sentry, LogRocket, etc.)
- [ ] Enable analytics (Vercel Analytics, Google Analytics)
- [ ] Test all critical user flows
- [ ] Set up custom domain (optional)
- [ ] Configure proper CORS on backend
- [ ] Review and test all environment variables

## Support

For issues with:
- **Vercel**: [Vercel Support](https://vercel.com/support)
- **Clerk**: [Clerk Support](https://clerk.com/support)
- **Stripe**: [Stripe Support](https://support.stripe.com)

---

Last Updated: 2026-01-01
