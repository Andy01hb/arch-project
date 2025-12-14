# Database Migration Helper Script

param (
    [string]$RemoteDbUrl
)

$LocalDbName = "arch_project"
$LocalUser = "arch_user"
$DumpFile = "arch_project_dump.sql"

Write-Host "=== Arch Project Database Migration Tool ===" -ForegroundColor Cyan

# 1. Check if pg_dump is available
if (-not (Get-Command "pg_dump" -ErrorAction SilentlyContinue)) {
    Write-Error "pg_dump not found! Please ensure PostgreSQL bin directory is in your PATH."
    exit 1
}

# 2. Dump Local Database
Write-Host "1. Exporting local database '$LocalDbName'..."
$env:PGPASSWORD = "password123" # Local password
pg_dump -U $LocalUser -h 127.0.0.1 -d $LocalDbName --no-owner --no-acl -f $DumpFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Success! Data exported to $DumpFile" -ForegroundColor Green
} else {
    Write-Error "   Failed to export database."
    exit 1
}

# 3. Import to Cloud (if URL provided)
if ($RemoteDbUrl) {
    Write-Host "2. Importing to Cloud Database..."
    
    # Check if psql is available
    if (-not (Get-Command "psql" -ErrorAction SilentlyContinue)) {
        Write-Error "psql not found! Cannot import."
        exit 1
    }

    # Run psql with the remote URL
    # We use 'Get-Content' piped to psql to handle encoding better in some PS versions, 
    # or just let psql read the file with -f
    psql $RemoteDbUrl -f $DumpFile

    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Success! Database migrated to Cloud." -ForegroundColor Green
    } else {
        Write-Error "   Failed to import to Cloud."
    }
} else {
    Write-Host "2. Skipping Import (No URL provided)." -ForegroundColor Yellow
    Write-Host "   To import, run: .\migrate-db.ps1 -RemoteDbUrl 'postgres://user:pass@host/db'"
}
