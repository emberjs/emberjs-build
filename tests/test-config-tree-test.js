'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var getTestConfigTree = require('../lib/test-config-tree');
var testLibPath       = path.join(__dirname, 'fixtures/tests');
var expectedPath      = path.join(__dirname, 'expected/tests');

describe('test-config-tree', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('returns a correct tree', function() {
    var tree = getTestConfigTree({
      libPath: testLibPath
    });

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });

  it('correctly replaces `{{FEATURES}}` tag', function() {
    var tree = getTestConfigTree({
      libPath: testLibPath
    });

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        var actualText   = fs.readFileSync(outputPath + '/tests/index.html', { encoding: 'UTF-8' });
        var expectedText = fs.readFileSync(expectedPath + '/tests/index.html', { encoding: 'UTF-8' });

        expect(actualText).to.equal(expectedText);
      });
  });
});
