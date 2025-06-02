const { AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(30000);

let browser;

module.exports = {
    setBrowser: (b) => { browser = b; },

    setupHooks: () => {
        AfterAll(async () => {
            if (browser) {
                await browser.close();
            }
        });
    },

    getBrowser: () => browser
};
