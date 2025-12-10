// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Test Suite: Elementoos - Text Box', () => {
    
    test('Debe rellenar el formulario Text Box y verificar los datos de salida', async ({ page }) => {
        
        await test.step('Navegar a la página Text Box', async () => {
            await page.goto('/text-box', { waitUntil: 'domcontentloaded' });
            // Verificar que el título principal está presente
            await expect(page.locator('h1')).toHaveText('Text Box');
        });

        const fullName = 'Tu Nombre Completo';
        const email = 'tu.correo@ejemplo.com';
        const currentAddress = 'Calle Falsa 123';
        const permanentAddress = 'Avenida Siempre Viva 742';

        await test.step('Rellenar el formulario', async () => {
            await page.locator('#userName').fill(fullName);
            await page.locator('#userEmail').fill(email);
            await page.locator('#currentAddress').fill(currentAddress);
            await page.locator('#permanentAddress').fill(permanentAddress);
            
            // Ocultar el pie de página para que el botón Submit sea clickeable
            await page.evaluate(() => {
                document.getElementsByTagName('footer')[0].style.display = 'none';
            });
            
            await page.locator('#submit').click();
        });

        await test.step('Verificar los datos de salida', async () => {
            await expect(page.locator('#output #name')).toHaveText(`Name:${fullName}`);
            await expect(page.locator('#output #email')).toHaveText(`Email:${email}`);
            await expect(page.locator('#output #currentAddress')).toContainText(currentAddress);
            await expect(page.locator('#output #permanentAddress')).toContainText(permanentAddress);
        });
    });
});