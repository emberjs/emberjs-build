'use strict';

var chai   = require('chai');
var expect = chai.expect;

var EmberBuild              = require('../lib/ember-build');
var ensureMethodReturnsTree = require('./helpers/ensure-method-returns-tree');

describe('ember-build', function() {
  it('exists and is a function', function() {
    expect(EmberBuild).to.be.ok();
    expect(typeof EmberBuild === 'function').to.be.true();
  });

  it('initializes properties properly', function() {
    var emberBuild = new EmberBuild();

    expect(emberBuild._packages).to.be.null();
    expect(emberBuild._trees).to.deep.equal({
      buildTree:             null,
      distTrees:             null,
      prodTrees:             null,
      compiledTests:         null,
      compiledSource:        null,
      prodCompiledTests:     null,
      minCompiledSource:     null,
      prodCompiledSource:    null,
      deprecatedDebugFile:   null,
      testingCompiledSource: null
    });
  });

  ensureMethodReturnsTree('_generateCompiledSourceTree');
  ensureMethodReturnsTree('_generateProdCompiledSourceTree');
  ensureMethodReturnsTree('_generateCompiledTestsTree');
  ensureMethodReturnsTree('_generateProdCompiledTestsTree');
  ensureMethodReturnsTree('_generateDeprecatedDebugFileTree');
  ensureMethodReturnsTree('_generateMinifiedCompiledSourceTree');

  describe('enumeratePackages', function() {
    it('returns a proper tree', function() {
      var emberBuild = new EmberBuild({
        packages: {
          container: {
            trees:              null,
            requirements:       [],
            vendorRequirements: []
          }
        }
      });

      var actual = emberBuild._enumeratePackages();

      expect(actual.testTree).to.be.ok();
      expect(actual.vendorTrees).to.be.ok();
      expect(actual.devSourceTrees).to.be.ok();
      expect(actual.compiledPackageTrees).to.be.ok();
      expect(actual.testingSourceTrees).to.be.ok();
      expect(actual.prodSourceTrees).to.be.ok();
    });

    it('memoizes the build tree', function() {
      var emberBuild = new EmberBuild();

      emberBuild._trees = {
        buildTree: {
          foo: 'bar'
        }
      };

      var actual = emberBuild._enumeratePackages();

      expect(actual).to.deep.equal({
        foo: 'bar'
      });
    });
  });

  describe('getDistTrees', function() {
    var count = 0;
    var emberBuild;
    var originalPrototype = EmberBuild.prototype;

    function countFunction() {
      count++;
    }

    before(function() {
      count = 0;

      EmberBuild.prototype._getBowerTree                      = countFunction;
      EmberBuild.prototype._getTestConfigTree                 = countFunction;
      EmberBuild.prototype._buildCJSTree                      = countFunction;
      EmberBuild.prototype._generateCompiledSourceTree        = countFunction;
      EmberBuild.prototype._generateCompiledTestsTree         = countFunction;
      EmberBuild.prototype._generateTestingCompiledSourceTree = countFunction;

      emberBuild = new EmberBuild({
        packages: {
          'container': {},
          'ember-metal': {},
          'ember-template-compiler': {}
        }
      });
    });

    after(function() {
      EmberBuild.prototype = originalPrototype;
      emberBuild = null;
    });

    it('development tree is built up properly', function() {
      emberBuild.getDistTrees();

      expect(count).to.equal(6);
    });

    it('production tree is build up properly', function() {
      EmberBuild.prototype._getS3TestRunner                    = countFunction;
      EmberBuild.prototype._buildRuntimeTree                   = countFunction;
      EmberBuild.prototype._generateProdCompiledTestsTree      = countFunction;
      EmberBuild.prototype._generateProdCompiledSourceTree     = countFunction;
      EmberBuild.prototype._generateDeprecatedDebugFileTree    = countFunction;
      EmberBuild.prototype._generateMinifiedCompiledSourceTree = countFunction;

      emberBuild.getDistTrees();

      expect(count).to.equal(12);
    });
  });
});
