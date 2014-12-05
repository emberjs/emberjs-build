'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var vendoredPackage = require('../lib/vendored-package');
var testLibPath     = path.join(__dirname, 'fixtures/packages/loader/lib');
var expectedPath    = path.join(__dirname, 'expected/packages');

/*
  Input:
    loader/
      main.js

  Output:
    loader.js
    loader/
*/

describe('vendored-package', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly converts the tree from `packages/foo-bar/lib/main.js` to `/foo-bar.js`', function() {
    var tree = vendoredPackage('loader', {
      libPath: testLibPath
    });

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });
});
