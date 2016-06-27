'use strict';

var JSCS = require('broccoli-jscs');
var debug = require('./utils/debug-tree');

module.exports = function(tree, options) {
  var jscsTree = new JSCS(tree, options);

  return debug(jscsTree, 'jscs');
};
