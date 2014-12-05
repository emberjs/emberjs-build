'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var htmlbarsPackage = require('../lib/htmlbars-package');
var testLibPath     = 'tests/fixtures/htmlbars/dist/es6/';

describe('htmlbars-package', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly creates a htmlbars tree', function() {
    var expectedPath = path.join(__dirname, 'expected/htmlbars-util');

    var tree = htmlbarsPackage('htmlbars-util', {
      libPath: testLibPath
    }, true, true);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });

  it('correctly creates a htmlbars tree when singleFile is true', function() {
    var expectedPath = path.join(__dirname, 'expected/htmlbars-test-helpers');

    var tree = htmlbarsPackage('htmlbars-test-helpers', {
      singleFile: true,
      libPath: testLibPath
    }, true, true);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });
});
