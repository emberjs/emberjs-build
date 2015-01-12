'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');
var Funnel   = require('broccoli-funnel');

var getES6Package = require('../lib/get-es6-package');

var fixtureLibPath, fixtureTestPath, fixtureLoaderPath, fixtureGeneratorsPath, expectedPath, configPath;

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
    configPath      = path.join(__dirname, 'fixtures/jscs/.jscsrc');

    var fullTree = getES6Package(packages, 'ember-metal', {
      libPath:    fixtureLibPath,
      testPath:   fixtureTestPath,
      configPath: configPath
    });

    builder = new broccoli.Builder(fullTree.tests);

    expectedPath = path.join(__dirname, 'expected/packages/ember-metal-tests-tree/');

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal([
          'ember-metal/',
          'ember-metal/alias.jscs-test.js',
          'ember-metal/alias.jshint.js',
          'ember-metal/array.jscs-test.js',
          'ember-metal/array.jshint.js',
          'ember-metal/binding.jscs-test.js',
          'ember-metal/binding.jshint.js',
          'ember-metal/streams/',
          'ember-metal/streams/simple.jscs-test.js',
          'ember-metal/streams/simple.jshint.js',
          'ember-metal/tests/',
          'ember-metal/tests/alias_test.js',
          'ember-metal/tests/alias_test.jscs-test.js',
          'ember-metal/tests/alias_test.jshint.js',
          'ember-metal/tests/array_test.js',
          'ember-metal/tests/array_test.jscs-test.js',
          'ember-metal/tests/array_test.jshint.js',
          'ember-metal/tests/binding_test.js',
          'ember-metal/tests/binding_test.jscs-test.js',
          'ember-metal/tests/binding_test.jshint.js',
          'ember-metal/tests/streams/',
          'ember-metal/tests/streams/simple_test.js',
          'ember-metal/tests/streams/simple_test.jscs-test.js',
          'ember-metal/tests/streams/simple_test.jshint.js',
          'ember-metal.jscs-test.js',
          'ember-metal.jshint.js'
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

  it('correctly creates a compiled tree', function() {
    var packages = {
      'ember-metal': { }
    };

    fixtureLibPath        = path.join(__dirname, 'fixtures/packages/ember-metal/lib');
    fixtureTestPath       = path.join(__dirname, 'fixtures/packages/ember-metal/tests');
    fixtureLoaderPath     = path.join(__dirname, 'fixtures/loader');
    fixtureGeneratorsPath = path.join(__dirname, 'fixtures/generators');

    var loaderTree = new Funnel(fixtureLoaderPath, {
      files: ['loader.js'],
      destDir: '/'
    });

    var fullTree = getES6Package(packages, 'ember-metal', {
      libPath:    fixtureLibPath,
      testPath:   fixtureTestPath,
      loader:     loaderTree,
      generators: fixtureGeneratorsPath
    });

    builder = new broccoli.Builder(fullTree.compiledTree);

    expectedPath = path.join(__dirname, 'expected/packages/ember-metal-compiled-tree/');

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
        vendorRequirements: ['simple-html-tokenizer', 'htmlbars-util', 'htmlbars-compiler', 'htmlbars-syntax', 'htmlbars-test-helpers']
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
      libPath:    fixtureLibPath,
      testPath:   fixtureTestPath,
      loader:     loaderTree,
      generators: fixtureGeneratorsPath
    });

    builder = new broccoli.Builder(fullTree.vendorTrees);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal([
          'htmlbars-compiler/',
          'htmlbars-compiler/compiler.js',
          'htmlbars-compiler/fragment-javascript-compiler.js',
          'htmlbars-compiler/fragment-opcode-compiler.js',
          'htmlbars-compiler/hydration-javascript-compiler.js',
          'htmlbars-compiler/hydration-opcode-compiler.js',
          'htmlbars-compiler/template-compiler.js',
          'htmlbars-compiler/template-visitor.js',
          'htmlbars-compiler/utils.js',
          'htmlbars-compiler.js',
          'htmlbars-runtime/',
          'htmlbars-runtime/helpers.js',
          'htmlbars-runtime/hooks.js',
          'htmlbars-runtime.js',
          'htmlbars-syntax/',
          'htmlbars-syntax/builders.js',
          'htmlbars-syntax/handlebars/',
          'htmlbars-syntax/handlebars/compiler/',
          'htmlbars-syntax/handlebars/compiler/ast.js',
          'htmlbars-syntax/handlebars/compiler/base.js',
          'htmlbars-syntax/handlebars/compiler/helpers.js',
          'htmlbars-syntax/handlebars/compiler/parser.js',
          'htmlbars-syntax/handlebars/compiler/visitor.js',
          'htmlbars-syntax/handlebars/compiler/whitespace-control.js',
          'htmlbars-syntax/handlebars/exception.js',
          'htmlbars-syntax/handlebars/safe-string.js',
          'htmlbars-syntax/handlebars/utils.js',
          'htmlbars-syntax/node-handlers.js',
          'htmlbars-syntax/parser.js',
          'htmlbars-syntax/token-handlers.js',
          'htmlbars-syntax/tokenizer.js',
          'htmlbars-syntax/utils.js',
          'htmlbars-syntax/walker.js',
          'htmlbars-syntax.js',
          'htmlbars-test-helpers.js',
          'htmlbars-util/',
          'htmlbars-util/array-utils.js',
          'htmlbars-util/handlebars/',
          'htmlbars-util/handlebars/safe-string.js',
          'htmlbars-util/handlebars/utils.js',
          'htmlbars-util/object-utils.js',
          'htmlbars-util/quoting.js',
          'htmlbars-util/safe-string.js',
          'htmlbars-util.js',
          'htmlbars.js',
          'morph/',
          'morph/attr-morph/',
          'morph/attr-morph/sanitize-attribute-value.js',
          'morph/attr-morph.js',
          'morph/dom-helper/',
          'morph/dom-helper/build-html-dom.js',
          'morph/dom-helper/classes.js',
          'morph/dom-helper/prop.js',
          'morph/dom-helper.js',
          'morph/morph.js',
          'morph.js',
          'simple-html-tokenizer/',
          'simple-html-tokenizer/char-refs/',
          'simple-html-tokenizer/char-refs/full.js',
          'simple-html-tokenizer/char-refs/min.js',
          'simple-html-tokenizer/entity-parser.js',
          'simple-html-tokenizer/generate.js',
          'simple-html-tokenizer/generator.js',
          'simple-html-tokenizer/tokenize.js',
          'simple-html-tokenizer/tokenizer.js',
          'simple-html-tokenizer/tokens.js',
          'simple-html-tokenizer/utils.js',
          'simple-html-tokenizer.js',
          'simple-html-tokenizer.umd.js'
        ]);
      });
  });
});
