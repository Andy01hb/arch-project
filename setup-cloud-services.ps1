# Script de Conexion y Configuracion de Servicios
# Arch Project - Neon, Render, Vercel

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACION DE SERVICIOS CLOUD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Funcion para pausar y esperar input del usuario
function Pause-WithMessage {
    param([string]$Message = "Presiona ENTER para continuar...")
    Write-Host $Message -ForegroundColor Yellow
    Read-Host
}

# ============================================
# PASO 1: AUTENTICACION EN VERCEL
# ============================================
Write-Host "[PASO 1] Autenticacion en Vercel" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Verificando autenticacion actual..." -ForegroundColor Yellow
$vercelAuth = vercel whoami 2>&1

if ($vercelAuth -match "No existing credentials") {
    Write-Host "No estas autenticado en Vercel." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "INSTRUCCIONES:" -ForegroundColor Cyan
    Write-Host "1. Se abrira una ventana del navegador" -ForegroundColor White
    Write-Host "2. Inicia sesion con tu cuenta de Vercel" -ForegroundColor White
    Write-Host "3. Autoriza el CLI" -ForegroundColor White
    Write-Host "4. Vuelve a esta terminal" -ForegroundColor White
    Write-Host ""
    
    Pause-WithMessage "Presiona ENTER para abrir el navegador y autenticarte..."
    
    vercel login
    
    Write-Host ""
    Write-Host "Verificando autenticacion..." -ForegroundColor Yellow
    $vercelUser = vercel whoami
    Write-Host "Autenticado como: $vercelUser" -ForegroundColor Green
} else {
    Write-Host "Ya estas autenticado en Vercel como: $vercelAuth" -ForegroundColor Green
}

Write-Host ""
Pause-WithMessage

# ============================================
# PASO 2: VERIFICAR PROYECTO EN VERCEL
# ============================================
Write-Host ""
Write-Host "[PASO 2] Verificar Proyecto en Vercel" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Listando proyectos en Vercel..." -ForegroundColor Yellow
vercel list

Write-Host ""
Write-Host "Verificando si 'arch-project' existe..." -ForegroundColor Yellow
$vercelProjects = vercel list --json 2>&1 | ConvertFrom-Json

$archProject = $vercelProjects | Where-Object { $_.name -match "arch" }

if ($archProject) {
    Write-Host "Proyecto encontrado: $($archProject.name)" -ForegroundColor Green
    Write-Host "URL: https://$($archProject.name).vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "No se encontro proyecto 'arch-project' en Vercel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quieres desplegar el frontend ahora? (S/N)" -ForegroundColor Yellow
    $deploy = Read-Host
    
    if ($deploy -eq "S" -or $deploy -eq "s") {
        Write-Host ""
        Write-Host "Desplegando frontend a Vercel..." -ForegroundColor Cyan
        Set-Location store
        vercel --prod
        Set-Location ..
    }
}

Write-Host ""
Pause-WithMessage

# ============================================
# PASO 3: AUTENTICACION EN NEON
# ============================================
Write-Host ""
Write-Host "[PASO 3] Autenticacion en Neon" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Verificando autenticacion en Neon..." -ForegroundColor Yellow
$neonAuth = neonctl me 2>&1

if ($neonAuth -match "not authenticated" -or $neonAuth -match "error") {
    Write-Host "No estas autenticado en Neon." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "INSTRUCCIONES:" -ForegroundColor Cyan
    Write-Host "1. Necesitas un API Key de Neon" -ForegroundColor White
    Write-Host "2. Ve a: https://console.neon.tech/app/settings/api-keys" -ForegroundColor White
    Write-Host "3. Crea un nuevo API Key" -ForegroundColor White
    Write-Host "4. Copialo y pegalo aqui" -ForegroundColor White
    Write-Host ""
    
    Pause-WithMessage "Presiona ENTER cuando tengas el API Key listo..."
    
    Write-Host ""
    Write-Host "Pega tu Neon API Key:" -ForegroundColor Yellow
    $neonApiKey = Read-Host -AsSecureString
    
    # Convertir SecureString a texto plano para usar con neonctl
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($neonApiKey)
    $apiKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    
    neonctl auth $apiKeyPlain
    
    Write-Host ""
    Write-Host "Verificando autenticacion..." -ForegroundColor Yellow
    $neonUser = neonctl me
    Write-Host "Autenticado como: $neonUser" -ForegroundColor Green
} else {
    Write-Host "Ya estas autenticado en Neon" -ForegroundColor Green
    Write-Host $neonAuth
}

Write-Host ""
Pause-WithMessage

