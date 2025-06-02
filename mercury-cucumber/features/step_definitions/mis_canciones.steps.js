const { Given, When, Then } = require('@cucumber/cucumber');
const { expect, chromium } = require('@playwright/test');
let browser, context, page;


Given('el usuario está en la sección "Mis canciones"', async function () {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('http://localhost:4200/home/artist/11/my-songs');
    await expect(page.getByRole('heading', { name: /Explora tu Música/i })).toBeVisible();
});

When('el usuario hace clic en el botón "CREAR"', async function () {
    await page.click('[data-cy="crear"]');
});

Then('debería ver opciones para crear un álbum o un sencillo', async function () {
    await expect(page.locator('#sencillo-button')).toBeVisible();
    await expect(page.locator('#album-button')).toBeVisible();
});
