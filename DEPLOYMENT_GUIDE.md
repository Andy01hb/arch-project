# 🚀 Deployment & Testing Guide

## Quick Start - Test Locally First

### 1. Backend Local Testing

```powershell
cd backend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# In another terminal, test endpoints
Invoke-WebRequest -Uri "http://localhost:3001/api/health" | Select-Object -ExpandProperty Content
Invoke-WebRequest -Uri "http://localhost:3001/api/products" | Select-Object -ExpandProperty Content
```

### 2. Frontend Local Testing

```powershell
cd store

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

---

## Production Deployment Steps

### Step 1: Update Environment Variables

#### Render (Backend)
Go to: https://dashboard.render.com → arch-backend → Environment

Add these variables:
```env
FRONTEND_URL=https://arch-project-git-main-andy01hbs-projects.vercel.app
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe Dashboard)
RESEND_API_KEY=re_... (get from Resend)
FROM_EMAIL=noreply@archproject.com
NODE_ENV=production
```

#### Vercel (Frontend)
Go to: https://vercel.com/dashboard → arch-project → Settings → Environment Variables

Verify these are set to PRODUCTION values:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (production key)
CLERK_SECRET_KEY=sk_live_... (production secret)
NEXT_PUBLIC_API_URL=https://arch-backend-90c5.onrender.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_ for production)
```

### Step 2: Configure Third-Party Services

#### A. Stripe Webhook Setup
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://arch-backend-90c5.onrender.com/api/payment/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Add to Render as `STRIPE_WEBHOOK_SECRET`

#### B. Resend Email Setup
1. Go to: https://resend.com/signup
2. Verify your email
3. Add and verify your domain (or use resend.dev for testing)
4. Go to API Keys → Create API Key
5. Copy the key (starts with `re_`)
6. Add to Render as `RESEND_API_KEY`

#### C. Clerk Production Setup
1. Go to: https://dashboard.clerk.com
2. Select your application
3. Go to "Domains" → Add your Vercel domain
4. Go to "API Keys"
5. Switch to "Production" instance
6. Copy the production keys
7. Update in Vercel environment variables

### Step 3: Deploy Code Changes

```powershell
# From project root
cd c:\Users\andyx\Desktop\Arch_Project

# Check git status
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: production deployment - email service, download page, image optimization"

# Push to main branch
git push origin main
```

Both Render and Vercel will automatically deploy when you push to main.

### Step 4: Monitor Deployments

#### Render
- Go to: https://dashboard.render.com/web/srv-...
- Watch the "Events" tab for deployment progress
- Check "Logs" tab for any errors
- Deployment usually takes 2-5 minutes

#### Vercel
- Go to: https://vercel.com/dashboard
- Watch the deployment progress
- Click on the deployment to see build logs
- Deployment usually takes 1-3 minutes

---

## Testing Checklist

### ✅ Backend Tests

```powershell
# 1. Health Check
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/health" | Select-Object -ExpandProperty Content

# Expected: {"status":"ok","timestamp":"...","uptime":...,"environment":"production"}

# 2. Products Endpoint
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/products" | Select-Object -ExpandProperty Content

# Expected: Array of products

# 3. CORS Check (from browser console on Vercel domain)
fetch('https://arch-backend-90c5.onrender.com/api/products')
  .then(r => r.json())
  .then(console.log)

# Should work without CORS errors
```

### ✅ Frontend Tests

Visit: https://arch-project-git-main-andy01hbs-projects.vercel.app

1. **Homepage** (`/`)
   - [ ] Products load and display
   - [ ] Images show (or placeholder)
   - [ ] "Explorar Catálogo" button works
   - [ ] "Cómo funciona" button works
   - [ ] No console errors

2. **About Page** (`/about`)
   - [ ] Page loads
   - [ ] All sections render
   - [ ] Links work
   - [ ] No console errors

3. **Catalog Page** (`/catalogo`)
   - [ ] Products load
   - [ ] Search works
   - [ ] Category filter works
   - [ ] Sort options work
   - [ ] No console errors

4. **Product Detail** (`/products/[id]`)
   - [ ] Page loads
   - [ ] Product details show
   - [ ] Add to cart works
   - [ ] No console errors

### ✅ Integration Tests

#### Test Purchase Flow (Use Stripe Test Card)

1. **Browse Products**
   - Go to homepage or catalog
   - Click on a product
   - Click "Add to Cart" or "Buy Now"

2. **Checkout**
   - Fill in customer details
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

3. **Payment Processing**
   - Click "Pay"
   - Wait for confirmation
   - Should redirect to success page

4. **Verify Webhook**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook
   - Check "Events" tab
   - Should see `payment_intent.succeeded` event
   - Status should be "Succeeded"

