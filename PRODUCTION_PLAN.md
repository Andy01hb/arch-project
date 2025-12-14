# Production Implementation Plan: Arch Project

This plan outlines the steps required to transition the Arch Project from a local development environment to a fully functional, secure, and scalable production application.

## 1. Cloud Infrastructure & Database
**Goal:** Move data off the local machine to a persistent cloud database.

- [ ] **Database Migration**
  - Choose provider: **Neon** (Serverless Postgres) or **Supabase**.
  - Create production database.
  - Run schema migration scripts.
  - Update backend `DATABASE_URL` for production.

## 2. File Storage (Critical for Digital Products)
**Goal:** Securely store and serve product images and DWG files. Local paths like `/protected/file.dwg` will NOT work in production.

- [ ] **Object Storage Setup**
  - Provider: **AWS S3** or **UploadThing** (easier for Next.js).
  - Create buckets for:
    - Public Images (Product previews).
    - Private/Protected Files (The actual DWG products).
- [ ] **Backend Integration**
  - Implement "Presigned URLs" or a proxy endpoint to allow secure downloading of purchased DWG files only after payment.
  - Update `createProduct` to handle file uploads instead of text URLs.

## 3. Authentication & Security
**Goal:** Protect the Admin panel and user data. Currently, `/admin` is open to the world.

- [ ] **Admin Authentication**
  - Implement **Clerk** or **NextAuth.js**.
  - Protect `/admin` routes (Middleware).
  - Ensure only authorized emails can access the dashboard.
- [ ] **API Security**
  - Add API Keys or JWT verification for Backend routes to prevent unauthorized requests.
  - Configure CORS properly for the production frontend domain.

## 4. Payments (Stripe Integration)
**Goal:** Replace placeholder buttons with real payment processing.

- [ ] **Frontend Integration**
  - Install `@stripe/react-stripe-js`.
  - Create `PaymentForm` component.
  - Replace PayPal button with Stripe Elements.
- [ ] **Backend Webhooks**
  - Verify Stripe Webhook signature (security critical).
  - Handle `checkout.session.completed` event to:
    - Create Order in DB.
    - Send email with download link to user.

## 5. Deployment
**Goal:** Make the app accessible via the internet.

- [ ] **Backend Deployment**
  - Provider: **Render** or **Railway** (Good for Node.js/Docker).
  - Configure Environment Variables.
- [ ] **Frontend Deployment**
  - Provider: **Vercel** (Native for Next.js).
  - Connect to Git repository.
  - Configure Build settings.

## 6. Email System (Transactional)
**Goal:** Send purchase receipts and download links.

- [ ] **Email Provider**
  - **Resend** or **SendGrid**.
  - Implement `sendOrderConfirmation` service in Backend.

---

## Recommended Immediate Next Steps (Phase 1)

1.  **Stripe Integration**: Complete the payment flow locally first.
2.  **Authentication**: Secure the Admin panel immediately.
3.  **Cloud Storage**: Implement file upload locally before deploying.
