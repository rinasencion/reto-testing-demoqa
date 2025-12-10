# EJECUTOR DE TESTS PARA POWERSHELL
# Windows PowerShell / PowerShell Core

Write-Host ""
Write-Host "========================================"  -ForegroundColor Blue
Write-Host "TEST RUNNER - Reto Testing" -ForegroundColor Blue
Write-Host "========================================"  -ForegroundColor Blue
Write-Host ""

# 1. Validar dependencias
Write-Host "1. Verificando dependencias..." -ForegroundColor Yellow
$NodeTest = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Node.js $NodeTest" -ForegroundColor Green
} else {
    Write-Host "ERROR: Node.js no encontrado" -ForegroundColor Red
    exit 1
}

# 2. Limpiar archivos anteriores
Write-Host ""
Write-Host "2. Limpiando archivos previos..." -ForegroundColor Yellow

Remove-Item -Path "playwright-report" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-results" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-report.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-report-debug.json" -Force -ErrorAction SilentlyContinue

New-Item -ItemType Directory -Path "reportes" -Force | Out-Null
New-Item -ItemType Directory -Path "screenshots" -Force | Out-Null
New-Item -ItemType Directory -Path "test-results" -Force | Out-Null

Write-Host "OK: Directorios limpios" -ForegroundColor Green

# 3. Ejecutar tests
Write-Host ""
Write-Host "3. Ejecutando tests..." -ForegroundColor Yellow
Write-Host ""

npm test 2>&1

$TestStatus = $LASTEXITCODE

# 4. Generar análisis Copilot AI
Write-Host ""
Write-Host "4. Generando análisis Copilot AI..." -ForegroundColor Yellow
npm run auto-repair 2>&1

# 5. Resumen
Write-Host ""
Write-Host "========================================"  -ForegroundColor Blue
Write-Host "RESUMEN"  -ForegroundColor Blue
Write-Host "========================================"  -ForegroundColor Blue

if ($TestStatus -eq 0) {
    Write-Host "OK: TODOS LOS TESTS PASARON" -ForegroundColor Green
} else {
    Write-Host "ALERTA: Algunos tests fallaron" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Archivos generados:"  -ForegroundColor Blue
Write-Host "  - Reportes: ./reportes/"
Write-Host "  - Screenshots: ./screenshots/"
Write-Host ""

# 5. Abrir reporte automáticamente
Write-Host "5. Abriendo reporte..." -ForegroundColor Yellow

# Buscar el archivo de reporte más reciente
$ReportFiles = Get-ChildItem -Path "./reportes/auto-repair-*.md" -ErrorAction SilentlyContinue | Sort-Object -Property LastWriteTime -Descending

if ($ReportFiles.Count -gt 0) {
    $LatestReport = $ReportFiles[0].FullName
    Write-Host "OK: Abriendo reporte..." -ForegroundColor Green
    Write-Host "    $($ReportFiles[0].Name)" -ForegroundColor Cyan
    Write-Host ""
    
    # Abrir directamente en la aplicación predeterminada
    Start-Process $LatestReport -ErrorAction SilentlyContinue
    
    # También mostrar en File Explorer (opcional)
    & explorer.exe "/select,$(Get-Item $LatestReport).FullName" -ErrorAction SilentlyContinue
} else {
    Write-Host "ALERTA: No se encontró archivo de reporte" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "HTML Report: npx playwright show-report" -ForegroundColor Blue
Write-Host ""
Write-Host "========================================"  -ForegroundColor Blue
Write-Host "Completado" -ForegroundColor Blue
Write-Host "========================================"  -ForegroundColor Blue
Write-Host ""

exit $TestStatus
