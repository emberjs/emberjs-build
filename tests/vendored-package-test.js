'use strict';

var path     = require('path');
var expect   = require('expect.js');
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var vendoredPackage = require('../lib/vendored-package');
var testLibPath     = 'tests/fixtures/packages/foo-bar/lib';

describe('vendored-package', function() {
  var builder;

  var expectedPath = path.join(__dirname, 'expected/packages');

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly converts the tree from `packages/foo-bar/lib/main.js` to `/foo-bar.js`', function() {
    var tree = vendoredPackage('foo-bar', {
      libPath: testLibPath
    }, true, true);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.eql(walkSync(expectedPath));
      });
  });
});
