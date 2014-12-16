'use strict';

var broccoli = require('broccoli');

module.exports = function buildTree(tree) {
  if (!tree) {
    throw new Error('You must pass a tree.');
  }

  var builder = new broccoli.Builder(tree);

  return builder.build();
};