# ============================================
# PASO 4: LISTAR PROYECTOS Y DATABASES EN NEON
# ============================================
Write-Host ""
Write-Host "[PASO 4] Proyectos en Neon" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Listando proyectos en Neon..." -ForegroundColor Yellow
neonctl projects list

Write-Host ""
Write-Host "Ingresa el Project ID de arch-project (o presiona ENTER para crear uno nuevo):" -ForegroundColor Yellow
$projectId = Read-Host

if ([string]::IsNullOrWhiteSpace($projectId)) {
    Write-Host ""
    Write-Host "Creando nuevo proyecto en Neon..." -ForegroundColor Cyan
    $newProject = neonctl projects create --name arch-project
    Write-Host $newProject
    
    # Extraer project ID del output
    if ($newProject -match "Project ID: ([a-z0-9-]+)") {
        $projectId = $matches[1]
        Write-Host "Proyecto creado con ID: $projectId" -ForegroundColor Green
    }
} else {
    Write-Host "Usando proyecto existente: $projectId" -ForegroundColor Green
}

Write-Host ""
Pause-WithMessage

# ============================================
# PASO 5: OBTENER CONNECTION STRING
# ============================================
Write-Host ""
Write-Host "[PASO 5] Obtener Connection String de Neon" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Obteniendo connection string..." -ForegroundColor Yellow
$connectionString = neonctl connection-string --project-id $projectId

Write-Host ""
Write-Host "CONNECTION STRING:" -ForegroundColor Cyan
Write-Host $connectionString -ForegroundColor White
Write-Host ""

# Guardar en archivo temporal
$connectionString | Out-File -FilePath "neon-connection-string.txt" -Encoding UTF8
Write-Host "Connection string guardado en: neon-connection-string.txt" -ForegroundColor Green

Write-Host ""
Pause-WithMessage

# ============================================
# PASO 6: APLICAR SCHEMA A NEON
# ============================================
Write-Host ""
Write-Host "[PASO 6] Aplicar Schema a Neon Database" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Quieres aplicar el schema ahora? (S/N)" -ForegroundColor Yellow
$applySchema = Read-Host

if ($applySchema -eq "S" -or $applySchema -eq "s") {
    Write-Host ""
    Write-Host "Aplicando schema desde arch_project_dump.sql..." -ForegroundColor Cyan
    
    # Usar psql si esta disponible
    $psqlAvailable = Get-Command psql -ErrorAction SilentlyContinue
    
    if ($psqlAvailable) {
        psql $connectionString -f arch_project_dump.sql
        Write-Host "Schema aplicado exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "psql no esta instalado." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "OPCION ALTERNATIVA:" -ForegroundColor Cyan
        Write-Host "1. Ve a: https://console.neon.tech" -ForegroundColor White
        Write-Host "2. Abre SQL Editor" -ForegroundColor White
        Write-Host "3. Copia y pega el contenido de arch_project_dump.sql" -ForegroundColor White
        Write-Host "4. Ejecuta el script" -ForegroundColor White
    }
}

Write-Host ""
Pause-WithMessage

# ============================================
# PASO 7: CONFIGURAR RENDER (MANUAL)
# ============================================
Write-Host ""
Write-Host "[PASO 7] Configurar Render" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "NOTA: Render no tiene CLI oficial, debes configurar manualmente." -ForegroundColor Yellow
Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor Cyan
Write-Host "1. Ve a: https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Selecciona tu servicio 'arch-backend'" -ForegroundColor White
Write-Host "3. Ve a Environment" -ForegroundColor White
Write-Host "4. Agrega variable: DATABASE_URL" -ForegroundColor White
Write-Host "5. Pega el connection string de Neon:" -ForegroundColor White
Write-Host ""
Write-Host "   $connectionString" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Guarda y espera el redeploy automatico" -ForegroundColor White

Write-Host ""
Pause-WithMessage "Presiona ENTER cuando hayas configurado Render..."

# ============================================
# PASO 8: VERIFICACION FINAL
# ============================================
Write-Host ""
Write-Host "[PASO 8] Verificacion Final" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

Write-Host "Ejecutando diagnostico..." -ForegroundColor Yellow
Write-Host ""

.\diagnose-deployment.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACION COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Proximos pasos:" -ForegroundColor Green
Write-Host "1. Verifica que todos los checks pasen en el diagnostico" -ForegroundColor White
Write-Host "2. Prueba tu aplicacion en produccion" -ForegroundColor White
Write-Host "3. Configura Stripe para pagos (opcional)" -ForegroundColor White
Write-Host ""
