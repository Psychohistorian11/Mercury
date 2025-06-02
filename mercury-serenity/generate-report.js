const reporter = require('cucumber-html-reporter');

reporter.generate({
    theme: 'bootstrap',
    jsonFile: 'reports/report.json',
    output: 'reports/report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        "Project": "SerenityJS E2E",
        "Browser": "Playwright (Chromium)",
        "Platform": process.platform,
        "Executed": "Local"
    }
});
