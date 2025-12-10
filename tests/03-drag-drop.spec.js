import { test, expect } from '@playwright/test';

test.describe('Test Suite: Interacciones - Drag and Drop', () => {
    
    test('Debe arrastrar el elemento y verificar el cambio de color y texto', async ({ page }) => {
        
        await test.step('Navegar a la página Droppable', async () => {
            await page.goto('/droppable');
            

            await expect(page.locator('h1')).toHaveText('Droppable');
        });

        const draggable = page.locator('#draggable');
        const droppable = page.locator('#simpleDropContainer #droppable');

        let initialColor;
        let finalColor;

        await test.step('Capturar el estado inicial', async () => {
            // Capturar color inicial del área droppable (debería ser blanco/gris)
            initialColor = await droppable.evaluate(el => getComputedStyle(el).backgroundColor);
            await expect(droppable).toHaveText('Drop here');
        });

        await test.step('Realizar la acción de Drag and Drop', async () => {
            // Mover el elemento arrastrable al destino
            await draggable.dragTo(droppable);
        });

        await test.step('Verificar el estado final', async () => {
            // Capturar el color final del área droppable
            finalColor = await droppable.evaluate(el => getComputedStyle(el).backgroundColor);

            // 1. Verificar el cambio de texto
            await expect(droppable).toHaveText('Dropped!');

            // 2. Verificar el cambio de color (El color verde claro es rgb(70, 130, 180))
            // Este es el valor RGB para el color azul después de soltarlo.
            await expect(finalColor).toBe('rgb(70, 130, 180)'); 

            // 3. Verificar que el color inicial es diferente al final
            await expect(initialColor).not.toBe('rgb(70, 130, 180)'); 
        });
    });
});