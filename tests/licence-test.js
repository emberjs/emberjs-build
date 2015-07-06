'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');
var license = require('../lib/license');
var testLibPath     = path.join(__dirname, 'fixtures/packages');

describe('license', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('grabs the LICENSE file', function() {
    var tree = license(testLibPath);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(['LICENSE']);
      });
  });

  it('can grab a license not named LICENSE', function() {
    var tree = license(testLibPath, 'SOME_LICENSE');

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(['SOME_LICENSE']);
      });
  });
});
