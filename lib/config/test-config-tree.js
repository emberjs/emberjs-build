'use strict';

var Funnel = require('broccoli-funnel');
var replaceFeatures = require('./../replace-features');

module.exports = function getTestConfigTree() {
  var options = arguments[arguments.length - 1] || {};

  var testConfig = new Funnel(options.libPath || 'tests', {
    include: [ /html$/, /js$/ ],
    destDir: '/tests'
  });

  return replaceFeatures(testConfig, {
    files: [ 'tests/index.html' ],
    features: options.features
  });
};
