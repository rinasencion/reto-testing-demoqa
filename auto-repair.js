// @ts-check
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { analizarError, sugerirSelectorAlternativo } = require('./helpers/ai-helper');

// Configuración
const REPORT_DIR = path.join(__dirname, 'reportes');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const TEST_RESULTS_DIR = path.join(__dirname, 'test-results');

// Crear directorios
[REPORT_DIR, SCREENSHOTS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/**
 * Copia screenshots desde test-results a la carpeta screenshots
 */
function copyScreenshotsFromTestResults() {
    console.log('📸 Copiando screenshots desde test-results...');
    try {
        if (!fs.existsSync(TEST_RESULTS_DIR)) return;
        
        const items = fs.readdirSync(TEST_RESULTS_DIR);
        let totalCopied = 0;
        
        items.forEach(item => {
            const testDir = path.join(TEST_RESULTS_DIR, item);
            if (fs.statSync(testDir).isDirectory()) {
                const files = fs.readdirSync(testDir);
                files.forEach(file => {
                    if (file.endsWith('.png')) {
                        const src = path.join(testDir, file);
                        const destName = `${item}-${file}`;
                        const dest = path.join(SCREENSHOTS_DIR, destName);
                        fs.copyFileSync(src, dest);
                        totalCopied++;
                    }
                });
            }
        });
        
        if (totalCopied > 0) {
            console.log(`✅ ${totalCopied} screenshot(s) copiado(s) a ${SCREENSHOTS_DIR}`);
        }
    } catch (error) {
        console.log(`⚠️ No se pudieron copiar screenshots: ${error.message}`);
    }
}

/**
 * Ejecuta los tests de Playwright
 */
function runTests() {
    console.log('🚀 Ejecutando tests de Playwright...');
    try {
        // Ejecutar tests con reporter JSON
        const reportFile = path.join(__dirname, 'test-report.json');
        execSync(`npx playwright test --reporter=json > "${reportFile}"`, { 
            shell: true,
            stdio: 'pipe'
        });
        
        // Leer archivo JSON
        if (fs.existsSync(reportFile)) {
            const jsonText = fs.readFileSync(reportFile, 'utf-8');
            return JSON.parse(jsonText);
        }
        return null;
    } catch (error) {
        // Aún si hay error, Playwright genera el JSON
        console.log('⚠️ Finalizando análisis...');
        try {
            const reportFile = path.join(__dirname, 'test-report.json');
            if (fs.existsSync(reportFile)) {
                const jsonText = fs.readFileSync(reportFile, 'utf-8');
                return JSON.parse(jsonText);
            }
        } catch (e) {
            // No action
        }
        return null;
    }
}

/**
 * Extrae información de pruebas del JSON de Playwright (estructura anidada)
 */
function extractTestsFromJSON(results) {
    const failedTests = [];
    const passedTests = [];

    if (!results || !results.suites) {
        return { failedTests, passedTests };
    }

    // Función recursiva para procesar suites anidadas
    function processSuite(suite) {
        // Procesar specs en la suite actual
        if (suite.specs && suite.specs.length > 0) {
            suite.specs.forEach(spec => {
                if (!spec.tests) return;

                spec.tests.forEach(testRun => {
                    if (!testRun.results) return;

                    testRun.results.forEach(result => {
                        const testInfo = {
                            title: spec.title,
                            file: suite.file,
                            status: result.status,
                            duration: result.duration,
                            error: null,
                            code: ''
                        };

                        // Extraer error
                        if (result.errors && result.errors.length > 0) {
                            testInfo.error = result.errors[0].message || 'Error desconocido';
                        }

                        // Leer código del test
                        try {
                            const testFile = path.join(__dirname, suite.file);
                            testInfo.code = fs.readFileSync(testFile, 'utf-8');
                        } catch (e) {
                            testInfo.code = '// Archivo no disponible';
                        }

                        // Clasificar por estado
                        if (result.status === 'failed' || result.status === 'timedOut') {
                            failedTests.push(testInfo);
                        } else if (result.status === 'passed') {
                            passedTests.push(testInfo);
                        }
                    });
                });
            });
        }

        // Procesar suites anidadas
        if (suite.suites && suite.suites.length > 0) {
            suite.suites.forEach(nestedSuite => {
                processSuite(nestedSuite);
            });
        }
    }

    // Procesar todas las suites
    results.suites.forEach(suite => {
        processSuite(suite);
    });

    return { failedTests, passedTests };
}

/**
 * Genera reporte completo
 */
async function generateReport(failedTests, passedTests) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const totalTests = failedTests.length + passedTests.length;
    const successRate = totalTests > 0 ? ((passedTests.length / totalTests) * 100).toFixed(2) : '0.00';

    let reportContent = '';

    // Encabezado
    if (failedTests.length > 0) {
        reportContent += `# 🔴 Reporte de Auto-Reparación - ${failedTests.length} Test(s) Fallido(s)\n\n`;
    } else {
        reportContent += `# ✅ Reporte de Validación - Todos los Tests Pasando\n\n`;
    }

    reportContent += `**Fecha:** ${new Date().toLocaleString()}\n`;
    reportContent += `**Generado por:** 🤖 Copilot AI Helper\n\n`;

    // Resumen
    reportContent += `## 📊 Resumen Ejecutivo\n\n`;
    reportContent += `| Métrica | Valor |\n`;
    reportContent += `|---------|-------|\n`;
    reportContent += `| Tests Totales | ${totalTests} |\n`;
    reportContent += `| ✅ Pasando | ${passedTests.length} |\n`;
    reportContent += `| ❌ Fallidos | ${failedTests.length} |\n`;
    reportContent += `| Tasa de Éxito | ${successRate}% |\n\n`;

    // Tests fallidos
    if (failedTests.length > 0) {
        reportContent += `## ❌ Tests Fallidos (${failedTests.length})\n\n`;
        
        console.log(`\n🧠 Analizando ${failedTests.length} tests fallidos con Copilot AI...`);

        for (let i = 0; i < failedTests.length; i++) {
            const test = failedTests[i];
            console.log(`\n[${i + 1}/${failedTests.length}] Analizando: ${test.title}`);

            // Análisis Copilot AI
            const aiAnalysis = await analizarError(test.code, test.error);
            
            // Sugerencias de selector
            let selectorSuggestions = '';
            if (test.error && (test.error.toLowerCase().includes('selector') || test.error.toLowerCase().includes('locator'))) {
                console.log(`   > Pidiendo sugerencia de selector...`);
                selectorSuggestions = await sugerirSelectorAlternativo('elemento');
            }

            // Bloque del test
            reportContent += `### ❌ ${test.title}\n\n`;
            reportContent += `**Archivo:** \`${test.file}\`\n`;
            reportContent += `**Duración:** ${test.duration}ms\n`;
            reportContent += `**Estado:** ❌ FALLIDO\n\n`;

            reportContent += `#### 🔴 Error Original\n\n\`\`\`text\n`;
            reportContent += test.error ? test.error.substring(0, 800) : 'Sin mensaje de error';
            reportContent += `\n\`\`\`\n\n`;

            reportContent += `#### 🤖 Análisis Copilot AI\n\n`;
            reportContent += aiAnalysis.explanation + '\n\n';

            reportContent += `#### 💡 Sugerencias de Reparación\n\n`;
            reportContent += aiAnalysis.suggestion + '\n\n';

            if (selectorSuggestions) {
                reportContent += `#### 🎯 Selectores Alternativos\n\n`;
                reportContent += selectorSuggestions + '\n\n';
            }

            reportContent += `#### 📝 Código del Test\n\n\`\`\`javascript\n`;
            reportContent += test.code.substring(0, 1000);
            if (test.code.length > 1000) {
                reportContent += '\n... (código truncado)\n';
            }
            reportContent += `\`\`\`\n\n`;
            reportContent += `---\n\n`;
        }
    }

    // Tests pasando
    if (passedTests.length > 0) {
        reportContent += `## ✅ Tests Pasando (${passedTests.length})\n\n`;
        
        console.log(`\n✅ ${passedTests.length} tests validados correctamente.`);

        passedTests.forEach(test => {
            reportContent += `### ✅ ${test.title}\n\n`;
            reportContent += `**Archivo:** \`${test.file}\`\n`;
            reportContent += `**Duración:** ${test.duration}ms\n`;
            reportContent += `**Estado:** ✅ PASANDO\n\n`;
        });
    }

    // Conclusión
    reportContent += `## 📋 Conclusión\n\n`;
    if (failedTests.length > 0) {
        reportContent += `Se detectaron **${failedTests.length} test(s) fallido(s)**. Revisa el análisis de Copilot AI arriba para las sugerencias de reparación.\n\n`;
        reportContent += `**Próximos pasos:**\n`;
        reportContent += `1. Implementar las sugerencias de Copilot AI\n`;
        reportContent += `2. Ejecutar nuevamente: \`npm run auto-repair\`\n`;
        reportContent += `3. Revisar screenshots: \`./screenshots/\`\n`;
    } else {
        reportContent += `✅ **¡EXCELENTE!** Todos los tests están pasando.\n\n`;
        reportContent += `Tasa de éxito: **${successRate}%**\n`;
    }

    reportContent += `\n---\n\n`;
    reportContent += `**Generado por:** 🤖 Copilot AI Helper\n`;
    reportContent += `**Fecha:** ${new Date().toLocaleString()}\n`;

    // Guardar reporte
    const reportFileName = `auto-repair-${timestamp}.md`;
    const reportFilePath = path.join(REPORT_DIR, reportFileName);
    fs.writeFileSync(reportFilePath, reportContent);
    
    console.log(`\n✅ Reporte guardado en: ${reportFilePath}`);

    // Mostrar resumen
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 RESUMEN FINAL`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Total de tests: ${totalTests}`);
    console.log(`✅ Pasando: ${passedTests.length}`);
    console.log(`❌ Fallidos: ${failedTests.length}`);
    console.log(`Tasa de éxito: ${successRate}%`);
    console.log(`${'='.repeat(60)}\n`);

    return reportFilePath;
}

/**
 * Función principal
 */
async function main() {
    try {
        const results = runTests();
        
        if (!results) {
            console.error('❌ No se pudo generar el reporte de tests');
            return;
        }

        copyScreenshotsFromTestResults();

        const { failedTests, passedTests } = extractTestsFromJSON(results);
        
        if (failedTests.length === 0 && passedTests.length === 0) {
            console.log('⚠️ No se encontraron tests para analizar');
            return;
        }

        await generateReport(failedTests, passedTests);
        
    } catch (error) {
        console.error('❌ Error en auto-repair:', error.message);
    }
}

main().catch(console.error);
