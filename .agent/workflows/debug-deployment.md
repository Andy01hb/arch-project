---
description: Debug deployment issues for Render, Neon, and Vercel
---

# Workflow: Debug Deployment Issues

Este workflow te guía paso a paso para debuggear y solucionar los problemas de deployment del Arch Project.

## 🔍 Diagnóstico Inicial

### 1. Verificar Estado del Backend en Render

```powershell
# Test health endpoint
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/health" -UseBasicParsing | Select-Object StatusCode, Content

# Test products endpoint (actualmente falla)
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/products" -UseBasicParsing
```

**Resultado Esperado:**
- Health: 200 OK
- Products: Actualmente 500 (problema de DB)

---

## 🗄️ Paso 1: Configurar Neon Database

### 1.1 Acceder a Neon Dashboard
1. Ve a [https://console.neon.tech](https://console.neon.tech)
2. Inicia sesión con tu cuenta
3. Busca el proyecto "arch-project" o crea uno nuevo

### 1.2 Obtener Connection String
1. En el dashboard de Neon, ve a "Connection Details"
2. Copia el **Connection String** completo
3. Debe verse así:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### 1.3 Verificar Schema en Neon
Conecta a Neon y verifica si las tablas existen:

```sql
-- Conectar vía SQL Editor en Neon Dashboard o psql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Si NO existen las tablas, continúa al Paso 1.4**

### 1.4 Aplicar Schema a Neon

**Opción A: Desde Neon SQL Editor (Recomendado)**
1. En Neon Dashboard → SQL Editor
2. Copia el contenido de `arch_project_dump.sql`
3. Pégalo en el editor
4. Ejecuta

**Opción B: Desde Local con psql**
```powershell
# Reemplaza con tu connection string
$connectionString = "postgresql://user:pass@host/db?sslmode=require"
psql $connectionString -f arch_project_dump.sql
```

### 1.5 Verificar Datos
```sql
-- Debe retornar 3 productos de ejemplo
SELECT COUNT(*) FROM products;
SELECT name, price FROM products;
```

---

## 🚀 Paso 2: Configurar Variables de Entorno en Render

### 2.1 Acceder a Render Dashboard
1. Ve a [https://dashboard.render.com](https://dashboard.render.com)
2. Busca el servicio "arch-backend" o similar

### 2.2 Agregar DATABASE_URL
1. En el servicio → **Environment**
2. Click en **Add Environment Variable**
3. Agregar:
   ```
   Key: DATABASE_URL
   Value: [Pega aquí el Connection String de Neon]
   ```

### 2.3 Agregar Otras Variables (Opcionales)
```
NODE_ENV=production
PORT=3001
STRIPE_SECRET_KEY=sk_test_... (si tienes)
STRIPE_WEBHOOK_SECRET=whsec_... (si tienes)
```

### 2.4 Guardar y Redeploy
1. Click en **Save Changes**
2. Render automáticamente hará redeploy
3. Espera 2-3 minutos

---

## ✅ Paso 3: Verificar Backend Funcionando

### 3.1 Esperar Redeploy
Monitorea los logs en Render Dashboard:
```
Building...
Deploying...
Live ✓
```

### 3.2 Probar Endpoints

```powershell
# Health check (debe seguir funcionando)
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/health" -UseBasicParsing

# Products (ahora debe funcionar)
$response = Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/products" -UseBasicParsing
$response.Content | ConvertFrom-Json
```

**Resultado Esperado:**
```json
[
  {
    "id": "uuid",
    "name": "Bloque Dinámico: Puerta Residencial",
    "price": 4.99,
    ...
  },
  ...
]
```

---

## 🌐 Paso 4: Verificar/Desplegar Frontend en Vercel

### 4.1 Verificar si ya está desplegado
Busca en tu Vercel Dashboard si existe el proyecto "arch-project" o "store"

### 4.2 Si NO está desplegado

**Opción A: Deploy desde Vercel Dashboard**
1. Ve a [https://vercel.com/new](https://vercel.com/new)
2. Importa el repositorio: `Andy01hb/arch-project`
3. Configuración:
   - **Root Directory:** `store`
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

**Opción B: Deploy desde CLI**
```powershell
cd store

# Instalar Vercel CLI si no lo tienes
npm install -g vercel

# Deploy
vercel --prod
```

### 4.3 Configurar Variables de Entorno en Vercel (si es necesario)

Si el frontend necesita variables de entorno:
1. Vercel Dashboard → Proyecto → Settings → Environment Variables
2. Agregar:
   ```
   NEXT_PUBLIC_API_URL=https://arch-backend-90c5.onrender.com/api
   ```

**Nota:** Actualmente la URL está hardcodeada en `store/src/lib/api.ts`, así que esto es opcional.

---

## 🧪 Paso 5: Prueba End-to-End

### 5.1 Abrir Frontend
1. Ve a la URL de Vercel (ej: `https://arch-project.vercel.app`)
2. O si no está desplegado, usa local: `http://localhost:3000`

### 5.2 Verificar Funcionalidad
- [ ] La página carga sin errores
- [ ] Los productos se muestran (cargados desde Render → Neon)
- [ ] Puedes hacer click en un producto
- [ ] Puedes agregar al carrito
- [ ] El carrito funciona

### 5.3 Verificar Console del Navegador
1. Abre DevTools (F12)
2. Ve a Console
3. No debe haber errores de red o API

---

## 🐛 Troubleshooting

### Problema: Backend sigue dando 500 en /products

**Posibles Causas:**
1. DATABASE_URL mal configurada
2. Schema no aplicado en Neon
3. Credenciales incorrectas

**Solución:**
```powershell
# Ver logs en Render Dashboard
# Busca errores como:
# "Error fetching products"
# "Connection refused"
# "password authentication failed"
```

### Problema: Frontend no carga productos

**Verificar:**
1. Abre DevTools → Network
2. Busca la request a `/api/products`
3. Verifica el status code y response

**Si es CORS error:**
```typescript
// backend/src/index.ts
// Verificar que CORS está habilitado:
app.use(cors()); // Debe estar presente
```

### Problema: Render no redeploy automáticamente

**Solución:**
1. Render Dashboard → Manual Deploy
2. O hacer un push a GitHub:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

---

## 📊 Checklist Final

Marca cada item cuando esté completo:

### Neon Database
- [ ] Base de datos creada en Neon
- [ ] Connection string obtenido
- [ ] Schema aplicado (tablas: products, orders, order_items)
- [ ] Productos de ejemplo insertados
- [ ] Query de prueba funciona

### Render Backend
- [ ] DATABASE_URL configurada
- [ ] Otras variables de entorno configuradas
- [ ] Redeploy completado exitosamente
- [ ] `/api/health` retorna 200
- [ ] `/api/products` retorna array de productos (no 500)
- [ ] Logs no muestran errores

### Vercel Frontend (Opcional)
- [ ] Proyecto desplegado en Vercel
- [ ] Build exitoso
- [ ] Variables de entorno configuradas (si es necesario)
- [ ] URL accesible

### Integración
- [ ] Frontend carga productos desde backend
- [ ] No hay errores en console del navegador
- [ ] Flujo completo funciona (browse → cart → checkout)

---

## 🎯 Resultado Esperado

Al completar este workflow:

✅ Backend en Render conectado a Neon  
✅ Endpoints de API funcionando  
✅ Frontend mostrando productos desde la DB  
✅ Aplicación completamente funcional en producción  

---

## 📞 Comandos de Verificación Rápida

```powershell
# Test completo del stack
# 1. Backend health
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/health" -UseBasicParsing

# 2. Backend products
Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/products" -UseBasicParsing

# 3. Frontend (reemplaza con tu URL de Vercel)
Invoke-WebRequest -Uri "https://arch-project.vercel.app" -UseBasicParsing
```

---

**Última Actualización:** 31 de Diciembre, 2025  
**Mantenido por:** Andy01hb
