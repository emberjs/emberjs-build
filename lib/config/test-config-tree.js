'use strict';

var pickFiles = require('broccoli-static-compiler');

var replaceFeatures    = require('./../replace-features');

module.exports = function getTestConfigTree(opts) {
  var options = opts || {};

  var testConfig = pickFiles(options.libPath || 'tests', {
    srcDir: '/',
    files: ['**/*.*'],
    destDir: '/tests'
  });

  return replaceFeatures(testConfig, {
    files: [ 'tests/index.html' ]
  });
};
