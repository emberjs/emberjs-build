'use strict';

var chai   = require('chai');
var expect = chai.expect;

var EmberBuild = require('../../lib/ember-build');

module.exports = function ensureMethodReturnsTree(methodName) {
  describe(methodName, function() {
    this.timeout(5000);

    var emberBuild = new EmberBuild({
      version: 'foo',
      features: { development: {}, production: {} }
    });

    before(function() {
      emberBuild._trees.prodCompiledSource = {};
      emberBuild._vendoredPackages = {
        loader: {}
      };
    });

    after(function() {
      emberBuild._trees.prodCompiledSource = null;
      emberBuild._vendoredPackages = null;
    });

    it('should return a tree to prevent build failures', function() {
      var actual = emberBuild[methodName]();

      expect(actual).to.be.ok;
      expect(actual.read).to.be.ok;
    });
  });
};
