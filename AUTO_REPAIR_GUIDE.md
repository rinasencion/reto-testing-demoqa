# 📊 Auto-Repair Script - Sistema Completo de Análisis

## 🎯 Funcionalidad Implementada

El script `auto-repair.js` ejecuta un pipeline completo que:

1. **Ejecuta todos los tests** con Playwright
2. **Detecta cuáles fallaron** analizando el JSON report
3. **Extrae información relevante:**
   - Nombre del test
   - Archivo del test
   - Mensaje de error exacto
   - Código fuente del test
   - Duración de ejecución

4. **Llama a Copilot AI Helper** para análisis:
   - `detectErrorType()` - Clasifica el error (timeout, selector, assertion, etc.)
   - `analizarError()` - Proporciona análisis específico por tipo
   - `sugerirSelectorAlternativo()` - Recomienda selectores robustos

5. **Genera un reporte completo en Markdown:**
   - Resumen ejecutivo con estadísticas
   - Análisis detallado de cada test fallido
   - Sugerencias de reparación de Copilot AI
   - Lista de tests que pasaron
   - Conclusiones y próximos pasos

6. **Copia screenshots** automáticamente desde test-results/ a screenshots/

---

## 📋 Estructura del Reporte Generado

### Ejemplo: Cuando hay tests fallidos

```markdown
# 🔴 Reporte de Auto-Reparación - 3 Test(s) Fallido(s)

## 📊 Resumen Ejecutivo
| Métrica | Valor |
|---------|-------|
| Tests Totales | 10 |
| ✅ Pasando | 7 |
| ❌ Fallidos | 3 |
| Tasa de Éxito | 70.00% |

## ❌ Tests Fallidos (3)

### ❌ Debe fallar con error de selector
**Archivo:** 07-error-demo.spec.js
**Duración:** 7913ms
**Estado:** ❌ FALLIDO

#### 🔴 Error Original
[Mensaje de error exacto del test]

#### 🤖 Análisis Copilot AI
[Análisis específico por tipo de error]

#### 💡 Sugerencias de Reparación
[Recomendaciones concretas de Copilot]

#### 🎯 Selectores Alternativos
[6 selectores robustos recomendados]

#### 📝 Código del Test
[Código fuente del test]

## ✅ Tests Pasando (7)
[Lista de tests que funcionan correctamente]

## 📋 Conclusión
[Resumen y próximos pasos]
```

---

## 🔍 Tipos de Errores Detectados

El sistema detecta y analiza **8 tipos de errores:**

| Tipo | Patrón | Análisis Propuesto |
|------|--------|-------------------|
| **timeout** | "Timeout" | Verifica selectores, esperas explícitas |
| **selector** | "selector", "locator" | Recomienda getByRole, getByText, etc. |
| **navigation** | "navigation", "navigate" | Verifica URL y conexión |
| **network** | "ERR_", "net::" | Detecta CORS y latencia |
| **assertion** | "assert", "expect" | Sugiere métodos de matching |
| **modal** | "modal", "dialog" | Manejo de dialogs |
| **interaction** | "click", "disabled" | Problemas de interacción |
| **unknown** | Otros | Debugging manual |

### Ejemplo: Error Timeout
```
Análisis Copilot:
✅ Timeout detectado: El elemento no apareció en el tiempo esperado

Sugerencias:
1. Verifica que el selector sea correcto
2. Usa selectores robustos: getByRole(), getByText(), getByLabel()
3. Agrega esperas explícitas: await page.waitForSelector(selector)
4. Considera aumentar el timeout si es necesario

Selectores Recomendados:
- getByRole('button', { name: /texto/i })
- getByLabel('Etiqueta')
- getByText('Texto visible')
- getByPlaceholder('placeholder')
- locator('[data-testid="id"]')
- locator('.selector').filter({ hasText: /contenido/ })
```

---

## 🚀 Cómo Usar

### Comando principal:
```bash
npm run auto-repair
```

### Salida esperada:
```
🚀 Ejecutando tests de Playwright...
📸 Copiando screenshots desde test-results...

[si hay fallos: análisis con Copilot AI]

✅ Reporte guardado en: reportes/auto-repair-2025-12-10T02-14-14.md

============================================================
📊 RESUMEN FINAL
============================================================
Total de tests: 7
✅ Pasando: 7
❌ Fallidos: 0
Tasa de éxito: 100.00%
============================================================
```

---

## 📁 Archivos Generados

### Reportes
```
reportes/
├── auto-repair-2025-12-10T02-09-12.md    # Cuando todos pasan
├── auto-repair-2025-12-10T02-10-38.md    # Cuando hay fallos
└── ...
```

### Screenshots
```
screenshots/
├── 01-text-box-Test-Suite-*.png
├── 02-practice-form-Test-Suite-*.png
├── 07-error-demo-Test-Su-*-test-failed-1.png
└── ...
```

---

## 🔬 Flujo Técnico Implementado

