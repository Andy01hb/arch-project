# Arch Project - Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn package manager

### 1. Database Setup

```bash
# Navigate to backend
cd backend

# Run database setup script (Windows)
.\setup-database.ps1

# Or manually with psql
psql -U postgres -f database/schema.sql
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and update values
cp .env.example .env

# Update .env with your database credentials:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arch_project
DB_USER=postgres
DB_PASSWORD=your_password

# Start development server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
# Navigate to store
cd ../store

# Install dependencies
npm install

# Create .env.local file (optional, uses localhost:3001 by default)
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Verify Setup

1. Open `http://localhost:3000` in your browser
2. You should see 3 products loaded from the database
3. Try adding products to cart
4. Navigate to cart page

## 📁 Project Structure

```
Arch_Project/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   ├── database/           # SQL schemas
│   ├── .env               # Environment variables (create from .env.example)
│   └── package.json
│
├── store/                  # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── context/       # React context (Cart)
│   │   └── lib/           # Utilities & API client
│   ├── public/            # Static assets
│   └── package.json
│
└── INTEGRATION.md         # Integration documentation
```

## 🔧 Configuration

### Backend (.env)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arch_project
DB_USER=postgres
DB_PASSWORD=postgres
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🧪 Testing

### Test Backend API

```bash
cd backend
.\test-api.ps1
```

### Test Frontend

1. Navigate to `http://localhost:3000`
2. Browse products
3. Add to cart
4. View cart
5. Proceed to checkout

## 📊 Database Schema

### Tables

- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Order line items

### Sample Data

The setup script inserts 3 sample products:
1. Bloque Dinámico: Puerta Residencial ($4.99)
2. Set de Vegetación 2D ($12.50)
3. Detalle Estructural: Zapata Aislada ($8.00)

## 🔐 Stripe Setup (Optional)

For payment processing:

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Update backend `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Configure webhook endpoint in Stripe Dashboard

## 🚨 Troubleshooting

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -U postgres -l | grep arch_project

# Recreate database if needed
psql -U postgres -f backend/database/schema.sql
```

### Port Already in Use

```bash
# Backend (3001)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Frontend (3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Products Not Loading

1. Check backend is running: `http://localhost:3001/api/health`
2. Check database has products: `SELECT * FROM products;`
3. Check browser console for errors
4. Verify CORS is enabled in backend

## 📚 Documentation

- [Backend README](backend/README.md)
- [Integration Guide](INTEGRATION.md)
- [Backend Implementation](backend/IMPLEMENTATION.md)

## 🎯 Next Steps

1. Configure Stripe for payments
2. Add more products to database
3. Customize frontend design
4. Deploy to production
5. Set up CI/CD pipeline

## 💡 Tips

- Use PostgreSQL GUI tools like pgAdmin for easier database management
- Install REST client (Postman, Insomnia) for API testing
- Enable React DevTools for debugging frontend
- Check backend logs for API errors
