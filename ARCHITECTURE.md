# 🏗️ Arch Project - System Architecture

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Pages      │  │  Components  │  │   Context    │         │
│  │              │  │              │  │              │         │
│  │ • Home       │  │ • ProductCard│  │ • CartContext│         │
│  │ • Products   │  │ • Header     │  │              │         │
│  │ • Cart       │  │ • Footer     │  │              │         │
│  │ • Checkout   │  │ • Button     │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              API Client (src/lib/api.ts)                  │  │
│  │  • getProducts()                                          │  │
│  │  • getProductById()                                       │  │
│  │  • createOrder()                                          │  │
│  │  • createPaymentIntent()                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             │ JSON
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS BACKEND                            │
│                  http://localhost:3001/api                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Routes                               │  │
│  │  /api/products     /api/orders     /api/payment          │  │
│  └────────────┬──────────────┬──────────────┬────────────────┘  │
│               │              │              │                   │
│  ┌────────────▼──────────────▼──────────────▼────────────────┐  │
│  │                    Controllers                            │  │
│  │  products.controller  orders.controller  payment.controller│ │
│  └────────────┬──────────────┬──────────────┬────────────────┘  │
│               │              │              │                   │
│  ┌────────────▼──────────────▼──────────────▼────────────────┐  │
│  │                     Services                              │  │
│  │  ProductService   OrderService   PaymentService           │  │
│  └────────────┬──────────────┬──────────────┬────────────────┘  │
│               │              │              │                   │
│               └──────────────┴──────────────┘                   │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Database Connection Pool                       │  │
│  │                  (pg library)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ SQL Queries
                             │ Connection Pool
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                           │
│                     localhost:5432                               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  products    │  │   orders     │  │ order_items  │         │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤         │
│  │ id           │  │ id           │  │ id           │         │
│  │ name         │  │ customer_*   │  │ order_id     │         │
│  │ description  │  │ total        │  │ product_id   │         │
│  │ price        │  │ status       │  │ product_name │         │
│  │ category     │  │ payment_*    │  │ price        │         │
│  │ image        │  │ created_at   │  │ quantity     │         │
│  │ file_url     │  │ updated_at   │  │ created_at   │         │
│  │ created_at   │  └──────────────┘  └──────────────┘         │
│  │ updated_at   │                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ (Optional)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STRIPE API                                  │
│                   (Payment Processing)                           │
│                                                                  │
│  • Payment Intents                                              │
│  • Webhooks                                                     │
│  • Payment Status                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Examples

### 1. Loading Products

```
User visits homepage
    ↓
Next.js Server Component calls getProducts()
    ↓
API client: GET http://localhost:3001/api/products
    ↓
Express routes to products.controller.getProducts()
    ↓
Controller calls ProductService.getProducts()
    ↓
Service queries: SELECT * FROM products
    ↓
PostgreSQL returns product rows
    ↓
Service transforms to Product objects
    ↓
Controller sends JSON response
    ↓
API client receives products array
    ↓
Next.js renders ProductCard components
    ↓
User sees products on page
```

### 2. Creating an Order

```
User clicks "Checkout"
    ↓
Frontend calls createOrder() with cart items
    ↓
API client: POST http://localhost:3001/api/orders
    ↓
Express routes to orders.controller.createOrder()
    ↓
Controller calls OrderService.createOrder()
    ↓
Service starts database transaction
    ↓
Service: INSERT INTO orders (...)
    ↓
Service: INSERT INTO order_items (...) for each item
    ↓
Service commits transaction
    ↓
PostgreSQL confirms inserts
    ↓
Service returns Order object
    ↓
Controller sends JSON response with order ID
    ↓
Frontend receives order
    ↓
User redirected to payment page
```

### 3. Processing Payment

