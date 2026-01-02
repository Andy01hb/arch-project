# 🚀 Quick Deployment Reference Card

## ⚡ Fast Track Deployment (30 minutes)

### Step 1: Environment Variables (10 min)

#### Render → arch-backend → Environment
```
FRONTEND_URL=https://arch-project-git-main-andy01hbs-projects.vercel.app
STRIPE_WEBHOOK_SECRET=whsec_[get_from_stripe]
RESEND_API_KEY=re_[get_from_resend]
FROM_EMAIL=noreply@archproject.com
NODE_ENV=production
```

#### Vercel → arch-project → Settings → Environment Variables
```
Verify production keys are set:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

### Step 2: Deploy Code (5 min)
```powershell
cd c:\Users\andyx\Desktop\Arch_Project
git add .
git commit -m "feat: production deployment ready"
git push origin main
```

### Step 3: Configure Services (15 min)

#### Stripe Webhook
1. https://dashboard.stripe.com/webhooks → Add endpoint
2. URL: `https://arch-backend-90c5.onrender.com/api/payment/webhook`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy secret → Add to Render as `STRIPE_WEBHOOK_SECRET`

#### Resend Email
1. https://resend.com → Sign up
2. API Keys → Create
3. Copy key → Add to Render as `RESEND_API_KEY`

#### Clerk Production
1. https://dashboard.clerk.com → Domains → Add Vercel domain
2. API Keys → Production → Copy
3. Update in Vercel

---

## 🧪 Quick Test (5 min)

### Backend
```powershell
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/health"
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/products"
```

### Frontend
Visit: https://arch-project-git-main-andy01hbs-projects.vercel.app
- [ ] Homepage loads
- [ ] Products display
- [ ] About page works
- [ ] Catalog page works

### Purchase Flow
1. Add product to cart
2. Checkout with test card: `4242 4242 4242 4242`
3. Check email for confirmation
4. Click download link
5. Verify download page works

---

## 🎯 What Was Implemented

### Backend ✅
- Email service (Resend)
- Order confirmation emails
- Download link generation
- Order verification

### Frontend ✅
- ISR (60s revalidation)
- Next.js Image optimization
- Download page
- Error handling

### Files Changed
- Created: 3 new files
- Modified: 5 files
- Total: ~600 lines of code

---

## 📊 Deployment Status

| Component | Status | Action Required |
|-----------|--------|-----------------|
| Backend Code | ✅ Ready | None |
| Frontend Code | ✅ Ready | None |
| Backend Build | ✅ Passing | None |
| Frontend Build | ⏳ Needs Env | Add Clerk keys |
| Email Service | ⏳ Config | Add Resend key |
| Webhooks | ⏳ Config | Configure Stripe |
| Clerk | ⏳ Config | Add domain |

---

## 🆘 Quick Troubleshooting

### CORS Errors
→ Check `FRONTEND_URL` in Render

### Emails Not Sending
→ Verify `RESEND_API_KEY` in Render

### Webhooks Failing
→ Check `STRIPE_WEBHOOK_SECRET` in Render

### Images Not Loading
→ Verify `utfs.io` in `next.config.ts`

### Build Failing
→ Check environment variables in Vercel

---

## 📞 Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Resend Dashboard**: https://resend.com/dashboard
- **Clerk Dashboard**: https://dashboard.clerk.com

- **Backend URL**: https://arch-backend-90c5.onrender.com
- **Frontend URL**: https://arch-project-git-main-andy01hbs-projects.vercel.app

---

## ✅ Deployment Checklist

- [ ] Add environment variables to Render
- [ ] Add environment variables to Vercel
- [ ] Push code to GitHub
- [ ] Configure Stripe webhook
- [ ] Set up Resend email
- [ ] Configure Clerk production
- [ ] Test backend health endpoint
- [ ] Test frontend homepage
- [ ] Test complete purchase flow
- [ ] Verify email delivery
- [ ] Check download page works
- [ ] Monitor logs for 24 hours

---

**Total Time**: ~30-45 minutes
**Difficulty**: Medium
**Status**: Code Ready, Config Pending

🎉 **You're almost there!**
