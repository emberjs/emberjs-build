'use strict';

var Funnel           = require('broccoli-funnel');
var uglifyJavaScript = require('broccoli-uglify-js');

module.exports = function minifySourceTree(tree, options) {
  if (!tree) {
    throw new Error('Tree must be defined');
  }

  var minifiedTree = new Funnel(tree, {
    files:    [options.srcFile],
    destFile: options.destFile
  });

  return uglifyJavaScript(minifiedTree, {
    mangle:   options.mangle,
    compress: options.compress
  });
};
