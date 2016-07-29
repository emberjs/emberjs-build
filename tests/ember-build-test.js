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
        version: 'foo',
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
      var emberBuild = new EmberBuild({
        version: 'foo'
      });

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
});
