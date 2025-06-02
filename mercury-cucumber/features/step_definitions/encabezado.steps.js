const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');
let browser, context, page;

Given('el usuario abre la página del menú principal {string}', async function (url) {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url);
});

Then('debería ver el texto {string} en el header', async function (nombreApp) {
    const span = await page.locator('#logo_of_page span');
    await expect(span).toHaveText(nombreApp);
});



When('el usuario da clic en el logo de la aplicación', async function () {
    await page.click('[data-cy="logo"]');
});

Then('debería estar en la ruta {string}', async function (rutaEsperada) {
    const urlActual = page.url();
    expect(urlActual).toBe(rutaEsperada);
});

When('el usuario hace clic en el ícono del laboratorio', async function () {
    await page.click('[data-cy="lab"]');
});

Then('debería ser redirigido a la sección "Mis canciones"', async function () {
    await page.waitForURL('http://localhost:4200/home/artist/11/my-songs');
    await expect(page.getByRole('heading', { name: /Explora tu Música/i })).toBeVisible();
});


