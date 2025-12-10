import { test, expect } from '@playwright/test';

test.describe('Test Suite: Interacciones - Alerts', () => {
    
    test.beforeEach(async ({ page }) => {
        // Navegar esperando DOM listo para evitar timeouts largos
        await page.goto('/alerts', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('h1')).toHaveText('Alerts');
    });

    test('Debe aceptar la Alerta simple', async ({ page }) => {
        await test.step('Click en el botón y aceptar la alerta', async () => {
            // 1. Configurar el manejador de la alerta
            page.once('dialog', dialog => {
                expect(dialog.message()).toContain('You clicked a button');
                dialog.accept();
            });

            // 2. Click para disparar la alerta
            await page.locator('#alertButton').click();
        });
        
        // No hay verificación de resultado visible en la página para esta alerta simple
    });

    test('Debe aceptar la Alerta con delay', async ({ page }) => {
        await test.step('Click en el botón y esperar 5s para aceptar la alerta', async () => {
            // 1. Configurar el manejador de la alerta
            page.once('dialog', dialog => {
                expect(dialog.message()).toContain('This alert appeared after 5 seconds');
                dialog.accept();
            });

            // 2. Click para disparar la alerta (la alerta aparecerá después de 5 segundos)
            // Playwright espera automáticamente 30 segundos, así que la alerta será manejada.
            await page.locator('#timerAlertButton').click();
        });
    });

    test('Debe manejar el Prompt Box y verificar el resultado', async ({ page }) => {
        const inputText = 'Mi nombre de prueba';

        await test.step('Enviar texto al prompt y verificar', async () => {
            // 1. Configurar el manejador del prompt
            page.once('dialog', dialog => {
                expect(dialog.message()).toContain('Please enter your name');
                dialog.accept(inputText); // Enviar texto al prompt
            });

            // 2. Click para disparar el prompt
            await page.locator('#promtButton').click();
        });
        
        await test.step('Verificar el resultado en la página', async () => {
            const promptResult = page.locator('#promptResult');
            await expect(promptResult).toHaveText(`You entered ${inputText}`);
        });
    });
});