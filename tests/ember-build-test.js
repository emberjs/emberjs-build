'use strict';

var chai     = require('chai');
var expect   = chai.expect;

var EmberBuild              = require('../lib/ember-build');
var ensureMethodReturnsTree = require('./helpers/ensure-method-returns-tree');

describe('ember-build', function() {
  it('exists and is a function', function() {
    expect(EmberBuild).to.be.ok;
    expect(typeof EmberBuild === 'function').to.be.true;
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

      expect(actual.testTree).to.be.ok;
      expect(actual.devSourceTrees).to.be.ok;
      expect(actual.testingSourceTrees).to.be.ok;
      expect(actual.prodSourceTrees).to.be.ok;
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
    var EmberBuildStubbedSubclass;

    function countCalls(target, name) {
      target[name] = function() {
        count++;
        return EmberBuild.prototype[name].apply(this, arguments);
      };
    }

    before(function() {
      count = 0;

      EmberBuildStubbedSubclass = EmberBuild.extend();

      countCalls(EmberBuildStubbedSubclass.prototype, '_getBowerTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_getTestConfigTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_generateCompiledSourceTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_generateCompiledTestsTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_generateTestingCompiledSourceTree');

      emberBuild = new EmberBuildStubbedSubclass({
        packages: {
          'container': {},
          'ember-metal': {},
          'ember-environment': { skipTests: true },
          'ember-console': { skipTests: true },
          'ember-runtime': { vendorRequirements: [], requirements: []},
          'ember-debug': {},
          'ember-template-compiler': {},
          'ember-htmlbars-template-compiler': {}
        }
      });
    });

    after(function() {
      emberBuild = null;
    });

    it('development tree is built up properly', function() {
      emberBuild.getDistTrees();

      expect(count).to.equal(5);
    });

    it('production tree is build up properly', function() {
      countCalls(EmberBuildStubbedSubclass.prototype, '_getS3TestRunner');
      countCalls(EmberBuildStubbedSubclass.prototype, '_buildRuntimeTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_generateProdCompiledTestsTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_generateProdCompiledSourceTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_generateDeprecatedDebugFileTree');
      countCalls(EmberBuildStubbedSubclass.prototype, '_generateMinifiedCompiledSourceTree');

      emberBuild.getDistTrees();

      expect(count).to.equal(11);
    });
  });
});
