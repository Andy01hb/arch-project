# Arch Project - Diagnostico de Deployment
# Este script verifica el estado de todos los servicios desplegados

Write-Host ""
Write-Host "========================================"
Write-Host "  ARCH PROJECT - DIAGNOSTICO DEPLOYMENT"
Write-Host "========================================"
Write-Host ""

$results = @{
    Backend_Health = $false
    Backend_Products = $false
    Database_Connected = $false
    Frontend_Accessible = $false
}

# 1. Verificar Backend Health
Write-Host "[1/4] Verificando Backend Health Endpoint..."
try {
    $healthResponse = Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/health" -UseBasicParsing -ErrorAction Stop
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "  OK Backend Health: OK" -ForegroundColor Green
        $healthData = $healthResponse.Content | ConvertFrom-Json
        Write-Host "     - Status: $($healthData.status)"
        Write-Host "     - Uptime: $([math]::Round($healthData.uptime, 2)) segundos"
        Write-Host "     - Environment: $($healthData.environment)"
        $results.Backend_Health = $true
    }
} catch {
    Write-Host "  ERROR Backend Health: FALLO" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)"
}

# 2. Verificar Backend Products
Write-Host ""
Write-Host "[2/4] Verificando Backend Products Endpoint..."
try {
    $productsResponse = Invoke-WebRequest -Uri "https://arch-backend-90c5.onrender.com/api/products" -UseBasicParsing -ErrorAction Stop
    if ($productsResponse.StatusCode -eq 200) {
        Write-Host "  OK Backend Products: OK" -ForegroundColor Green
        $products = $productsResponse.Content | ConvertFrom-Json
        Write-Host "     - Productos encontrados: $($products.Count)"
        $results.Backend_Products = $true
        $results.Database_Connected = $true
        
        if ($products.Count -gt 0) {
            Write-Host "     - Ejemplo: $($products[0].name) - `$$($products[0].price)"
        }
    }
} catch {
    Write-Host "  ERROR Backend Products: FALLO" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)"
    
    if ($_.Exception.Message -match "500") {
        Write-Host "     ADVERTENCIA Error 500 - Probable problema de conexion a base de datos" -ForegroundColor Yellow
        Write-Host "     Accion: Verificar DATABASE_URL en Render" -ForegroundColor Yellow
    }
}

# 3. Verificar Frontend
Write-Host ""
Write-Host "[3/4] Buscando Frontend Deployment..."
$possibleUrls = @(
    "https://arch-project.vercel.app",
    "https://arch-project-store.vercel.app",
    "https://store-arch-project.vercel.app"
)

$frontendFound = $false
foreach ($url in $possibleUrls) {
    try {
        $frontendResponse = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if ($frontendResponse.StatusCode -eq 200) {
            Write-Host "  OK Frontend encontrado: $url" -ForegroundColor Green
            $results.Frontend_Accessible = $true
            $frontendFound = $true
            break
        }
    } catch {
        # Silencioso
    }
}

if (-not $frontendFound) {
    Write-Host "  ADVERTENCIA Frontend no encontrado en URLs comunes" -ForegroundColor Yellow
    Write-Host "     Verifica manualmente en Vercel Dashboard"
}

# 4. Verificar configuracion local
Write-Host ""
Write-Host "[4/4] Verificando Configuracion Local..."

if (Test-Path "backend\.env") {
    Write-Host "  OK backend\.env existe" -ForegroundColor Green
} else {
    Write-Host "  ADVERTENCIA backend\.env no existe" -ForegroundColor Yellow
}

$apiFile = "store\src\lib\api.ts"
if (Test-Path $apiFile) {
    $apiContent = Get-Content $apiFile
    $apiLine = $apiContent | Select-String "const API_URL"
    if ($apiLine) {
        Write-Host "  OK Frontend API configurado" -ForegroundColor Green
        Write-Host "     - $($apiLine.Line.Trim())"
        
        if ($apiLine.Line -match "localhost") {
            Write-Host "     ADVERTENCIA Apuntando a localhost" -ForegroundColor Yellow
        } elseif ($apiLine.Line -match "render.com") {
            Write-Host "     OK Apuntando a Render (produccion)" -ForegroundColor Green
        }
    }
}

# Resumen
Write-Host ""
Write-Host "========================================"
Write-Host "  RESUMEN DEL DIAGNOSTICO"
Write-Host "========================================"
Write-Host ""

$totalChecks = $results.Count
$passedChecks = ($results.Values | Where-Object { $_ -eq $true }).Count

Write-Host "Checks Pasados: $passedChecks / $totalChecks"
Write-Host ""

foreach ($check in $results.GetEnumerator()) {
    $status = if ($check.Value) { "PASS" } else { "FAIL" }
    $color = if ($check.Value) { "Green" } else { "Red" }
    Write-Host "  $status - $($check.Key)" -ForegroundColor $color
}

# Recomendaciones
Write-Host ""
Write-Host "========================================"
Write-Host "  RECOMENDACIONES"
Write-Host "========================================"
Write-Host ""

if (-not $results.Database_Connected) {
    Write-Host "CRITICO: Base de datos no conectada" -ForegroundColor Red
    Write-Host "   1. Verifica que Neon database existe y esta activa"
    Write-Host "   2. Obten el Connection String de Neon"
    Write-Host "   3. Configura DATABASE_URL en Render Environment Variables"
    Write-Host "   4. Aplica el schema usando arch_project_dump.sql"
    Write-Host ""
}

if (-not $results.Frontend_Accessible) {
    Write-Host "MEDIO: Frontend no accesible" -ForegroundColor Yellow
    Write-Host "   1. Verifica si esta desplegado en Vercel Dashboard"
    Write-Host "   2. Si no, ejecuta: cd store; vercel --prod"
    Write-Host ""
}

if ($results.Backend_Health -and $results.Database_Connected) {
    Write-Host "EXCELENTE: Backend y Database funcionando correctamente!" -ForegroundColor Green
    Write-Host "   El sistema esta operativo en produccion."
    Write-Host ""
}

Write-Host "========================================"
Write-Host "  SIGUIENTE PASO"
Write-Host "========================================"
Write-Host ""

if (-not $results.Database_Connected) {
    Write-Host "Ejecuta el workflow de debugging:"
    Write-Host "  Ver: .agent\workflows\debug-deployment.md"
} else {
    Write-Host "Sistema funcionando. Puedes:" -ForegroundColor Green
    Write-Host "  1. Probar la aplicacion en produccion"
    Write-Host "  2. Configurar Stripe para pagos"
    Write-Host "  3. Agregar mas productos a la base de datos"
}

Write-Host ""
Write-Host "Diagnostico completado."
Write-Host ""
