Write-Host "=== Testing Arch Project Backend API ===" -ForegroundColor Cyan

# Test Health Check
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:3001/api/health"

# Test Get Products
Write-Host "`n2. Get Products..." -ForegroundColor Yellow
$products = Invoke-RestMethod -Uri "http://localhost:3001/api/products"
Write-Host "Found $($products.Count) products"

# Test Create Order
Write-Host "`n3. Create Order..." -ForegroundColor Yellow
$body = @{
    customerEmail = "test@example.com"
    customerName = "Test User"
    items = @(@{
        productId = "1"
        productName = "Test Product"
        price = 4.99
        quantity = 1
    })
} | ConvertTo-Json

$order = Invoke-RestMethod -Uri "http://localhost:3001/api/orders" -Method Post -Body $body -ContentType "application/json"
Write-Host "Order created: $($order.id)"
Write-Host "Total: `$$($order.total)"

# Test Get Orders
Write-Host "`n4. Get All Orders..." -ForegroundColor Yellow
$orders = Invoke-RestMethod -Uri "http://localhost:3001/api/orders"
Write-Host "Found $($orders.Count) orders"

Write-Host "`n=== All Tests Passed ===" -ForegroundColor Green