```
User enters payment details
    ↓
Frontend calls createPaymentIntent(orderId)
    ↓
API client: POST http://localhost:3001/api/payment/create-payment-intent
    ↓
Express routes to payment.controller.createPaymentIntent()
    ↓
Controller calls PaymentService.createPaymentIntent()
    ↓
Service gets order from database
    ↓
Service calls Stripe API to create payment intent
    ↓
Stripe returns client secret
    ↓
Service updates order with payment_intent_id
    ↓
Controller sends client secret to frontend
    ↓
Frontend uses Stripe Elements to process payment
    ↓
Stripe processes payment
    ↓
Stripe sends webhook to backend
    ↓
Backend updates order status to 'completed'
    ↓
User sees success message
```

## 📦 Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: CSS Modules / Tailwind
- **State**: React Context API
- **Routing**: Next.js App Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database Client**: node-postgres (pg)
- **Payment**: Stripe SDK
- **Dev Tools**: ts-node-dev

### Database
- **DBMS**: PostgreSQL 14+
- **Schema**: Relational (3 tables)
- **Features**: 
  - Foreign keys
  - Indexes
  - Triggers
  - Transactions

### DevOps
- **Package Manager**: npm
- **Process Manager**: ts-node-dev (dev)
- **Environment**: dotenv
- **Scripts**: PowerShell

## 🔐 Security Features

- ✅ Environment variables for secrets
- ✅ SQL parameterized queries (prevents SQL injection)
- ✅ CORS configuration
- ✅ Stripe webhook signature verification
- ✅ Database connection pooling
- ✅ Transaction safety for orders

## 📈 Scalability Considerations

### Current Setup (Development)
- Single server instance
- Connection pooling (max 10 connections)
- JSON file for sessions
- CORS open to all origins

### Production Recommendations
1. **Database**
   - Increase connection pool size
   - Add read replicas
   - Implement caching (Redis)

2. **Backend**
   - Deploy multiple instances
   - Add load balancer
   - Implement rate limiting
   - Add logging (Winston)

3. **Frontend**
   - Deploy to CDN (Vercel)
   - Implement ISR (Incremental Static Regeneration)
   - Add image optimization

4. **Security**
   - Restrict CORS to specific origins
   - Add authentication (JWT)
   - Implement HTTPS
   - Add API key validation

## 🎯 Data Models

### Product
```typescript
{
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  fileUrl: string
}
```

### Order
```typescript
{
  id: string
  customerEmail: string
  customerName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  paymentIntentId?: string
}
```

### OrderItem
```typescript
{
  productId: string
  productName: string
  price: number
  quantity: number
}
```

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/:id | Get single product |
| POST | /api/orders | Create new order |
| GET | /api/orders | List all orders |
| GET | /api/orders/:id | Get single order |
| PATCH | /api/orders/:id/status | Update order status |
| POST | /api/payment/create-payment-intent | Create Stripe payment |
| POST | /api/payment/webhook | Stripe webhook handler |
| GET | /api/payment/status/:id | Get payment status |
| GET | /api/health | Health check |

## 🌐 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | localhost:5432 |

## 📁 File Structure

```
Arch_Project/
├── backend/                    # Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts    # DB connection
│   │   ├── controllers/       # Route handlers
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── types/             # TypeScript types
│   ├── database/
│   │   └── schema.sql         # Database schema
│   └── package.json
│
├── store/                      # Next.js app
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   ├── components/        # React components
│   │   ├── context/           # React Context
│   │   └── lib/               # Utilities & API
│   └── package.json
│
├── README.md                   # Main documentation
├── QUICKSTART.md              # Quick start guide
├── INTEGRATION.md             # Integration guide
├── COMPLETE.md                # Implementation summary
├── ARCHITECTURE.md            # This file
└── start.ps1                  # Startup script
```

## 🎓 Learning Resources

This architecture demonstrates:
- **Full-stack development** with TypeScript
- **RESTful API** design patterns
- **Database design** with PostgreSQL
- **React patterns** (Context, Server Components)
- **Payment integration** with Stripe
- **Modern web architecture** (SPA + API)

Perfect for learning modern web development! 🚀
