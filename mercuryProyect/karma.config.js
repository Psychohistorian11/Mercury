module.exports = function (config) {
  config.set({
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      subdir: '.',
      file: 'lcov.info'
    },
  });
};
