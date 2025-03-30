module.exports = {
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageReporters: ["html", "lcov"],
    coverageDirectory: "coverage"
  };
  