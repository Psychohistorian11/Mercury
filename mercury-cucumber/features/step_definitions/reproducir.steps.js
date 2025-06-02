const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const assert = require('assert');
const { setBrowser } = require('../support/hooks');

let browser, context, page;

Given('el usuario abre la página {string}', async function (url) {
    browser = await chromium.launch({ headless: true });
    setBrowser(browser);
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
});

When('el usuario da clic en una canción', async function () {
    await page.click('[data-cy="next-button"]');
});

Then('la canción empieza a reproducirse', async function () {
    await page.waitForSelector('[data-cy="pause-icon"]', { timeout: 5000 });
    const isVisible = await page.isVisible('[data-cy="pause-icon"]');
    assert.strictEqual(isVisible, true);
});


