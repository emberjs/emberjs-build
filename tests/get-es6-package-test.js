'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');
var Funnel   = require('broccoli-funnel');
var htmlbarsPackage = require('../lib/htmlbars-package');

var getES6Package = require('../lib/get-es6-package');

var fixtureLibPath, fixtureTestPath, fixtureLoaderPath, fixtureGeneratorsPath, expectedPath;

function mockTree(name) {
  // good enough for our use-case, we can always make it more u
  return {
    inputTrees: [],
    annotation: name,
    rebuild: function() { },
    cleanup: function() { }
  };
}

describe('get-es6-package', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }

    expectedPath = null;
  });

  it('correctly creates a lib tree', function() {
    var packages = {
      'ember-metal': { }
    };

    fixtureLibPath  = path.join(__dirname, 'fixtures/packages/ember-metal/lib');
    fixtureTestPath = path.join(__dirname, 'fixtures/packages/ember-metal/tests');

    var fullTree = getES6Package(packages, 'ember-metal', {
      libPath:  fixtureLibPath,
      testPath: fixtureTestPath
    });

    expectedPath = path.join(__dirname, 'expected/packages/ember-metal/');

    builder = new broccoli.Builder(fullTree.lib);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });

  it('correctly creates a tests tree', function() {
    var packages = {
      'ember-metal': { }
    };

    fixtureLibPath  = path.join(__dirname, 'fixtures/packages/ember-metal/lib');
    fixtureTestPath = path.join(__dirname, 'fixtures/packages/ember-metal/tests');

    var fullTree = getES6Package(packages, 'ember-metal', {
      libPath:    fixtureLibPath,
      testPath:   fixtureTestPath,
    });

    builder = new broccoli.Builder(fullTree.tests);

    expectedPath = path.join(__dirname, 'expected/packages/ember-metal-tests-tree/');

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal([
          'ember-metal.lint-test.js',
          'ember-metal/',
          'ember-metal/alias.lint-test.js',
          'ember-metal/array.lint-test.js',
          'ember-metal/binding.lint-test.js',
          'ember-metal/streams/',
          'ember-metal/streams/simple.lint-test.js',
          'ember-metal/tests/',
          'ember-metal/tests/alias_test.js',
          'ember-metal/tests/alias_test.lint-test.js',
          'ember-metal/tests/array_test.js',
          'ember-metal/tests/array_test.lint-test.js',
          'ember-metal/tests/binding_test.js',
          'ember-metal/tests/binding_test.lint-test.js',
          'ember-metal/tests/streams/',
          'ember-metal/tests/streams/simple_test.js',
          'ember-metal/tests/streams/simple_test.lint-test.js'
        ]);
      });
  });

  it('correctly creates a lib tree for an empty package', function() {
    var packages = {
      'ember-debug': { }
    };

    fixtureLibPath  = path.join(__dirname, 'fixtures/packages/ember-debug/lib');
    fixtureTestPath = path.join(__dirname, 'fixtures/packages/ember-debug/tests');

    var fullTree = getES6Package(packages, 'ember-debug', {
      libPath:  fixtureLibPath,
      testPath: fixtureTestPath
    });

    expectedPath = path.join(__dirname, 'expected/packages/ember-debug/');

    builder = new broccoli.Builder(fullTree.lib);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });

  it('correctly creates a vendor tree', function() {
    var packages = {
      'ember-template-compiler': {
        trees: null,
        vendorRequirements: [
          'simple-html-tokenizer',
          'htmlbars-util',
          'htmlbars-compiler',
          'htmlbars-syntax',
          'htmlbars-test-helpers'
        ]
      },
      'ember-metal-views': {
        trees: null,
        vendorRequirements: ['morph']
      },
      'ember-htmlbars': {
        trees: null,
        vendorRequirements: ['htmlbars-util'],
        requirements: ['ember-metal-views', 'ember-template-compiler'],
        hasTemplates: true
      }
    };

    fixtureLibPath        = path.join(__dirname, 'fixtures/packages/ember-htmlbars/lib');
    fixtureTestPath       = path.join(__dirname, 'fixtures/packages/ember-htmlbars/tests');
    fixtureLoaderPath     = path.join(__dirname, 'fixtures/loader');
    fixtureGeneratorsPath = path.join(__dirname, 'fixtures/generators');

    var loaderTree = new Funnel(fixtureLoaderPath, {
      files: ['loader.js'],
      destDir: '/'
    });

    var fullTree = getES6Package(packages, 'ember-htmlbars', {
      htmlbars: { compileSpec: function() { } },
      libPath:    fixtureLibPath,
      testPath:   fixtureTestPath,
      loader:     loaderTree,
      generators: fixtureGeneratorsPath,
      vendoredPackages: {
        'morph': mockTree(),
        'htmlbars-util': htmlbarsPackage('htmlbars-util'),
        'simple-html-tokenizer': mockTree(),
        'htmlbars-compiler': mockTree(),
        'htmlbars-syntax': mockTree(),
        'htmlbars-test-helpers': mockTree(),
      }
    });

    builder = new broccoli.Builder(fullTree.vendorTrees);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal([
          'htmlbars-util.js',
          'htmlbars-util/',
          'htmlbars-util/array-utils.js',
          'htmlbars-util/handlebars/',
          'htmlbars-util/handlebars/safe-string.js',
          'htmlbars-util/handlebars/utils.js',
          'htmlbars-util/namespaces.js',
          'htmlbars-util/object-utils.js',
          'htmlbars-util/quoting.js',
          'htmlbars-util/safe-string.js'
        ]);
      });
  });

  it('compiles typescript if option is enabled', function() {
    var packages = {
      'container': { isTypeScript: true }
    };

    fixtureLibPath  = path.join(__dirname, 'fixtures/packages/container/lib');
    fixtureTestPath = path.join(__dirname, 'fixtures/packages/container/tests');

    var fullTree = getES6Package(packages, 'container', {
      libPath:  fixtureLibPath,
      testPath: fixtureTestPath
    });

    expectedPath = path.join(__dirname, 'expected/packages/container/');

    builder = new broccoli.Builder(fullTree.lib);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(walkSync(expectedPath));
      });
  });
});
