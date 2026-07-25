# Arranque diario de Plan (Windows)
# Uso: doble click o desde PowerShell: .\start-plan.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backend = Join-Path $Root "backend"
$VenvPython = Join-Path $Backend ".venv\Scripts\python.exe"
$VenvUvicorn = Join-Path $Backend ".venv\Scripts\uvicorn.exe"

Write-Host ""
Write-Host "=== Plan — arranque local ===" -ForegroundColor Cyan
Write-Host ""

# 1) Docker Desktop / PostgreSQL
Write-Host "1/3  Base de datos (Docker)..." -ForegroundColor Yellow
try {
  docker info 2>$null | Out-Null
} catch {
  Write-Host "Docker no responde. Abrí Docker Desktop, esperá a que inicie y volvé a correr este script." -ForegroundColor Red
  exit 1
}

Push-Location $Backend
try {
  docker compose up -d
  if ($LASTEXITCODE -ne 0) { throw "docker compose falló" }
} finally {
  Pop-Location
}
Write-Host "     PostgreSQL OK" -ForegroundColor Green

# 2) Backend
Write-Host "2/3  Backend (API)..." -ForegroundColor Yellow
if (-not (Test-Path $VenvUvicorn)) {
  Write-Host "No encontré el venv en backend\.venv. Creá el entorno primero (ver backend\README.md)." -ForegroundColor Red
  exit 1
}

$backendRunning = $false
try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -TimeoutSec 2
  if ($health) { $backendRunning = $true }
} catch { }

if ($backendRunning) {
  Write-Host "     Backend ya estaba en http://127.0.0.1:8000" -ForegroundColor Green
} else {
  Start-Process powershell -WorkingDirectory $Backend -ArgumentList @(
    "-NoExit",
    "-Command",
    ".\.venv\Scripts\Activate.ps1; Write-Host 'Backend Plan — http://127.0.0.1:8000' -ForegroundColor Cyan; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
  )
  Write-Host "     Backend iniciando en ventana nueva..." -ForegroundColor Green
}

# 3) Frontend
Write-Host "3/3  Frontend..." -ForegroundColor Yellow
$frontendRunning = $false
try {
  $null = Invoke-WebRequest -Uri "http://127.0.0.1:5173" -TimeoutSec 2 -UseBasicParsing
  $frontendRunning = $true
} catch { }

if ($frontendRunning) {
  Write-Host "     Frontend ya estaba en http://localhost:5173" -ForegroundColor Green
} else {
  Start-Process powershell -WorkingDirectory $Root -ArgumentList @(
    "-NoExit",
    "-Command",
    "Write-Host 'Frontend Plan — http://localhost:5173' -ForegroundColor Cyan; npm run dev"
  )
  Write-Host "     Frontend iniciando en ventana nueva..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Listo. En ~10 segundos abrí:" -ForegroundColor Cyan
Write-Host "  http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Flujo típico del mes:" -ForegroundColor DarkGray
Write-Host "  1. Configuración → nombre y reserva mensual de ahorro/inversión" -ForegroundColor DarkGray
Write-Host "  2. Obligaciones → compromisos fijos (alquiler, tarjetas, etc.)" -ForegroundColor DarkGray
Write-Host "  3. Ingresos → lo que cobrás ese mes" -ForegroundColor DarkGray
Write-Host "  4. Dashboard → resumen del mes seleccionado" -ForegroundColor DarkGray
Write-Host "  5. Ahorro e Inversiones / Objetivos → cuando movés plata" -ForegroundColor DarkGray
Write-Host ""

Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"
