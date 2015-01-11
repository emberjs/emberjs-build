'use strict';

var pickFiles = require('broccoli-static-compiler');
var replace   = require('broccoli-replace');

var defeatureifyConfig = require('./defeatureify-config');

module.exports = function getTestConfigTree(opts) {
  var options = opts || {};

  var testConfig = pickFiles(options.libPath || 'tests', {
    srcDir: '/',
    files: ['**/*.*'],
    destDir: '/tests'
  });

  /*
    This actually replaces {{FEATURES}} with the contents of the features section
    in feature.json (https://github.com/emberjs/ember.js/blob/master/features.json#L2-L16).
    The defeatureifyConfig function moves the features property to enabled
    (https://github.com/emberjs/ember.js/blob/master/Brocfile.js#L35) since
    broccoli-defeatureify requires that format.
  */
  testConfig = replace(testConfig, {
    files: [ 'tests/index.html' ],
    patterns: [{
      match: /\{\{DEV_FEATURES\}\}/g,
      replacement: function() {
        var features = defeatureifyConfig().enabled;

        return JSON.stringify(features);
      }
    }, {
      match: /\{\{PROD_FEATURES\}\}/g,
      replacement: function() {
        var features = defeatureifyConfig({
          environment: 'production'
        }).enabled;

        return JSON.stringify(features);
      }
    }]
  });

  return testConfig;
};
