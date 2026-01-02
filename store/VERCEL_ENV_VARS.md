# Frontend Environment Variables for Vercel

## Required Variables

### API Configuration
```
NEXT_PUBLIC_API_URL=https://arch-backend-90c5.onrender.com/api
```

### Clerk Authentication (Production)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[Get from Clerk Dashboard -> Prod]
CLERK_SECRET_KEY=[Get from Clerk Dashboard -> Prod]
```
*Note: Make sure to add your Vercel domain to Clerk > Configure > Domains*

### Stripe (Public Key)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51QYlPiP0rCbfRgpz... (Get from Stripe)
```

### UploadThing
```
UPLOADTHING_SECRET=[Get from UploadThing]
UPLOADTHING_APP_ID=[Get from UploadThing]
```

## How to Configure in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** -> **Environment Variables**
4. Add the variables above
5. Redeploy your application (Deployments -> Redeploy)
