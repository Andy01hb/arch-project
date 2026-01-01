# PowerShell script para verificar deployments
# Equivalente de check-deployments.js para Windows

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   Arch Project - Deployment Status Check      " -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

$BACKEND_URL = "https://arch-backend-90c5.onrender.com"
$backendOk = $true

# Verificar Backend
Write-Host "Backend (Render) - Verificando..." -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

try {
    # Health Check
    Write-Host "`n1. Health Check Endpoint" -ForegroundColor Blue
    $healthUrl = "$BACKEND_URL/api/health"
    $startTime = Get-Date
    $healthResponse = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 10
    $responseTime = ((Get-Date) - $startTime).TotalMilliseconds
    
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "   [OK] Status: $($healthResponse.StatusCode)" -ForegroundColor Green
        Write-Host "   Response Time: $([math]::Round($responseTime))ms" -ForegroundColor Green
        
        $healthData = $healthResponse.Content | ConvertFrom-Json
        Write-Host "   Uptime: $([math]::Floor($healthData.uptime))s" -ForegroundColor Green
        Write-Host "   Environment: $($healthData.environment)" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Status: $($healthResponse.StatusCode)" -ForegroundColor Red
        $backendOk = $false
    }
    
    # Products Endpoint
    Write-Host "`n2. Products Endpoint" -ForegroundColor Blue
    $productsUrl = "$BACKEND_URL/api/products"
    $startTime = Get-Date
    $productsResponse = Invoke-WebRequest -Uri $productsUrl -UseBasicParsing -TimeoutSec 10
    $responseTime = ((Get-Date) - $startTime).TotalMilliseconds
    
    if ($productsResponse.StatusCode -eq 200) {
        Write-Host "   [OK] Status: $($productsResponse.StatusCode)" -ForegroundColor Green
        Write-Host "   Response Time: $([math]::Round($responseTime))ms" -ForegroundColor Green
        
        $products = $productsResponse.Content | ConvertFrom-Json
        Write-Host "   Products Count: $($products.Count)" -ForegroundColor Green
    } else {
        Write-Host "   [ERROR] Status: $($productsResponse.StatusCode)" -ForegroundColor Red
        $backendOk = $false
    }
    
    Write-Host "`n[OK] Backend verification complete" -ForegroundColor Green
    
} catch {
    Write-Host "`n[ERROR] Backend Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Possible causes:" -ForegroundColor Yellow
    Write-Host "   - Backend is down or restarting" -ForegroundColor Yellow
    Write-Host "   - Network connectivity issues" -ForegroundColor Yellow
    Write-Host "   - Render service suspended" -ForegroundColor Yellow
    $backendOk = $false
}

# Verificar Frontend
Write-Host "`nFrontend (Vercel) - Verificando..." -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

Write-Host "`n[WARN] Frontend check requires manual verification:" -ForegroundColor Yellow
Write-Host "   1. Open your Vercel deployment URL in browser" -ForegroundColor Yellow
Write-Host "   2. Check that the page loads correctly" -ForegroundColor Yellow
Write-Host "   3. Verify products are displayed" -ForegroundColor Yellow
Write-Host "   4. Test navigation and cart functionality" -ForegroundColor Yellow

Write-Host "`nVercel Dashboard:" -ForegroundColor Blue
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Cyan

# Verificar Database
Write-Host "`nBase de Datos (Neon) - Verificando..." -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

Write-Host "`n[WARN] Database check requires manual verification:" -ForegroundColor Yellow
Write-Host "   1. Go to https://console.neon.tech" -ForegroundColor Yellow
Write-Host "   2. Check that the project is active" -ForegroundColor Yellow
Write-Host "   3. Verify database size and connections" -ForegroundColor Yellow
Write-Host "   4. Run test query in SQL Editor" -ForegroundColor Yellow

Write-Host "`nNeon Console:" -ForegroundColor Blue
Write-Host "   https://console.neon.tech" -ForegroundColor Cyan

# Resumen
Write-Host "`nResumen de Verificacion" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

if ($backendOk) {
    Write-Host "`nBackend (Render):     [OK]" -ForegroundColor Green
} else {
    Write-Host "`nBackend (Render):     [FAILED]" -ForegroundColor Red
}
Write-Host "Frontend (Vercel):    [MANUAL CHECK REQUIRED]" -ForegroundColor Yellow
Write-Host "Database (Neon):      [MANUAL CHECK REQUIRED]" -ForegroundColor Yellow

Write-Host "`nEnlaces Utiles:" -ForegroundColor Blue
Write-Host "   Backend:  $BACKEND_URL" -ForegroundColor Cyan
Write-Host "   Render:   https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "   Vercel:   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "   Neon:     https://console.neon.tech" -ForegroundColor Cyan

if (-not $backendOk) {
    Write-Host "`n[WARN] Acciones Recomendadas:" -ForegroundColor Yellow
    Write-Host "   1. Check Render logs for errors" -ForegroundColor Yellow
    Write-Host "   2. Verify environment variables" -ForegroundColor Yellow
    Write-Host "   3. Check database connectivity" -ForegroundColor Yellow
    Write-Host "   4. Consider manual redeploy" -ForegroundColor Yellow
}

Write-Host "`n[OK] Verification complete!`n" -ForegroundColor Green

if (-not $backendOk) {
    exit 1
}
