import { test, expect } from '@playwright/test';

test.describe('Test Suite: Book Store - Búsqueda', () => {
    
    test('Debe buscar un libro y verificar el resultado filtrado', async ({ page }) => {
        
        await test.step('Navegar a la página Book Store', async () => {
            await page.goto('/books', { waitUntil: 'domcontentloaded' });
            // Esperar el cuadro de búsqueda para asegurar que la página está lista
            await page.waitForSelector('#searchBox', { state: 'visible' });
        });

        const searchTerm = 'Git'; // Término de búsqueda
        const tableRows = page.locator('.ReactTable .rt-tr-group');

        await test.step('Realizar la búsqueda', async () => {
            // Rellenar el campo de búsqueda
            await page.locator('#searchBox').fill(searchTerm);
            // La búsqueda se aplica automáticamente al escribir
        });

        await test.step('Verificar el resultado filtrado', async () => {
            // 1. Verificar que hay al menos un resultado visible
            const count = await tableRows.count();
            expect(count).toBeGreaterThan(0);
            
            // 2. Verificar que el título del primer libro visible contiene el término de búsqueda
            const bookTitle = await tableRows.nth(0).locator('div[role="gridcell"]').nth(1).textContent();
            expect(bookTitle).toContain(searchTerm);
        });
    });
});