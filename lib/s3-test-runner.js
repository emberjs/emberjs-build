'use strict';

var fs = require('fs');
var path = require('path');
var Funnel  = require('broccoli-funnel');
var replace = require('broccoli-string-replace');

var getTestConfigTree = require('./config/test-config-tree');

var s3TestRunner, testConfig;

function getQUnitVersion() {
  var configPath = path.join('bower_components', 'qunit', '.bower.json');
  if (!fs.existsSync(configPath)) {
    return '1.15.0';
  }

  var bowerConfig = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8' }));

  return bowerConfig.version;
}

module.exports = function getS3TestRunner() {
  if (!s3TestRunner) {
    var qunitVersion = getQUnitVersion();
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
        { match: new RegExp('../qunit/qunit.css', 'g'), replacement: 'http://code.jquery.com/qunit/qunit-' + qunitVersion + '.css' },
        { match: new RegExp('../qunit/qunit.js', 'g'), replacement: 'http://code.jquery.com/qunit/qunit-' + qunitVersion + '.js' },
        { match: new RegExp('../jquery/jquery.js', 'g'), replacement: 'http://code.jquery.com/jquery-1.11.1.js'}
      ]
    });
  }

  return s3TestRunner;
};
