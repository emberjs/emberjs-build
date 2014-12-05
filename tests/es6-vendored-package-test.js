'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var vendoredPackage = require('../lib/es6-vendored-package');
var testLibPath     = 'tests/fixtures/bower_components/foo-bar/lib';

describe('es6-vendored-package', function() {
  var builder;

  var expectedPath = path.join(__dirname, 'expected/bower_components/');

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly converts vendor tree from `bower_components/foo-bar/lib/`', function() {
    var tree = vendoredPackage('foo-bar', {
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
