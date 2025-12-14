# Database Setup Script
# This script initializes the PostgreSQL database

Write-Host "=== Arch Project Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PostgreSQL not found. Please install PostgreSQL first." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "This script will:" -ForegroundColor Yellow
Write-Host "1. Create database 'arch_project'" -ForegroundColor Gray
Write-Host "2. Create tables (products, orders, order_items)" -ForegroundColor Gray
Write-Host "3. Insert sample data" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Continue? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Running database setup..." -ForegroundColor Cyan

# Run the SQL script
$env:PGPASSWORD = "postgres"
psql -U postgres -f database/schema.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database: arch_project" -ForegroundColor Gray
    Write-Host "Tables created: products, orders, order_items" -ForegroundColor Gray
    Write-Host "Sample products inserted: 3" -ForegroundColor Gray
    Write-Host ""
    Write-Host "You can now start the backend server with: npm run dev" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✗ Database setup failed" -ForegroundColor Red
    Write-Host "Please check the error messages above" -ForegroundColor Yellow
}
