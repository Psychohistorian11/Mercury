const { Given, Then } = require('@cucumber/cucumber');
const { expect, chromium } = require('@playwright/test');

let browser, context, page;

Given('el artista navega a la página de creación de canciones', async function () {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('http://localhost:4200/home/artist/11/my-songs/create-song');
});

Then('debería ver un campo de texto para el nombre del sencillo', async function () {
    const nameInput = await page.locator('input[formcontrolname="name"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('type', 'text');
});

Then('debería ver un campo de archivo para subir el audio', async function () {
    const audioInput = await page.locator('input[type="file"]').nth(0);
    await expect(audioInput).toBeVisible();
    await expect(audioInput).toHaveAttribute('accept', 'audio/*');
});

Then('debería ver un campo de archivo para subir la imagen', async function () {
    const imageInput = await page.locator('input[type="file"]').nth(1);
    await expect(imageInput).toBeVisible();
    await expect(imageInput).toHaveAttribute('accept', 'file/*');
});

Then('debería ver un selector para elegir el género', async function () {
    const genreSelect = await page.locator('select[formcontrolname="genre"]');
    await expect(genreSelect).toBeVisible();
});


//Validar campos del formulario: 


Then('el campo {string} debe ser de tipo {string}', async function (fieldName, expectedType) {
    let locator;
    switch (fieldName) {
        case 'Nombre del sencillo':
            locator = page.locator('input[formcontrolname="name"]');
            break;
        default:
            throw new Error(`Campo "${fieldName}" no reconocido`);
    }

    await expect(locator).toBeVisible();
    await expect(locator).toHaveAttribute('type', expectedType);
});

Then('el campo {string} debe aceptar archivos de tipo {string}', async function (fieldName, acceptType) {
    let locator;
    switch (fieldName) {
        case 'Sencillo':
            locator = page.locator('input[type="file"]').nth(0);
            break;
        case 'Portada del sencillo':
            locator = page.locator('input[type="file"]').nth(1);
            break;
        default:
            throw new Error(`Campo "${fieldName}" no reconocido`);
    }

    await expect(locator).toBeVisible();
    await expect(locator).toHaveAttribute('accept', acceptType);
});

Then('el campo {string} debe ser un {string}', async function (fieldName, expectedType) {
    let locator;
    switch (fieldName) {
        case 'Género del sencillo':
            locator = page.locator('select[formcontrolname="genre"]');
            break;
        default:
            throw new Error(`Campo "${fieldName}" no reconocido`);
    }

    await expect(locator).toBeVisible();
    if (expectedType === 'select') {
        const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
        expect(tagName).toBe('select');
    }
});