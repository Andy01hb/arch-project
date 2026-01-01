# 🔧 Guía de Debugging de Workflows - Arch Project

**Última Actualización:** 31 de Diciembre, 2025

---

## 📋 Tabla de Contenidos

1. [Diagnóstico Rápido](#diagnóstico-rápido)
2. [Debugging del Backend (Render)](#debugging-del-backend-render)
3. [Debugging del Frontend (Vercel)](#debugging-del-frontend-vercel)
4. [Debugging de Base de Datos (Neon)](#debugging-de-base-de-datos-neon)
5. [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
6. [Workflows de GitHub Actions](#workflows-de-github-actions)
7. [Checklist de Deployment](#checklist-de-deployment)

---

## 🚨 Diagnóstico Rápido

### Verificar Estado de Todos los Servicios

```bash
# 1. Backend Health Check
curl https://arch-backend-90c5.onrender.com/api/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "timestamp": "2025-12-31T...",
#   "uptime": 12345.67,
#   "environment": "production"
# }

# 2. Verificar Productos (Backend + DB)
curl https://arch-backend-90c5.onrender.com/api/products

# 3. Verificar Frontend
# Abrir en navegador: https://[tu-dominio].vercel.app
```

### Indicadores de Problemas

| Síntoma | Posible Causa | Servicio Afectado |
|---------|---------------|-------------------|
| 502 Bad Gateway | Backend caído o reiniciando | Render |
| CORS Error | Configuración de CORS incorrecta | Backend |
| Database connection failed | Neon DB no accesible | Neon/Backend |
| 404 en API calls | URL incorrecta o rutas mal configuradas | Frontend/Backend |
| Stripe webhook failed | Webhook secret incorrecto | Backend/Stripe |
| Upload failed | UploadThing no configurado | Frontend |

---

## 🖥️ Debugging del Backend (Render)

### 1. Acceder a Logs en Tiempo Real

**Opción A: Dashboard de Render**
1. Ir a https://dashboard.render.com
2. Seleccionar el servicio `arch-backend-90c5`
3. Click en "Logs" en el menú lateral
4. Filtrar por nivel: `Error`, `Warning`, `Info`

**Opción B: CLI de Render**
```bash
# Instalar Render CLI
npm install -g render-cli

# Login
render login

# Ver logs
render logs arch-backend-90c5 --tail
```

### 2. Verificar Variables de Entorno

**En Dashboard de Render:**
1. Ir a servicio → "Environment"
2. Verificar que existan:
   ```
   DATABASE_URL=postgresql://...
   PORT=3001
   STRIPE_SECRET_KEY=sk_live_... (o sk_test_...)
   STRIPE_WEBHOOK_SECRET=whsec_...
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   NODE_ENV=production
   ```

**⚠️ Importante:** Después de cambiar variables, el servicio se redesplegará automáticamente.

### 3. Verificar Build y Deploy

**Comandos de Diagnóstico:**
```bash
# Verificar que el build funciona localmente
cd backend
npm install
npm run build
npm run start:prod

# Debe iniciar sin errores en http://localhost:3001
```

**Revisar Dockerfile:**
```dockerfile
# Verificar que el Dockerfile esté correcto
cat backend/Dockerfile

# Debe tener:
# - FROM node:18-alpine
# - npm run build
# - CMD ["node", "dist/index.js"]
```

### 4. Debugging de Conexión a Base de Datos

**Test de Conexión Local:**
```bash
cd backend
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'TU_DATABASE_URL_AQUI'
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Error:', err);
  else console.log('Conexión exitosa:', res.rows[0]);
  pool.end();
});
"
```

**Verificar en Render:**
1. Ir a Logs
2. Buscar mensajes como:
   - ✅ "Database connected successfully"
   - ❌ "Error connecting to database"
   - ❌ "ECONNREFUSED"
   - ❌ "password authentication failed"

### 5. Debugging de Endpoints

**Test Manual de Endpoints:**
```bash
# Health Check
curl https://arch-backend-90c5.onrender.com/api/health

# Get Products
curl https://arch-backend-90c5.onrender.com/api/products

# Create Order (POST)
curl -X POST https://arch-backend-90c5.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "items": [
      {
        "productId": "1",
        "productName": "Test Product",
        "price": 10.00,
        "quantity": 1
      }
    ]
  }'
```

### 6. Problemas Comunes del Backend

#### Error: "Application failed to respond"
**Causa:** El servidor no está escuchando en el puerto correcto.
**Solución:**
```typescript
// Verificar en src/index.ts
const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => { // ← Importante: '0.0.0.0'
  logger.info(`Server running on port ${port}`);
});
```

#### Error: "Database connection timeout"
**Causa:** Neon DB no accesible o URL incorrecta.
**Solución:**
1. Verificar DATABASE_URL en Render
2. Verificar que Neon DB esté activo
3. Verificar que la IP de Render esté permitida en Neon (si aplica)

#### Error: "Module not found"
**Causa:** Dependencias no instaladas correctamente.
**Solución:**
```bash
# Verificar package.json
# Asegurar que todas las dependencias estén en "dependencies", no en "devDependencies"
# Render solo instala "dependencies" en producción
```

---

## 🌐 Debugging del Frontend (Vercel)

### 1. Acceder a Logs de Vercel

**Opción A: Dashboard de Vercel**
1. Ir a https://vercel.com/dashboard
2. Seleccionar el proyecto
3. Click en "Deployments"
4. Click en el deployment más reciente
5. Ver "Build Logs" y "Function Logs"

**Opción B: CLI de Vercel**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Ver logs del último deployment
vercel logs [deployment-url]

# Ver logs en tiempo real
vercel logs --follow
```

### 2. Verificar Variables de Entorno

**En Dashboard de Vercel:**
1. Ir a proyecto → "Settings" → "Environment Variables"
2. Verificar que existan:
   ```
   NEXT_PUBLIC_API_URL=https://arch-backend-90c5.onrender.com/api
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   UPLOADTHING_SECRET=sk_...
   UPLOADTHING_APP_ID=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
   ```

**⚠️ Importante:** 
- Variables que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente
- Redeploy después de cambiar variables

### 3. Verificar Build Local

```bash
cd store
npm install
npm run build

# Debe completar sin errores
# Verificar output:
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages
```

### 4. Debugging de API Calls

**Abrir DevTools del Navegador:**
1. F12 → Network Tab
2. Filtrar por "Fetch/XHR"
3. Recargar la página
4. Verificar requests a `arch-backend-90c5.onrender.com`

**Errores Comunes:**
- ❌ **CORS Error:** Backend no permite el origen de Vercel
- ❌ **404:** URL del API incorrecta
- ❌ **500:** Error en el backend
- ❌ **Network Error:** Backend no responde

**Solución para CORS:**
```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'https://tu-dominio.vercel.app',
    'https://tu-dominio-git-*.vercel.app', // Preview deployments
    'http://localhost:3000' // Desarrollo local
  ],
  credentials: true
}));
```

### 5. Debugging de Clerk (Autenticación)

**Verificar Configuración:**
```bash
# Verificar que las keys estén configuradas
# En Clerk Dashboard:
# 1. Ir a https://dashboard.clerk.com
# 2. Seleccionar la aplicación
# 3. API Keys → Copiar keys
# 4. Verificar que coincidan con las de Vercel
```

**Test de Autenticación:**
1. Ir a `/sign-in` en tu app
2. Intentar hacer login
3. Verificar en DevTools → Console
4. Buscar errores de Clerk

### 6. Debugging de Stripe/PayPal

**Stripe:**
```javascript
// Verificar en DevTools Console
console.log('Stripe Key:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Debe empezar con pk_test_ o pk_live_
```

**PayPal:**
```javascript
// Verificar en DevTools Console
console.log('PayPal Client ID:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
```

### 7. Problemas Comunes del Frontend

#### Error: "Hydration failed"
**Causa:** Diferencia entre HTML del servidor y cliente.
**Solución:**
```typescript
// Usar useEffect para código que solo debe correr en cliente
useEffect(() => {
  // Código que usa localStorage, window, etc.
}, []);
```

#### Error: "API_URL is not defined"
**Causa:** Variable de entorno no configurada.
**Solución:**
1. Verificar que `NEXT_PUBLIC_API_URL` esté en Vercel
2. Hacer redeploy
3. Verificar en código:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://arch-backend-90c5.onrender.com/api';
```

#### Error: "Failed to fetch products"
**Causa:** Backend no responde o CORS bloqueado.
**Solución:**
1. Verificar que backend esté activo
2. Verificar CORS en backend
3. Verificar URL en `lib/api.ts`

---

## 🗄️ Debugging de Base de Datos (Neon)

### 1. Acceder a Neon Dashboard

1. Ir a https://console.neon.tech
2. Seleccionar el proyecto
3. Ver "Databases" → "arch_project"

### 2. Verificar Conexión

**Desde Neon Console:**
```sql
-- En el SQL Editor de Neon
SELECT NOW();
SELECT version();

-- Verificar tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Debe mostrar: products, orders, order_items
```

**Desde Local:**
```bash
# Instalar psql (PostgreSQL client)
# Windows: https://www.postgresql.org/download/windows/

# Conectar a Neon
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Verificar productos
SELECT * FROM products;
```

### 3. Verificar Schema

```sql
-- Verificar estructura de products
\d products

-- Verificar estructura de orders
\d orders

-- Verificar estructura de order_items
\d order_items

-- Verificar foreign keys
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### 4. Verificar Datos

```sql
-- Contar productos
SELECT COUNT(*) FROM products;

-- Ver productos
SELECT id, name, price, category FROM products LIMIT 10;

-- Contar órdenes
SELECT COUNT(*) FROM orders;

-- Ver órdenes recientes
SELECT id, customer_email, total, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

### 5. Problemas Comunes de Base de Datos

#### Error: "relation 'products' does not exist"
**Causa:** Schema no creado.
**Solución:**
```bash
# Ejecutar schema.sql
cd backend
psql $DATABASE_URL -f database/schema.sql
```

#### Error: "password authentication failed"
**Causa:** Credenciales incorrectas.
**Solución:**
1. Verificar DATABASE_URL en Render
2. Regenerar password en Neon si es necesario
3. Actualizar en Render

#### Error: "too many connections"
**Causa:** Connection pool agotado.
**Solución:**
```typescript
// backend/src/config/database.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Reducir si es necesario
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## 🔄 Workflows de GitHub Actions

### Estado Actual: ❌ NO CONFIGURADO

El proyecto actualmente **NO tiene** workflows de GitHub Actions. Los deployments se hacen mediante:
- **Render:** Auto-deploy desde branch `main`
- **Vercel:** Auto-deploy desde GitHub (integración nativa)

### Workflows Recomendados

#### 1. CI Workflow

Crear `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint || echo "No lint script"
    
    - name: Build
      run: npm run build
    
    - name: Test
      run: npm test || echo "No tests yet"

  test-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./store
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: store/package-lock.json
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build
      env:
        NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
```

#### 2. Deploy Notification Workflow

Crear `.github/workflows/deploy-notification.yml`:

```yaml
name: Deploy Notification

on:
  deployment_status:

jobs:
  notify:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success' || github.event.deployment_status.state == 'failure'
    
    steps:
    - name: Send notification
      run: |
        echo "Deployment ${{ github.event.deployment_status.state }}"
        echo "Environment: ${{ github.event.deployment.environment }}"
        echo "URL: ${{ github.event.deployment_status.target_url }}"
```

#### 3. Database Migration Workflow

Crear `.github/workflows/db-migrate.yml`:

```yaml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to migrate'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - staging

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PostgreSQL Client
      run: |
        sudo apt-get update
        sudo apt-get install -y postgresql-client
    
    - name: Run migrations
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
      run: |
        psql $DATABASE_URL -f backend/database/schema.sql
```

### Configurar Secrets en GitHub

1. Ir a repositorio → Settings → Secrets and variables → Actions
2. Agregar secrets:
   ```
   DATABASE_URL
   NEXT_PUBLIC_API_URL
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   CLERK_SECRET_KEY
   UPLOADTHING_SECRET
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   ```

---

## ✅ Checklist de Deployment

### Pre-Deployment

- [ ] Código commiteado y pusheado a GitHub
- [ ] Tests pasando localmente
- [ ] Build exitoso localmente (backend y frontend)
- [ ] Variables de entorno documentadas
- [ ] Secrets configurados en servicios cloud
- [ ] Base de datos migrada

### Backend (Render)

- [ ] Servicio creado en Render
- [ ] Variables de entorno configuradas
- [ ] DATABASE_URL apunta a Neon
- [ ] Dockerfile presente y correcto
- [ ] Health check endpoint funcional
- [ ] CORS configurado correctamente
- [ ] Logs sin errores

### Frontend (Vercel)

- [ ] Proyecto conectado a GitHub
- [ ] Variables de entorno configuradas
- [ ] NEXT_PUBLIC_API_URL correcto
- [ ] Build exitoso en Vercel
- [ ] Clerk configurado
- [ ] Stripe/PayPal configurados
- [ ] UploadThing configurado

### Base de Datos (Neon)

- [ ] Proyecto creado en Neon
- [ ] Schema ejecutado
- [ ] Datos de prueba insertados
- [ ] Connection string copiado a Render
- [ ] Backups configurados (opcional)

### Post-Deployment

- [ ] Health check responde OK
- [ ] Frontend carga correctamente
- [ ] Productos se muestran
- [ ] Autenticación funciona
- [ ] Carrito funciona
- [ ] Checkout funciona (test mode)
- [ ] Uploads funcionan
- [ ] Logs sin errores críticos

---

## 🆘 Comandos de Emergencia

### Backend No Responde
```bash
# 1. Verificar health check
curl https://arch-backend-90c5.onrender.com/api/health

# 2. Si falla, verificar logs en Render Dashboard

# 3. Forzar redeploy
# En Render Dashboard: Manual Deploy → Deploy latest commit
```

### Frontend No Carga
```bash
# 1. Verificar deployment en Vercel
vercel ls

# 2. Ver logs del último deployment
vercel logs [deployment-url]

# 3. Forzar redeploy
vercel --prod
```

### Base de Datos No Conecta
```bash
# 1. Verificar que Neon esté activo
# Ir a console.neon.tech

# 2. Test de conexión
psql $DATABASE_URL -c "SELECT 1"

# 3. Verificar DATABASE_URL en Render
# Dashboard → Environment → DATABASE_URL
```

### Rollback de Deployment

**Render:**
1. Dashboard → Deployments
2. Seleccionar deployment anterior exitoso
3. Click en "Redeploy"

**Vercel:**
```bash
# Promover deployment anterior a producción
vercel promote [deployment-url]
```

---

## 📞 Recursos de Soporte

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Clerk Docs:** https://clerk.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Última Actualización:** 31 de Diciembre, 2025  
**Mantenido por:** Equipo de Desarrollo Arch Project
