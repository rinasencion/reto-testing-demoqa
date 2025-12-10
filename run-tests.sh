#!/bin/bash

# ============================================
# 🧪 EJECUTOR DE TESTS MEJORADO
# Funciona en: Windows (Git Bash), Linux, Mac
# ============================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🧪 EJECUTOR DE TESTS - Reto Testing${NC}"
echo -e "${BLUE}========================================${NC}"

# 1. Validar que Playwright está instalado
echo -e "\n${YELLOW}1️⃣ Verificando dependencias...${NC}"
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ Node.js/npm no encontrado. Instálalo primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js/npm encontrado${NC}"

# 2. Limpiar archivos anteriores
echo -e "\n${YELLOW}2️⃣ Limpiando archivos anteriores...${NC}"
echo "   - Eliminando reportes de ejecuciones previas..."
rm -rf ./playwright-report      # Reporte HTML de Playwright
rm -rf ./test-results           # Resultados de tests
rm -rf ./test-report.json       # JSON report temporal
rm -rf ./test-report-debug.json # JSON de debug

# Recrear directorios necesarios
mkdir -p ./reportes
mkdir -p ./screenshots
mkdir -p ./test-results
echo -e "${GREEN}✅ Directorios limpios${NC}"

# 3. Ejecutar tests con npm
echo -e "\n${YELLOW}3️⃣ Ejecutando tests de Playwright...${NC}"
echo "   Modo: Chromium"
echo "   Workers: 2"
echo ""

npm test 2>&1

# Guardar código de salida
TEST_STATUS=$?

# 4. Ejecutar auto-repair para análisis con Copilot AI
echo -e "\n${YELLOW}4️⃣ Generando análisis con Copilot AI...${NC}"
npm run auto-repair 2>&1

# 5. Mostrar resumen detallado
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}📊 RESUMEN EJECUTIVO${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $TEST_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS LOS TESTS PASARON${NC}"
else
    echo -e "${YELLOW}⚠️ ALGUNOS TESTS FALLARON${NC}"
fi

echo ""
echo -e "${BLUE}📁 Archivos generados:${NC}"
echo "   📋 Reportes Markdown: ./reportes/"
echo "   📸 Screenshots: ./screenshots/"
echo ""

# 5. Abrir reporte automáticamente
echo -e "${YELLOW}5️⃣ Abriendo reporte...${NC}"

# Encontrar el último archivo de reporte
LATEST_REPORT=$(ls -t ./reportes/auto-repair-*.md 2>/dev/null | head -1)

if [ -n "$LATEST_REPORT" ]; then
    echo -e "${GREEN}✅ Abriendo: $(basename $LATEST_REPORT)${NC}"
    
    # Detectar SO y abrir con el comando apropiado
    if command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open "$LATEST_REPORT" &
    elif command -v open &> /dev/null; then
        # macOS
        open "$LATEST_REPORT"
    elif command -v start &> /dev/null; then
        # Windows (Git Bash)
        start "$LATEST_REPORT"
    fi
fi

echo ""
echo -e "${BLUE}📊 Reporte HTML: npx playwright show-report${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo "✨ Proceso completado"
echo -e "${BLUE}========================================${NC}"
echo ""

exit $TEST_STATUS