```
npm run auto-repair
    ↓
execSync('npx playwright test --reporter=json > test-report.json')
    ↓
JSON Parsing (estructura anidada de suites)
    ↓
extractTestsFromJSON(results)
    ├─ processSuite(suite) [función recursiva]
    ├─ Procesa specs en la suite actual
    ├─ Procesa suites anidadas
    └─ Retorna { failedTests, passedTests }
    ↓
Para cada test fallido:
    ├─ detectErrorType(errorMessage)     [ai-helper.js]
    ├─ analizarError(code, error)        [ai-helper.js]
    └─ sugerirSelectorAlternativo()      [ai-helper.js]
    ↓
generateReport(failedTests, passedTests)
    ├─ Crear encabezado (con color rojo si hay fallos)
    ├─ Generar resumen ejecutivo
    ├─ Listar tests fallidos con análisis Copilot
    ├─ Listar tests pasando
    ├─ Conclusiones
    └─ Guardar en reportes/auto-repair-[timestamp].md
    ↓
copyScreenshotsFromTestResults()
    └─ Copiar PNGs desde test-results/ a screenshots/
    ↓
Mostrar resumen en consola
```

---

## 🎓 Ejemplo Real: Test Fallido

### Test que falla:
```javascript
test('Debe fallar con error de selector', async ({ page }) => {
    await page.goto('https://demoqa.com');
    const element = page.locator('#selector-que-no-existe');
    await expect(element).toBeVisible();
});
```

### Reporte generado:
```markdown
### ❌ Debe fallar con error de selector

**Archivo:** 07-error-demo.spec.js
**Duración:** 7913ms
**Estado:** ❌ FALLIDO

#### 🔴 Error Original
Error: expect(locator).toBeVisible() failed
Locator: locator('#selector-que-no-existe')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

#### 🤖 Análisis Copilot AI
**Timeout detectado**: El elemento no apareció en el tiempo esperado

#### 💡 Sugerencias de Reparación
1. Verifica que el selector sea correcto
2. Usa selectores robustos: getByRole(), getByText(), getByLabel()
3. Agrega esperas explícitas
4. Considera aumentar el timeout si es necesario

#### 🎯 Selectores Alternativos
1. getByRole('button', { name: /texto/i })
2. getByLabel('Etiqueta')
3. getByText('Texto visible')
... (4 más)
```

---

## ✨ Características Principales

### 1. **Análisis Automático**
- ✅ Detecta tipo de error automáticamente
- ✅ Proporciona sugerencias específicas
- ✅ Genera selectores alternativos

### 2. **Reporte Completo**
- ✅ Resumen ejecutivo con métricas
- ✅ Análisis detallado de cada fallo
- ✅ Tests pasando listados
- ✅ Conclusiones y próximos pasos

### 3. **Integración Copilot AI**
- ✅ Usa `helpers/ai-helper.js`
- ✅ 8 tipos de error diferentes
- ✅ Análisis contextual y sugerencias

### 4. **Gestión de Screenshots**
- ✅ Captura automática en test-results/
- ✅ Copia a carpeta centralizada
- ✅ Organización por nombre de test

### 5. **Reutilizable**
- ✅ Funciona con cualquier test
- ✅ Formato Markdown legible
- ✅ Timestamps automáticos

---

## 📊 Ejemplo de Salida Completa

```
🚀 Ejecutando tests de Playwright...
📸 Copiando screenshots desde test-results...
✅ 3 screenshot(s) copiado(s) a ./screenshots
🧠 Analizando 3 tests fallidos con Copilot AI...

[1/3] Analizando: Debe fallar con error de selector
🤖 [Copilot] Analizando error de tipo: timeout
   > Pidiendo sugerencia de selector...
🤖 [Copilot] Sugiriendo selectores...

[2/3] Analizando: Debe fallar con timeout
[3/3] Analizando: Debe fallar con assertion

✅ 7 tests validados correctamente.

✅ Reporte guardado en: reportes/auto-repair-2025-12-10T02-10-38.md

============================================================
📊 RESUMEN FINAL
============================================================
Total de tests: 10
✅ Pasando: 7
❌ Fallidos: 3
Tasa de éxito: 70.00%
============================================================
```

---

## 🔧 Personalización

### Para agregar más tipos de error:
Edita `helpers/ai-helper.js` en la función `detectErrorType()` y agrega:
```javascript
if (errorMessage.includes('tu-patrón')) return 'tu-tipo-error';
```

### Para cambiar el formato del reporte:
Edita la función `generateReport()` en `auto-repair.js`

### Para agregar más análisis:
Expande el objeto `analyses` en `analizarError()` en `ai-helper.js`

---

## ✅ Verificación

```bash
# Ver últimos reportes generados
ls -la reportes/

# Ver último reporte
cat reportes/auto-repair-*.md | tail -50

# Ver screenshots capturados
ls -la screenshots/

# Ejecutar nuevamente
npm run auto-repair
```

---

**Estado:** ✅ **COMPLETAMENTE FUNCIONAL**

El script auto-repair ahora:
- ✅ Ejecuta todos los tests
- ✅ Detecta cuáles fallaron
- ✅ Extrae código y error de cada uno
- ✅ Llama a Copilot AI para análisis
- ✅ Genera reportes detallados en Markdown
- ✅ Copia screenshots automáticamente
- ✅ Muestra resumen en consola

**Próximos usos:** `npm run auto-repair` cuando necesites analizar fallos de tests
