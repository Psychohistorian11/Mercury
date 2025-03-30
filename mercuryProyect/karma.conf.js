module.exports = function (config) {
  config.set({
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' } // <-- Importante para SonarCloud
      ]
    }
  });
};