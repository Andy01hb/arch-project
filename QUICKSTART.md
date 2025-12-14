# 🚀 QUICK START GUIDE

## Prerequisites Check

Before starting, make sure you have:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed
- [ ] PostgreSQL service running

## Step-by-Step Setup

### 1️⃣ Install PostgreSQL (if not installed)

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set for 'postgres' user
4. Make sure PostgreSQL service is running

**Verify installation:**
```powershell
pg_isready
# Should output: accepting connections
```

### 2️⃣ Create Database

**Option A: Automated (Recommended)**
```powershell
cd backend
.\setup-database.ps1
```

**Option B: Manual**
```powershell
cd backend
psql -U postgres -f database\schema.sql
# Enter your postgres password when prompted
```

### 3️⃣ Configure Backend

1. Navigate to `backend` folder
2. Update `.env` file (or create from `.env.example`):
   ```env
   DB_PASSWORD=your_postgres_password
   ```

### 4️⃣ Install Dependencies

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../store
npm install
```

### 5️⃣ Start Everything

**Option A: Use Start Script (Easiest)**
```powershell
# From project root
.\start.ps1
```

**Option B: Manual Start**
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd store
npm run dev
```

### 6️⃣ Verify It Works

1. Open browser to: http://localhost:3000
2. You should see 3 products
3. Try adding one to cart
4. Navigate to cart page

## 🎯 Expected Results

✅ Backend running on http://localhost:3001
✅ Frontend running on http://localhost:3000
✅ 3 products visible on homepage
✅ Can add products to cart
✅ Can view cart

## 🚨 Troubleshooting

### "PostgreSQL not found"
- Install PostgreSQL from official website
- Add PostgreSQL bin folder to PATH
- Restart terminal

### "Database connection failed"
- Check PostgreSQL service is running:
  ```powershell
  # Windows
  Get-Service postgresql*
  ```
- Verify password in `backend/.env`
- Check database exists:
  ```powershell
  psql -U postgres -l | findstr arch_project
  ```

### "Port 3000 already in use"
- Stop other Next.js apps
- Or change port in `store/package.json`:
  ```json
  "dev": "next dev -p 3001"
  ```

### "Port 3001 already in use"
- Stop other backend servers
- Or change port in `backend/.env`:
  ```env
  PORT=3002
  ```

### Products not loading
1. Check backend is running: http://localhost:3001/api/health
2. Check database has products:
   ```powershell
   psql -U postgres -d arch_project -c "SELECT * FROM products;"
   ```
3. Check browser console for errors (F12)

## 📚 Next Steps

Once everything is running:

1. **Explore the app**
   - Browse products
   - Add to cart
   - View cart
   - Try checkout flow

2. **Configure Stripe (Optional)**
   - Get API keys from stripe.com
   - Add to `backend/.env`
   - Test payment flow

3. **Add more products**
   ```sql
   INSERT INTO products (name, description, price, category, image, file_url)
   VALUES ('Your Product', 'Description', 19.99, 'Category', '/images/product.jpg', 'files/product.dwg');
   ```

4. **Customize design**
   - Edit files in `store/src/app`
   - Modify styles in `store/src/app/globals.css`

## 💡 Useful Commands

```powershell
# Check if services are running
netstat -ano | findstr :3000  # Frontend
netstat -ano | findstr :3001  # Backend
netstat -ano | findstr :5432  # PostgreSQL

# View database
psql -U postgres -d arch_project

# Test backend API
cd backend
.\test-api.ps1

# View backend logs
# Check the terminal where backend is running

# Rebuild frontend
cd store
npm run build
```

## 🎓 Understanding the Stack

**Frontend (Next.js)**
- React 19 with Server Components
- TypeScript for type safety
- Tailwind CSS for styling (if used)
- Cart managed with React Context

**Backend (Express)**
- RESTful API
- TypeScript
- PostgreSQL database
- Stripe for payments

**Database (PostgreSQL)**
- Products table
- Orders table
- Order items table

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `arch_project` created
- [ ] Tables created (products, orders, order_items)
- [ ] Sample products inserted
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can see products on homepage
- [ ] Can add products to cart
- [ ] No errors in browser console
- [ ] No errors in backend terminal

## 🎉 You're Ready!

If all checkboxes above are checked, you have successfully set up the Arch Project!

Visit: **http://localhost:3000**

For more details, see:
- `README.md` - Full project documentation
- `INTEGRATION.md` - Frontend-Backend integration
- `COMPLETE.md` - Implementation summary
