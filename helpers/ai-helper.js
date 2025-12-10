// @ts-check
/**
 * AI Helper - Integración con GitHub Copilot
 * Proporciona análisis de errores de tests usando Copilot AI
 */

/**
 * Detecta el tipo de error basado en patrones en el mensaje
 * @param {string} errorMessage Mensaje de error
 * @returns {string} Tipo de error detectado
 */
function detectErrorType(errorMessage) {
    if (errorMessage.includes('Timeout')) return 'timeout';
    if (errorMessage.includes('selector') || errorMessage.includes('locator')) return 'selector';
    if (errorMessage.includes('navigation') || errorMessage.includes('navigate')) return 'navigation';
    if (errorMessage.includes('ERR_') || errorMessage.includes('net::')) return 'network';
    if (errorMessage.includes('assert') || errorMessage.includes('expect')) return 'assertion';
    if (errorMessage.includes('modal') || errorMessage.includes('dialog')) return 'modal';
    if (errorMessage.includes('click') || errorMessage.includes('disabled')) return 'interaction';
    return 'unknown';
}

/**
 * Analiza un error de Playwright usando IA de Copilot
 * @param {string} testCode El código fuente del test fallido
 * @param {string} errorMessage El mensaje de error
 * @returns {Object} Análisis con explanation y suggestion
 */
function analizarError(testCode, errorMessage) {
    const errorType = detectErrorType(errorMessage);
    console.log(`🤖 [Copilot] Analizando error de tipo: ${errorType}`);

    /** @type {Object<string, {explanation: string, suggestion: string}>} */
    const analyses = {
        timeout: {
            explanation: `**Timeout detectado**: El elemento no apareció en el tiempo esperado (30 segundos).`,
            suggestion: `1. Verifica que el selector sea correcto\n2. Usa selectores robustos: getByRole(), getByText(), getByLabel()\n3. Agrega esperas explícitas: await page.waitForSelector(selector, { state: 'visible' })\n4. Considera aumentar el timeout si es necesario`
        },
        selector: {
            explanation: `**Error de selector**: El elemento no se encontró en el DOM.`,
            suggestion: `1. Inspecciona el elemento en Dev Tools\n2. Usa selectores resilientes (getByRole, getByText)\n3. Evita selectores frágiles como índices o clases generadas\n4. Considera usar data-testid para elementos críticos`
        },
        navigation: {
            explanation: `**Error de navegación**: Falló la navegación a la página.`,
            suggestion: `1. Verifica que la URL sea accesible\n2. Comprueba la conexión de red\n3. Usa { waitUntil: 'domcontentloaded' } en lugar de 'networkidle'\n4. Verifica redirecciones no esperadas`
        },
        network: {
            explanation: `**Error de red**: Problema de conexión o CORS.`,
            suggestion: `1. Verifica la conexión a internet\n2. Comprueba que el servidor está corriendo\n3. Revisa logs del servidor para CORS\n4. Usa timeout más largo si hay latencia`
        },
        assertion: {
            explanation: `**Error de afirmación**: El valor no coincide con lo esperado.`,
            suggestion: `1. Verifica que el valor esperado sea correcto\n2. Usa toContainText() para búsquedas parciales\n3. Añade logs: console.log(await page.textContent(selector))\n4. Usa toHaveCount() > 0 para listas variables`
        },
        modal: {
            explanation: `**Problema con modal**: Hay un modal o dialog en la página.`,
            suggestion: `1. Espera a que el modal sea visible\n2. Maneja con page.once('dialog', handler)\n3. Cierra modales previos si bloquean\n4. Usa loops si el modal aparece dinámicamente`
        },
        interaction: {
            explanation: `**Error de interacción**: El elemento existe pero no se puede hacer click/fill.`,
            suggestion: `1. Verifica si el elemento está deshabilitado (disabled)\n2. Podría haber overlay bloqueando\n3. Intenta: .click({ force: true })\n4. Oculta overlays si es necesario`
        },
        unknown: {
            explanation: `**Error desconocido**: Requiere investigación manual.`,
            suggestion: `1. Revisa el mensaje de error completo\n2. Ejecuta con --headed para ver visualmente\n3. Captura: await page.screenshot()\n4. Usa --trace on para análisis detallado`
        }
    };

    const result = analyses[errorType];
    return result || analyses.unknown;
}

/**
 * Sugiere selectores alternativos para un elemento
 * @param {string} elementDescription Descripción del elemento
 * @returns {string} Selectores sugeridos
 */
function sugerirSelectorAlternativo(elementDescription) {
    console.log(`🤖 [Copilot] Sugiriendo selectores...`);
    
    return `**Selectores recomendados:**\n1. getByRole('button', { name: /texto/i })\n2. getByLabel('Etiqueta')\n3. getByText('Texto visible')\n4. getByPlaceholder('placeholder')\n5. locator('[data-testid=\"id\"]')\n6. locator('.selector').filter({ hasText: /contenido/ })`;
}

module.exports = {
    analizarError,
    sugerirSelectorAlternativo,
    detectErrorType
};