5. **Check Email**
   - Check the email address used in checkout
   - Should receive confirmation email within 1 minute
   - Email should contain:
     - Order number
     - Product list
     - Total amount
     - Download link button

6. **Test Download Page**
   - Click download link in email OR
   - Go to `/downloads/[orderId]` manually
   - Should show order details
   - Should show download buttons for each product
   - Click download button
   - Should generate download link (or mock link if S3 not configured)

### ✅ Error Scenarios to Test

1. **Invalid Order ID**
   - Go to `/downloads/invalid-order-id`
   - Should show error message
   - Should offer link back to homepage

2. **Pending Order**
   - Try to access download page before payment completes
   - Should show "Order not completed" error

3. **Network Errors**
   - Disable network in DevTools
   - Try to load products
   - Should show error message gracefully

---

## Monitoring & Logs

### Render Logs
```powershell
# View live logs
# Go to: https://dashboard.render.com → arch-backend → Logs

# Look for:
# - "Server is running at..."
# - "Email sent successfully..."
# - "Download link generated..."
# - Any ERROR or WARN messages
```

### Vercel Logs
```powershell
# Go to: https://vercel.com/dashboard → arch-project → Deployments
# Click on latest deployment → "Functions" tab
# Check for any errors in serverless function logs
```

### Stripe Logs
```powershell
# Go to: https://dashboard.stripe.com/logs
# Filter by "Webhooks"
# Check for any failed webhook deliveries
```

---

## Troubleshooting

### Issue: CORS Errors
**Solution:**
- Check `FRONTEND_URL` is set correctly in Render
- Verify CORS configuration in `backend/src/index.ts`
- Check browser console for exact error

### Issue: Emails Not Sending
**Solution:**
- Verify `RESEND_API_KEY` is set in Render
- Check Resend dashboard for API usage
- Check Render logs for email errors
- Verify `FROM_EMAIL` domain is verified in Resend

### Issue: Webhooks Not Working
**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` is set in Render
- Check webhook URL in Stripe Dashboard
- Test webhook using Stripe CLI:
  ```powershell
  stripe listen --forward-to https://arch-backend-90c5.onrender.com/api/payment/webhook
  ```
- Check Stripe Dashboard → Webhooks → Events for failures

### Issue: Images Not Loading
**Solution:**
- Check Next.js config has `utfs.io` in `remotePatterns`
- Verify image URLs in database are valid
- Check browser console for image load errors
- Update product images in database if needed

### Issue: Download Links Don't Work
**Solution:**
- Check order status is "completed"
- Verify S3 credentials (or use mock URLs for testing)
- Check Render logs for download generation errors
- Ensure product ID matches order items

---

## Database Updates (If Needed)

### Update Product Images to Use UploadThing

```sql
-- Connect to Neon database
-- Update products with valid image URLs

UPDATE products
SET image = 'https://utfs.io/f/your-image-id'
WHERE id = 'product-id';

-- Or set placeholder for all products
UPDATE products
SET image = NULL
WHERE image LIKE '/images/%';
```

---

## Performance Optimization

### Frontend
- ✅ ISR enabled (60s revalidation)
- ✅ Next.js Image optimization
- ✅ Code splitting automatic
- ⏳ Add CDN for static assets (future)

### Backend
- ✅ Rate limiting enabled
- ✅ Compression enabled
- ✅ Database connection pooling
- ⏳ Add Redis caching (future)

---

## Security Checklist

- [x] CORS properly configured
- [x] Rate limiting enabled
- [x] Helmet security headers
- [x] Environment variables secured
- [x] Stripe webhook signature verification
- [x] Order verification before downloads
- [x] HTTPS enforced
- [ ] Add authentication for admin routes (future)
- [ ] Add CSRF protection (future)

---

## Next Steps After Deployment

1. **Monitor for 24 hours**
   - Check logs regularly
   - Watch for errors
   - Monitor webhook success rate

2. **Test with real users**
   - Ask a colleague to test purchase flow
   - Verify emails arrive correctly
   - Ensure downloads work

3. **Set up alerts**
   - Render: Enable email alerts for deployment failures
   - Vercel: Enable deployment notifications
   - Stripe: Enable webhook failure alerts

4. **Documentation**
   - Update README with production URLs
   - Document environment variables
   - Create user guide for customers

5. **Future Improvements**
   - Add product reviews
   - Implement wishlist
   - Add analytics (Google Analytics, Mixpanel)
   - Optimize images with CDN
   - Add automated testing (Jest, Cypress)

---

## Support Contacts

- **Render Support**: https://render.com/support
- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Resend Support**: https://resend.com/support
- **Clerk Support**: https://clerk.com/support

---

**Last Updated**: 2026-01-02
**Status**: Ready for Deployment 🚀
