# 🔐 Configuración de Variables de Entorno

Este documento lista todas las variables de entorno necesarias para el proyecto Arch Project en cada ambiente.

---

## 📋 Variables por Servicio

### 🖥️ Backend (Render)

Configurar en: https://dashboard.render.com → Services → arch-backend-90c5 → Environment

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database (Neon)
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
# Ejemplo: postgresql://arch_user:password@ep-xxx.us-east-2.aws.neon.tech/arch_project?sslmode=require

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_...  # Producción
# STRIPE_SECRET_KEY=sk_test_...  # Desarrollo
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3 (para archivos DWG)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=arch-project-files

# CORS Origins (separados por coma)
ALLOWED_ORIGINS=https://tu-dominio.vercel.app,https://tu-dominio-git-*.vercel.app
```

### 🌐 Frontend (Vercel)

Configurar en: https://vercel.com/dashboard → Project → Settings → Environment Variables

```env
# API Backend
NEXT_PUBLIC_API_URL=https://arch-backend-90c5.onrender.com/api

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Stripe Payment (Frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Desarrollo

# PayPal Payment
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-...  # Google Analytics
```

### 🗄️ Base de Datos (Neon)

No requiere configuración adicional. La conexión se hace vía `DATABASE_URL` desde el backend.

---

## 🔄 Variables por Ambiente

### Development (Local)

#### Backend `.env`
```env
PORT=3001
NODE_ENV=development

# Local PostgreSQL
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=arch_project
DB_USER=arch_user
DB_PASSWORD=password123

# O usar Neon en desarrollo
# DATABASE_URL=postgresql://...

# Stripe Test Mode
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# AWS (opcional en desarrollo)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# CORS abierto para desarrollo
ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend `.env.local`
```env
# Local backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Clerk (puede usar keys de desarrollo)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe Test Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# PayPal Sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...sandbox...

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

### Production

Ver secciones de Backend y Frontend arriba. Usar:
- Keys de producción (`sk_live_`, `pk_live_`)
- DATABASE_URL de Neon
- Dominios reales en ALLOWED_ORIGINS

---

## 🔑 Cómo Obtener las Keys

### Stripe

1. Ir a https://dashboard.stripe.com
2. Developers → API Keys
3. Copiar:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
4. Developers → Webhooks → Add endpoint
   - URL: `https://arch-backend-90c5.onrender.com/api/payment/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copiar **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Clerk

1. Ir a https://dashboard.clerk.com
2. Seleccionar aplicación
3. API Keys:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

### PayPal

1. Ir a https://developer.paypal.com
2. Dashboard → My Apps & Credentials
3. Create App
4. Copiar **Client ID** → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

### UploadThing

1. Ir a https://uploadthing.com/dashboard
2. Crear aplicación
3. API Keys:
   - **Secret** → `UPLOADTHING_SECRET`
   - **App ID** → `UPLOADTHING_APP_ID`

### AWS S3

1. Ir a https://console.aws.amazon.com/iam
2. Users → Create user
3. Attach policy: `AmazonS3FullAccess` (o crear policy personalizada)
4. Security credentials → Create access key
5. Copiar:
   - **Access Key ID** → `AWS_ACCESS_KEY_ID`
   - **Secret Access Key** → `AWS_SECRET_ACCESS_KEY`
6. Crear bucket en S3:
   - https://console.aws.amazon.com/s3
   - Create bucket → Nombre: `arch-project-files`
   - Copiar nombre → `AWS_S3_BUCKET`

### Neon Database

1. Ir a https://console.neon.tech
2. Crear proyecto
3. Dashboard → Connection Details
4. Copiar **Connection string** → `DATABASE_URL`
   - Formato: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

---

## ✅ Verificación de Variables

### Script de Verificación (Backend)

Crear `backend/verify-env.js`:

```javascript
require('dotenv').config();

const requiredVars = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

const optionalVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET'
];

console.log('🔍 Verificando variables de entorno...\n');

let missing = [];
let present = [];

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    present.push(varName);
    console.log(`✅ ${varName}: Configurada`);
  } else {
    missing.push(varName);
    console.log(`❌ ${varName}: FALTANTE`);
  }
});

console.log('\n📋 Variables opcionales:\n');

optionalVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Configurada`);
  } else {
    console.log(`⚠️  ${varName}: No configurada`);
  }
});

