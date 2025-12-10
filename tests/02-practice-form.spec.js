// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Test Suite: Formularios - Practice Form', () => {
    
    test('Debe rellenar el formulario de práctica y verificar el modal de confirmación', async ({ page }) => {
        
        await test.step('Navegar a la página Practice Form', async () => {
            await page.goto('/automation-practice-form', { waitUntil: 'domcontentloaded' });
            await expect(page.locator('h1')).toHaveText('Practice Form');
        });

        const data = {
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@test.com',
            mobile: '1234567890',
            gender: 'Male',
            subjects: ['Maths', 'Chemistry'],
            address: 'Calle Demo 101, Ciudad Test',
            state: 'NCR',
            city: 'Delhi'
        };

        await test.step('Rellenar datos básicos y contacto', async () => {
            await page.locator('#firstName').fill(data.firstName);
            await page.locator('#lastName').fill(data.lastName);
            await page.locator('#userEmail').fill(data.email);
            
            // Seleccionar género
            await page.locator(`//label[text()='${data.gender}']`).click();
            
            await page.locator('#userNumber').fill(data.mobile);
        });

        await test.step('Rellenar Fecha de Nacimiento (Ejemplo: 28 Febrero 1990)', async () => {
            const dateOfBirth = page.locator('#dateOfBirthInput');
            await dateOfBirth.click();
            
            // Seleccionar año 1990
            await page.locator('.react-datepicker__year-select').selectOption('1990');
            
            // Seleccionar mes Febrero
            await page.locator('.react-datepicker__month-select').selectOption('1'); // Febrero es índice 1
            
            // Seleccionar día 28
            await page.locator('div[aria-label*="February 28th"]').click();
            // Cerrar el datepicker si queda abierto
            await page.keyboard.press('Escape');
        });

        await test.step('Rellenar Materias', async () => {
            const subjectsInput = page.locator('#subjectsInput');
            for (const subject of data.subjects) {
                await subjectsInput.fill(subject);
                await page.waitForTimeout(300); // Dar tiempo a que el dropdown aparezca
                await page.keyboard.press('Enter');
                await page.waitForTimeout(200);
            }
        });

        // Asegurar que no hay modales abiertos que intercepten clicks
        await page.keyboard.press('Escape');
        const maybeModal = page.locator('.modal-content');
        if ((await maybeModal.count()) > 0 && await maybeModal.isVisible()) {
            await page.locator('#closeLargeModal').click().catch(() => {});
            // No esperar explícitamente a que desaparezca para evitar fallos por cierre inesperado
        }

        // Ocultar banners flotantes que interceptan clicks (p. ej. anuncios)
        await page.evaluate(() => {
            const fixed = document.getElementById('fixedban');
            if (fixed) fixed.style.display = 'none';
            const footer = document.getElementsByTagName('footer')[0];
            if (footer) footer.style.display = 'none';
        });

        await test.step('Rellenar Hobbies, Dirección y Subir Imagen (opcional)', async () => {
            // Seleccionar Hobbies: Reading (evitar clicks usando evaluación DOM para evitar overlays)
            await page.locator('#hobbies-checkbox-2').evaluate(el => { /** @type {HTMLInputElement} */ (el).checked = true; /** @type {HTMLInputElement} */ (el).dispatchEvent(new Event('change', { bubbles: true })); });
            
            // Dirección actual
            await page.locator('#currentAddress').fill(data.address);
            // Quitar el footer para que el botón Submit sea visible y clickeable
            await page.evaluate(() => {
                document.getElementsByTagName('footer')[0].style.display = 'none';
            });
        });

        await test.step('Seleccionar Estado y Ciudad', async () => {
            // Seleccionar Estado
            const stateSelect = page.locator('#state');
            await stateSelect.click();
            await page.waitForTimeout(300);
            
            const stateOption = page.locator(`//div[contains(@class, 'css-') and text()='${data.state}']`).first();
            const stateOption2 = page.locator(`//div[text()='${data.state}']`).first();
            
            if (await stateOption.count() > 0) {
                await stateOption.click();
            } else if (await stateOption2.count() > 0) {
                await stateOption2.click();
            }
            
            await page.waitForTimeout(300);

            // Seleccionar Ciudad
            const citySelect = page.locator('#city');
            await citySelect.click();
            await page.waitForTimeout(300);
            
            const cityOption = page.locator(`//div[contains(@class, 'css-') and text()='${data.city}']`).first();
            const cityOption2 = page.locator(`//div[text()='${data.city}']`).first();
            
            if (await cityOption.count() > 0) {
                await cityOption.click();
            } else if (await cityOption2.count() > 0) {
                await cityOption2.click();
            }
        });

        await test.step('Enviar formulario', async () => {
            const submitButton = page.locator('#submit');
            await submitButton.scrollIntoViewIfNeeded();
            await submitButton.click({ timeout: 5000, force: true });
            
            // El modal puede tardar en aparecer, esperar hasta 15 segundos
            let modalFound = false;
            for (let i = 0; i < 15; i++) {
                const count = await page.locator('.modal-content').count();
                if (count > 0) {
                    modalFound = true;
                    break;
                }
                await page.waitForTimeout(1000);
            }
            
            if (!modalFound) {
                const errorMsg = await page.evaluate(() => {
                    const errors = document.querySelectorAll('[id$="-error"]');
                    return Array.from(errors).map(e => e.textContent).join(', ') || 'Sin errores visibles';
                });
                console.log('Form validation errors:', errorMsg);
                throw new Error(`Modal no apareció tras submit. Errores del formulario: ${errorMsg}`);
            }
        });
        
        await test.step('Verificar el modal de confirmación', async () => {
            const modal = page.locator('.modal-content');
            await expect(modal).toBeVisible();
            await expect(modal.locator('#example-modal-sizes-title-lg')).toHaveText('Thanks for submitting the form');

            // Verificar la tabla de datos
            await expect(modal.locator('td:has-text("Student Name") + td')).toHaveText(`${data.firstName} ${data.lastName}`);
            await expect(modal.locator('td:has-text("Student Email") + td')).toHaveText(data.email);
            await expect(modal.locator('td:has-text("Gender") + td')).toHaveText(data.gender);
            await expect(modal.locator('td:has-text("Mobile") + td')).toHaveText(data.mobile);
            await expect(modal.locator('td:has-text("Subjects") + td')).toHaveText(data.subjects.join(', '));
            await expect(modal.locator('td:has-text("Address") + td')).toHaveText(data.address);
            await expect(modal.locator('td:has-text("State and City") + td')).toHaveText(`${data.state} ${data.city}`);

            // Cerrar modal
            await page.locator('#closeLargeModal').click();
            await expect(modal).not.toBeVisible();
        });
    });
});