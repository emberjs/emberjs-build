'use strict';

var Funnel  = require('broccoli-funnel');
var replace = require('broccoli-replace');

var getTestConfigTree = require('./config/test-config-tree');

var s3TestRunner, testConfig;

module.exports = function getS3TestRunner() {
  if (!s3TestRunner) {
    testConfig = getTestConfigTree();

    s3TestRunner = new Funnel(testConfig, {
      srcDir: '/tests',
      destDir: '/ember-tests',
      files: ['index.html']
    });

    s3TestRunner = replace(s3TestRunner, {
      files: ['ember-tests/index.html'],
      patterns: [
        { match: new RegExp('../ember', 'g'), replacement: './ember' },
        { match: new RegExp('../qunit/qunit.css', 'g'), replacement: 'http://code.jquery.com/qunit/qunit-1.15.0.css' },
        { match: new RegExp('../qunit/qunit.js', 'g'), replacement: 'http://code.jquery.com/qunit/qunit-1.15.0.js' },
        { match: new RegExp('../jquery/jquery.js', 'g'), replacement: 'http://code.jquery.com/jquery-1.11.1.js'}
      ]
    });
  }

  return s3TestRunner;
};