if (missing.length > 0) {
  console.log('\n❌ Faltan variables requeridas:', missing.join(', '));
  process.exit(1);
} else {
  console.log('\n✅ Todas las variables requeridas están configuradas');
}
```

Ejecutar:
```bash
cd backend
node verify-env.js
```

### Script de Verificación (Frontend)

Crear `store/verify-env.js`:

```javascript
const requiredVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

const optionalVars = [
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
  'UPLOADTHING_SECRET',
  'UPLOADTHING_APP_ID'
];

console.log('🔍 Verificando variables de entorno...\n');

let missing = [];

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Configurada`);
  } else {
    missing.push(varName);
    console.log(`❌ ${varName}: FALTANTE`);
  }
});

console.log('\n📋 Variables opcionales:\n');

optionalVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: Configurada`);
  } else {
    console.log(`⚠️  ${varName}: No configurada`);
  }
});

if (missing.length > 0) {
  console.log('\n❌ Faltan variables requeridas:', missing.join(', '));
  process.exit(1);
} else {
  console.log('\n✅ Todas las variables requeridas están configuradas');
}
```

Ejecutar:
```bash
cd store
node verify-env.js
```

---

## 🔒 Seguridad

### ⚠️ NUNCA hacer commit de:
- `.env`
- `.env.local`
- `.env.production`
- Cualquier archivo con secrets

### ✅ Asegurar que `.gitignore` incluya:
```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# Secrets
*.pem
*.key
secrets/
```

### 🔐 Rotación de Keys

Si una key se compromete:

1. **Stripe:**
   - Dashboard → API Keys → Roll key
   - Actualizar en Render/Vercel inmediatamente

2. **Clerk:**
   - Dashboard → API Keys → Regenerate
   - Actualizar en Vercel

3. **AWS:**
   - IAM → Users → Security credentials → Deactivate old key
   - Create new access key
   - Actualizar en Render

4. **Database:**
   - Neon → Settings → Reset password
   - Actualizar DATABASE_URL en Render

---

## 📝 Checklist de Configuración

### Backend (Render)
- [ ] `DATABASE_URL` configurada y probada
- [ ] `STRIPE_SECRET_KEY` configurada
- [ ] `STRIPE_WEBHOOK_SECRET` configurada
- [ ] `AWS_ACCESS_KEY_ID` configurada (si se usa S3)
- [ ] `AWS_SECRET_ACCESS_KEY` configurada (si se usa S3)
- [ ] `ALLOWED_ORIGINS` incluye dominio de Vercel
- [ ] Health check responde OK

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` apunta al backend correcto
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` configurada
- [ ] `CLERK_SECRET_KEY` configurada
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` configurada
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID` configurada
- [ ] `UPLOADTHING_SECRET` configurada
- [ ] Build exitoso en Vercel

### Base de Datos (Neon)
- [ ] Proyecto creado
- [ ] Schema ejecutado
- [ ] Connection string copiada
- [ ] Conexión probada desde backend

---

## 🆘 Troubleshooting

### Error: "DATABASE_URL is not defined"
**Solución:** Verificar que la variable esté configurada en Render y hacer redeploy.

### Error: "Stripe webhook signature verification failed"
**Solución:** Verificar que `STRIPE_WEBHOOK_SECRET` sea el correcto del webhook endpoint.

### Error: "CORS policy blocked"
**Solución:** Agregar el dominio de Vercel a `ALLOWED_ORIGINS` en backend.

### Error: "Clerk: Invalid publishable key"
**Solución:** Verificar que la key empiece con `pk_live_` o `pk_test_` y esté correcta.

---

**Última Actualización:** 31 de Diciembre, 2025
