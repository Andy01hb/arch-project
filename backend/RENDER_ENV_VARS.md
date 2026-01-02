# Backend Environment Variables for Render

## Required Variables

### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_qPbo86BeWlnr@ep-weathered-smoke-a40ru0l6-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Server Configuration
```
NODE_ENV=production
PORT=10000
```

### Frontend URL (for CORS)
```
FRONTEND_URL=https://arch-project-git-main-andy01hbs-projects.vercel.app
```

### Stripe (Currently in Test Mode)
```
STRIPE_SECRET_KEY=sk_test_51QYlPiP0rCbfRgpz7VJp8RQcJnwWRqGmjLTbQVqL8Ql4BqDMFqBMM
STRIPE_WEBHOOK_SECRET=[Get from Stripe Dashboard after configuring webhook]
```

## How to Configure in Render

1. Go to https://dashboard.render.com
2. Select your service: **arch-backend**
3. Click **Environment** in the sidebar
4. For each variable above:
   - Click **Add Environment Variable**
   - Enter the Key and Value
   - Click **Save Changes**

## Stripe Webhook Configuration

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://arch-backend-90c5.onrender.com/api/payment/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret**
6. Add it as `STRIPE_WEBHOOK_SECRET` in Render

## Verification

After updating environment variables, Render will automatically redeploy.

Check logs for:
```
✅ Connected to PostgreSQL database
Database connection mode: DATABASE_URL (Production)
Server is running at http://localhost:10000
```
