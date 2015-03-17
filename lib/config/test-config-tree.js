'use strict';

var Funnel  = require('broccoli-funnel');

var replaceFeatures    = require('./../replace-features');

module.exports = function getTestConfigTree(opts) {
  var options = opts || {};

  var testConfig = new Funnel(options.libPath || 'tests', {
    include: [ /html$/, /js$/ ],
    destDir: '/tests'
  });

  return replaceFeatures(testConfig, {
    files: [ 'tests/index.html' ]
  });
};
