# 🚀 Guía de Configuración de Deployment - Arch Project

**Última Actualización:** 31 de Diciembre, 2025

Esta guía te llevará paso a paso para configurar correctamente todos los servicios de producción.

---

## 📋 Prerequisitos

- [ ] Cuenta en Neon (https://neon.tech)
- [ ] Cuenta en Render (https://render.com)
- [ ] Cuenta en Vercel (https://vercel.com)
- [ ] Cuenta en Stripe (https://stripe.com)
- [ ] Cuenta en Clerk (https://clerk.com)
- [ ] Repositorio en GitHub con el código

---

## 1️⃣ CONFIGURAR BASE DE DATOS EN NEON

### Paso 1.1: Crear Proyecto en Neon

1. Ve a https://console.neon.tech
2. Click en "New Project"
3. Configuración:
   - **Project Name:** arch-project
   - **Region:** Selecciona el más cercano (ej: US East)
   - **PostgreSQL Version:** 15 (recomendado)
4. Click "Create Project"

### Paso 1.2: Obtener Connection String

1. En el dashboard del proyecto, ve a "Connection Details"
2. Copia el **Connection String**
3. Debería verse así:
   ```
   postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
   ```
4. **GUARDA ESTO** - lo necesitarás para Render

### Paso 1.3: Ejecutar Migración de Base de Datos

1. En Neon Dashboard, ve a "SQL Editor"
2. Abre el archivo `backend/database/neon-migration.sql` de este proyecto
3. Copia TODO el contenido
4. Pégalo en el SQL Editor de Neon
5. Click "Run" o presiona Ctrl+Enter
6. Verifica que veas:
   ```
   Products table created | 3
   Orders table created | 0
   Order items table created | 0
   ```

### Paso 1.4: Verificar Datos

Ejecuta en el SQL Editor:
```sql
SELECT * FROM products;
```

Deberías ver 3 productos. ✅

---

## 2️⃣ CONFIGURAR BACKEND EN RENDER

### Paso 2.1: Crear Web Service

1. Ve a https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `arch-project`
5. Configuración:
   - **Name:** arch-backend
   - **Region:** Mismo que Neon (ej: Oregon)
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (para empezar)

### Paso 2.2: Configurar Variables de Entorno

En la sección "Environment", agrega estas variables:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
STRIPE_SECRET_KEY=sk_live_xxxxx (o sk_test_xxxxx para testing)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**IMPORTANTE:** 
- Usa el `DATABASE_URL` que copiaste de Neon
- Para Stripe, ve a https://dashboard.stripe.com/apikeys

### Paso 2.3: Deploy

1. Click "Create Web Service"
2. Render comenzará a hacer el deploy automáticamente
3. Espera ~3-5 minutos
4. Verifica que el estado sea "Live" (verde)

### Paso 2.4: Verificar Backend

1. Copia la URL de tu servicio (ej: `https://arch-backend-xxxx.onrender.com`)
2. Abre en el navegador: `https://arch-backend-xxxx.onrender.com/api/health`
3. Deberías ver:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-12-31T...",
     "uptime": 123.45,
     "environment": "production"
   }
   ```
4. Prueba productos: `https://arch-backend-xxxx.onrender.com/api/products`
5. Deberías ver un array con 3 productos ✅

### Paso 2.5: Revisar Logs

Si algo falla:
1. En Render Dashboard → Tu servicio → "Logs"
2. Busca errores
3. Deberías ver: `✅ Connected to PostgreSQL database`

---

## 3️⃣ CONFIGURAR FRONTEND EN VERCEL

### Paso 3.1: Importar Proyecto

1. Ve a https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Importa tu repositorio de GitHub
4. Configuración:
   - **Framework Preset:** Next.js
   - **Root Directory:** store
   - **Build Command:** `npm run build` (auto-detectado)
   - **Output Directory:** `.next` (auto-detectado)

### Paso 3.2: Configurar Variables de Entorno

En "Environment Variables", agrega:

```
NEXT_PUBLIC_API_URL=https://arch-backend-xxxx.onrender.com/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

**IMPORTANTE:**
- Reemplaza `arch-backend-xxxx` con tu URL real de Render
- Para Clerk: https://dashboard.clerk.com → Tu app → API Keys
- Para UploadThing: https://uploadthing.com/dashboard → API Keys
- Para Stripe: https://dashboard.stripe.com/apikeys

### Paso 3.3: Deploy

1. Click "Deploy"
2. Vercel hará el build y deploy automáticamente
3. Espera ~2-3 minutos
4. Vercel te dará una URL (ej: `https://arch-project-xxxx.vercel.app`)

### Paso 3.4: Verificar Frontend

1. Abre la URL de Vercel en tu navegador
2. Deberías ver la página principal con productos
3. Verifica que los productos carguen correctamente
4. Intenta agregar un producto al carrito

---

## 4️⃣ CONFIGURAR CORS EN BACKEND

Ahora que tienes la URL de Vercel, necesitas configurar CORS.

### Paso 4.1: Actualizar Código

Edita `backend/src/index.ts`:

```typescript
// Reemplaza:
app.use(cors());

// Por:
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://arch-project-xxxx.vercel.app',
  credentials: true
}));
```

### Paso 4.2: Agregar Variable en Render

1. Ve a Render Dashboard → arch-backend → Environment
2. Agrega:
   ```
   FRONTEND_URL=https://arch-project-xxxx.vercel.app
   ```
3. Guarda los cambios
4. Render redesplegará automáticamente

---

## 5️⃣ CONFIGURAR CLERK (AUTENTICACIÓN)

### Paso 5.1: Configurar Redirect URLs

1. Ve a https://dashboard.clerk.com
2. Selecciona tu aplicación
3. Ve a "Paths"
4. Configura:
   - **Sign-in URL:** `/sign-in`
   - **Sign-up URL:** `/sign-up`
   - **After sign-in:** `/admin`
   - **After sign-up:** `/`

### Paso 5.2: Agregar Dominios Permitidos

1. En Clerk Dashboard → "Domains"
2. Agrega tu dominio de Vercel:
   ```
   https://arch-project-xxxx.vercel.app
   ```

---

## 6️⃣ CONFIGURAR STRIPE (PAGOS)

### Paso 6.1: Configurar Webhooks

1. Ve a https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Configuración:
   - **Endpoint URL:** `https://arch-backend-xxxx.onrender.com/api/payment/webhook`
   - **Events to send:**
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. Click "Add endpoint"
5. Copia el **Signing secret** (empieza con `whsec_`)
6. Actualiza `STRIPE_WEBHOOK_SECRET` en Render

### Paso 6.2: Modo de Prueba vs Producción

**Para Testing:**
- Usa keys que empiecen con `sk_test_` y `pk_test_`
- Puedes usar tarjetas de prueba: `4242 4242 4242 4242`

**Para Producción:**
- Usa keys que empiecen con `sk_live_` y `pk_live_`
- Stripe revisará tu cuenta antes de activar modo live

---

## 7️⃣ CONFIGURAR UPLOADTHING (SUBIDA DE ARCHIVOS)

### Paso 7.1: Crear Aplicación

1. Ve a https://uploadthing.com/dashboard
2. Click "Create a new app"
3. Nombre: arch-project
4. Copia el **App ID** y **Secret**

### Paso 7.2: Configurar Permisos

1. En UploadThing Dashboard → Settings
2. Configurar:
   - **Max File Size:** 8MB
   - **Allowed File Types:** `.dwg`, `.jpg`, `.png`
   - **Max Files per Upload:** 5

---

## 8️⃣ VERIFICACIÓN FINAL

### Checklist Completo

- [ ] ✅ Neon DB tiene las tablas y datos
- [ ] ✅ Backend en Render responde en `/api/health`
- [ ] ✅ Backend en Render devuelve productos en `/api/products`
- [ ] ✅ Frontend en Vercel carga correctamente
- [ ] ✅ Frontend puede obtener productos del backend
- [ ] ✅ CORS está configurado correctamente
- [ ] ✅ Clerk permite login/signup
- [ ] ✅ Stripe procesa pagos de prueba
- [ ] ✅ UploadThing permite subir archivos

### Prueba End-to-End

1. Abre tu sitio en Vercel
2. Navega a los productos
3. Agrega un producto al carrito
4. Ve al checkout
5. Completa el pago con tarjeta de prueba de Stripe
6. Verifica que la orden se cree en la base de datos

---

## 🔧 TROUBLESHOOTING

### Backend no conecta a DB

**Síntoma:** Error 500 en `/api/products`

**Solución:**
1. Verifica que `DATABASE_URL` esté configurado en Render
2. Verifica que el connection string de Neon sea correcto
3. Revisa logs en Render: debería decir `✅ Connected to PostgreSQL database`

### Frontend no carga productos

**Síntoma:** Página en blanco o error en consola

**Solución:**
1. Abre DevTools → Console
2. Busca errores de CORS
3. Verifica que `NEXT_PUBLIC_API_URL` esté correcta en Vercel
4. Verifica que CORS esté configurado en backend

### Clerk no funciona

**Síntoma:** Error al hacer login

**Solución:**
1. Verifica que las keys de Clerk estén correctas en Vercel
2. Verifica que el dominio de Vercel esté agregado en Clerk Dashboard
3. Verifica que las redirect URLs estén configuradas

### Stripe no procesa pagos

**Síntoma:** Error al intentar pagar

**Solución:**
1. Verifica que las keys de Stripe estén correctas (frontend y backend)
2. Verifica que el webhook esté configurado con la URL correcta
3. Usa tarjeta de prueba: `4242 4242 4242 4242`

---

## 📊 MONITOREO

### Logs en Render

```bash
# Ver logs en tiempo real
https://dashboard.render.com → Tu servicio → Logs
```

### Logs en Vercel

```bash
# Ver logs de deployment
https://vercel.com/dashboard → Tu proyecto → Deployments → Click en uno → Logs
```

### Monitoreo de Base de Datos

```bash
# Ver queries en Neon
https://console.neon.tech → Tu proyecto → Monitoring
```

---

## 🎯 PRÓXIMOS PASOS

Una vez que todo esté funcionando:

1. **Dominio Personalizado**
   - Compra un dominio
   - Configúralo en Vercel
   - Actualiza CORS y Clerk con el nuevo dominio

2. **Modo Producción de Stripe**
   - Completa verificación de cuenta en Stripe
   - Cambia a keys de producción
   - Actualiza webhook

3. **Monitoreo Avanzado**
   - Configura Sentry para error tracking
   - Configura analytics (Google Analytics, Plausible)
   - Configura uptime monitoring (UptimeRobot)

4. **Performance**
   - Configura CDN para archivos estáticos
   - Implementa caching con Redis
   - Optimiza imágenes

5. **Seguridad**
   - Implementa rate limiting más estricto
   - Agrega autenticación de 2 factores
   - Configura backups automáticos de DB

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs** en Render y Vercel
2. **Consulta la documentación:**
   - Neon: https://neon.tech/docs
   - Render: https://render.com/docs
   - Vercel: https://vercel.com/docs
   - Stripe: https://stripe.com/docs
   - Clerk: https://clerk.com/docs
3. **Revisa este repositorio:** `DEBUGGING_GUIDE.md`

---

**¡Éxito con tu deployment! 🚀**
