'use strict';

var chai   = require('chai');
var expect = chai.expect;

var minifySourceTree = require('../lib/minify-source-tree');

describe('minifySourceTree', function() {
  it('throws an exception if passed in tree is undefined or null', function() {
    expect(function() {
      minifySourceTree();
    }).to.throw(/Tree must be defined/);

    expect(function() {
      minifySourceTree(null);
    }).to.throw(/Tree must be defined/);
  });
});

