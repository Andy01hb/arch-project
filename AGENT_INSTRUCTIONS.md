# Instructions for AI Agents: Arch Project Production

Here are specific instructions and prompts you can give to 3 different AI agents (or use in 3 separate sessions) to parallelize the work of bringing the Arch Project to production.

---

## 🤖 Agent 1: "The Merchant" (Payments & Transactions)
**Focus:** Stripe Integration, Order Processing, and Emails.

**Copy & Paste Prompt:**
```text
You are an expert Backend/Fullstack Developer specializing in E-commerce and Payments.
Your goal is to implement the complete payment flow for the "Arch Project".

**Context:**
- Backend: Express.js + TypeScript + PostgreSQL.
- Frontend: Next.js (App Router).
- Current Status: Products are in DB. Cart works locally.

**Your Tasks:**
1.  **Stripe Integration (Frontend):**
    - Install `@stripe/stripe-js` and `@stripe/react-stripe-js`.
    - Create a `PaymentForm` component using Stripe Elements.
    - Replace the current PayPal button in `/checkout` with this form.
2.  **Stripe Integration (Backend):**
    - Create a Payment Intent endpoint.
    - Create a Webhook endpoint to listen for `checkout.session.completed` or `payment_intent.succeeded`.
    - **CRITICAL:** Verify the Stripe Webhook signature to prevent fraud.
3.  **Order Fulfillment:**
    - When a payment is successful (via webhook), insert a record into the `orders` table in PostgreSQL.
    - (Optional) Integrate 'Resend' or 'SendGrid' to send an email to the user with their download link.

**Deliverables:**
- Functional credit card form on Checkout page.
- Backend logs confirming successful payment and order creation.
```

---

## 🤖 Agent 2: "The Guardian" (Security & Assets)
**Focus:** Authentication, Admin Security, and File Storage.

**Copy & Paste Prompt:**
```text
You are a Security and Infrastructure Engineer.
Your goal is to secure the application and handle digital asset storage.

**Context:**
- Frontend: Next.js (App Router).
- Backend: Express.js.
- Assets: We sell DWG files (need protection) and show Images (public).

**Your Tasks:**
1.  **Admin Authentication:**
    - Implement **Clerk** (recommended) or NextAuth.js for the Next.js frontend.
    - Protect the `/admin` route so only specific emails (e.g., `admin@archproject.com`) can access it.
    - Add a "Login" page for the admin.
2.  **Cloud Storage (Images & Files):**
    - Set up **UploadThing** (easiest for Next.js) or AWS S3.
    - Update the "Add Product" form in Admin to upload files instead of typing URLs.
    - **Public Bucket:** For product preview images.
    - **Private Bucket:** For the actual DWG files.
3.  **Secure Downloads:**
    - Create a mechanism (Presigned URL or Proxy API) so users can only download the DWG file IF they have purchased it.

**Deliverables:**
- Secure `/admin` panel (redirects to login if not auth).
- File upload working in Admin form.
- Secure download links for purchased products.
```

---

## 🤖 Agent 3: "The Architect" (DevOps & Deployment)
**Focus:** Database Migration, CI/CD, and Going Live.

**Copy & Paste Prompt:**
```text
You are a DevOps and Cloud Architect.
Your goal is to deploy the Arch Project to the public internet.

**Context:**
- Codebase: Monorepo-style (Backend folder + Store folder).
- Database: Local PostgreSQL (needs migration to Cloud).

**Your Tasks:**
1.  **Database Migration:**
    - Guide me to set up a **Neon** (Serverless Postgres) or **Supabase** project.
    - Provide the commands to export my local data and import it to the cloud DB.
    - Update `.env` files with the new `DATABASE_URL`.
2.  **Backend Deployment:**
    - Create a `Dockerfile` for the Express backend (optional but recommended) or configure for **Render/Railway**.
    - Deploy the backend and ensure it connects to the Cloud DB.
3.  **Frontend Deployment:**
    - Deploy the Next.js `store` to **Vercel**.
    - Configure Environment Variables in Vercel (`NEXT_PUBLIC_API_URL`, etc.).
4.  **Final Polish:**
    - Ensure CORS is configured in the backend to allow requests from the Vercel domain.

**Deliverables:**
- Live URL for the Store (e.g., `arch-project.vercel.app`).
- Live URL for the API.
- Fully functional production database.
```
