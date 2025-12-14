# Arch Project Backend

Backend API para la tienda de componentes de AutoCAD.

## Características

- **API RESTful** con Express y TypeScript
- **Gestión de productos** - CRUD completo
- **Sistema de pedidos** - Creación y seguimiento de órdenes
- **Integración con Stripe** - Procesamiento de pagos
- **Webhooks** - Manejo de eventos de Stripe
- **CORS habilitado** - Para integración con frontend

## Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/       # Controladores de rutas
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   └── payment.controller.ts
│   ├── routes/           # Definición de rutas
│   │   ├── products.routes.ts
│   │   ├── orders.routes.ts
│   │   └── payment.routes.ts
│   ├── services/         # Lógica de negocio
│   │   ├── order.service.ts
│   │   └── payment.service.ts
│   ├── types/            # Definiciones de TypeScript
│   │   ├── product.ts
│   │   └── order.ts
│   ├── data/             # Almacenamiento JSON
│   │   ├── products.json
│   │   └── orders.json
│   └── index.ts          # Punto de entrada
├── .env                  # Variables de entorno
├── package.json
└── tsconfig.json
```

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` con las siguientes variables:

```env
PORT=3001
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

## Producción

```bash
npm run build
npm start
```

## Endpoints API

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto por ID

### Órdenes

- `POST /api/orders` - Crear una nueva orden
  ```json
  {
    "customerEmail": "user@example.com",
    "customerName": "John Doe",
    "items": [
      {
        "productId": "1",
        "productName": "Producto",
        "price": 9.99,
        "quantity": 1
      }
    ]
  }
  ```
- `GET /api/orders` - Obtener todas las órdenes
- `GET /api/orders/:id` - Obtener una orden por ID
- `PATCH /api/orders/:id/status` - Actualizar estado de orden

### Pagos

- `POST /api/payment/create-payment-intent` - Crear intención de pago
  ```json
  {
    "orderId": "order_123456"
  }
  ```
- `POST /api/payment/webhook` - Webhook de Stripe (configurar en Stripe Dashboard)
- `GET /api/payment/status/:paymentIntentId` - Obtener estado de pago

### Health Check

- `GET /api/health` - Verificar estado del servidor

## Integración con Stripe

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Obtén tus claves API del Dashboard
3. Configura el webhook en Stripe Dashboard:
   - URL: `https://tu-dominio.com/api/payment/webhook`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copia el webhook secret a tu `.env`

## Notas de Desarrollo

- Los datos se almacenan en archivos JSON en `src/data/`
- Para producción, considera migrar a una base de datos real (PostgreSQL, MongoDB, etc.)
- El servidor usa `ts-node-dev` para hot-reload en desarrollo
- CORS está habilitado para todas las origins (ajustar en producción)
