'use strict';

var JSCS = require('broccoli-jscs');
var debug = require('./utils/debug-tree');
var jsStringEscape = require('js-string-escape');

// required until https://github.com/kellyselden/broccoli-jscs/pull/16 lands
JSCS.prototype.escapeErrorString = jsStringEscape;

module.exports = function(tree, options) {
  var jscsTree = new JSCS(tree, options);

  return debug(jscsTree, 'jscs');
};
