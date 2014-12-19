'use strict';

var chai   = require('chai');
var expect = chai.expect;

var EmberBuild = require('../../lib/ember-build');

module.exports = function ensureMethodReturnsTree(methodName) {
  describe(methodName, function() {
    var emberBuild = new EmberBuild();

    before(function() {
      emberBuild._trees.prodCompiledSource = {};
    });

    after(function() {
      emberBuild._trees.prodCompiledSource = null;
    });

    it('should return a tree to prevent build failures', function() {
      var actual = emberBuild[methodName]();

      expect(actual).to.be.ok();
      expect(actual.read).to.be.ok();
    });
  });
};
