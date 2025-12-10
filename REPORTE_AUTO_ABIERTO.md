# 📖 Abertura Automática de Reportes

## ¿Qué cambió?

Los scripts `run-tests.sh` y `run-tests.ps1` ahora **abren automáticamente el reporte de análisis** al finalizar la ejecución de tests.

## Flujo de ejecución

```
1. Ejecuta tests ✅
   ↓
2. Genera análisis Copilot AI ✅
   ↓
3. Busca el reporte más reciente ✅
   ↓
4. Abre automáticamente en la aplicación predeterminada ✅
```

## Plataformas soportadas

### Windows (PowerShell)
```powershell
.\run-tests.ps1
```
- ✅ Abre con `Start-Process` (navegador, editor o aplicación predeterminada)
- ✅ Muestra archivo en File Explorer con `/select`
- ✅ Manejo de errores silencioso si no hay reporte

### Linux / macOS / Git Bash
```bash
./run-tests.sh
```
- ✅ Linux: usa `xdg-open`
- ✅ macOS: usa `open`
- ✅ Windows (Git Bash): usa `start`

## Archivos que se abren automáticamente

El sistema busca y abre el archivo más reciente con patrón:
```
./reportes/auto-repair-YYYY-MM-DDTHH-MM-SS.md
```

### Ejemplo:
```
auto-repair-2025-12-10T02-43-59.md  ← Se abre automáticamente ✅
```

## Contenido del reporte

El archivo Markdown incluye:

```markdown
# 📊 Reporte de Auto-Reparación
Fecha: 2025-12-10 02:43:59

## 📈 Resumen Ejecutivo
- Total de tests: 7
- Pasando: 7 ✅
- Fallidos: 0
- Tasa de éxito: 100.00%

## ✅ Tests Pasando
1. Test Suite: Elementos - Text Box
2. Test Suite: Formularios - Practice Form
...

## 🤖 Análisis Copilot AI
(Si hubiera fallos, aquí estarían los análisis)
```

## Alternativa: Reporte HTML

Si prefieres ver un reporte HTML interactivo:

```bash
npx playwright show-report
```

## Solución de problemas

| Problema | Solución |
|----------|----------|
| El reporte no se abre | Verifica que exista `./reportes/` |
| No se ve File Explorer | `Start-Process` está abierto en background |
| Quiero desactivar apertura | Comenta o elimina la sección "5. Abriendo reporte..." |

## Comandos útiles

```bash
# Ver todos los reportes generados
ls -la reportes/

# Abrir manualmente un reporte específico
start reportes/auto-repair-2025-12-10T02-43-59.md  # Windows

# Ver reporte HTML
npx playwright show-report
```

---

**Estado:** ✅ Implementado y probado exitosamente
