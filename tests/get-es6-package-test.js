'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');

var getES6Package = require('../lib/get-es6-package');

var fixtureLibPath  = path.join(__dirname, 'fixtures/packages/ember-metal/lib');
var fixtureTestPath = path.join(__dirname, 'fixtures/packages/ember-metal/tests');

var expectedPath;

describe('get-es6-package', function() {
  var builder;
  var packages = {
    'ember-metal': { }
  };

  var fullTree = getES6Package(packages, 'ember-metal', {
    libPath:  fixtureLibPath,
    testPath: fixtureTestPath
  });

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }

    expectedPath = null;
  });

  it('correctly creates a lib tree', function() {
    expectedPath = path.join(__dirname, 'expected/packages/ember-metal/');

    builder = new broccoli.Builder(fullTree.lib);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });

  // it('correctly creates a compiled tree', function() {
    // builder = new broccoli.Builder(fullTree.compiledTree);

    // expectedPath = path.join(__dirname, 'expected/packages/ember-metal-compiled-tree/');

    // return builder.build()
      // .then(function(results) {
        // var outputPath = results.directory;

        // expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      // });
  // });

  // it('correctly creates a vendor tree', function() {
    // builder = new broccoli.Builder(fullTree.vendorTrees);

    // return builder.build()
      // .then(function(results) {
        // var outputPath = results.directory;

        // expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      // });
  // });

  // it('correctly creates a tests tree', function() {
    // builder = new broccoli.Builder(fullTree.tests);

    // expectedPath = path.join(__dirname, 'expected/packages/ember-metal-tests-tree/');

    // return builder.build()
      // .then(function(results) {
        // var outputPath = results.directory;

        // expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      // });
  // });
});
