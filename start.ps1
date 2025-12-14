# Simple Start Script
Write-Host "Starting Arch Project..." -ForegroundColor Green

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"
Write-Host "Backend launched."

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\store'; npm run dev"
Write-Host "Frontend launched."

Write-Host "Done."
