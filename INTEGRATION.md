# Frontend-Backend Integration Guide

## 🔗 Conexión Establecida

El frontend Next.js ahora está completamente integrado con el backend Express.

### 📡 API Client

Se ha creado un cliente API en `src/lib/api.ts` que maneja todas las comunicaciones con el backend:

**Endpoints disponibles:**
- `getProducts()` - Obtener todos los productos
- `getProductById(id)` - Obtener producto por ID
- `createOrder(orderData)` - Crear nueva orden
- `getOrder(orderId)` - Obtener orden por ID
- `createPaymentIntent(orderId)` - Crear intención de pago con Stripe

### 🔧 Configuración

**Backend URL:**
- Desarrollo: `http://localhost:3001/api`
- Producción: Configurar en `.env.local`

Para configurar la URL del backend, crea un archivo `.env.local` en la raíz del proyecto frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 📦 Migración de Datos

El sistema ha migrado de archivos JSON a PostgreSQL:

**Antes:**
- Productos: `data/products.json`
- Órdenes: Almacenadas en memoria

**Ahora:**
- Productos: Tabla `products` en PostgreSQL
- Órdenes: Tabla `orders` + `order_items` en PostgreSQL

### 🚀 Cómo Usar

#### 1. En Server Components (Recomendado)

```typescript
import { getProducts } from '@/lib/products';

export default async function Page() {
  const products = await getProducts();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### 2. En Client Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getProducts, Product } from '@/lib/api';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### 3. Crear Orden

```typescript
import { createOrder } from '@/lib/api';

const order = await createOrder({
  customerEmail: 'user@example.com',
  customerName: 'John Doe',
  items: [
    {
      productId: '1',
      productName: 'Product Name',
      price: 9.99,
      quantity: 1
    }
  ]
});

console.log('Order created:', order.id);
```

#### 4. Procesar Pago

```typescript
import { createPaymentIntent } from '@/lib/api';

const { clientSecret } = await createPaymentIntent(order.id);
// Usar clientSecret con Stripe Elements
```

### 🔄 Flujo de Compra Completo

1. **Usuario navega productos** → `getProducts()` desde PostgreSQL
2. **Usuario agrega al carrito** → Estado local (CartContext)
3. **Usuario va a checkout** → `createOrder()` crea orden en DB
4. **Usuario paga** → `createPaymentIntent()` inicia pago con Stripe
5. **Pago exitoso** → Webhook actualiza estado de orden a 'completed'

### 🛠️ Manejo de Errores

Todos los métodos de API incluyen manejo de errores:

```typescript
try {
  const products = await getProducts();
} catch (error) {
  console.error('Error fetching products:', error);
  // Mostrar mensaje de error al usuario
}
```

### 📊 Tipos TypeScript

Todos los tipos están compartidos entre frontend y backend:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  fileUrl: string;
}

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  paymentIntentId?: string;
}
```

### 🔐 CORS

El backend tiene CORS habilitado para todas las origins en desarrollo. Para producción, actualizar en `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: 'https://tu-dominio.com'
}));
```

### 🧪 Testing de Integración

Para verificar que la integración funciona:

1. Asegúrate que el backend esté corriendo: `cd backend && npm run dev`
2. Asegúrate que PostgreSQL esté corriendo y la DB esté creada
3. Inicia el frontend: `cd store && npm run dev`
4. Navega a `http://localhost:3000`
5. Los productos deberían cargarse desde la API

### 📝 Notas Importantes

- El frontend usa **Server Components** por defecto para mejor SEO y performance
- Las llamadas a la API desde Server Components se hacen en el servidor (no expone credenciales)
- El carrito se mantiene en estado local del cliente (CartContext)
- Las órdenes solo se crean cuando el usuario va a checkout
- Los pagos se procesan con Stripe Elements en el cliente

### 🚨 Troubleshooting

**Productos no cargan:**
- Verifica que el backend esté corriendo en puerto 3001
- Verifica que PostgreSQL esté corriendo
- Revisa la consola del navegador para errores de CORS

**Error de conexión a DB:**
- Verifica credenciales en `backend/.env`
- Asegúrate que la base de datos `arch_project` existe
- Ejecuta `setup-database.ps1` para crear las tablas

**CORS errors:**
- Verifica que el backend tenga CORS habilitado
- Asegúrate que `NEXT_PUBLIC_API_URL` esté configurado correctamente
