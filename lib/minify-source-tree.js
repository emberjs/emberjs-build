'use strict';

var moveFile         = require('broccoli-file-mover');
var uglifyJavaScript = require('broccoli-uglify-js');

module.exports = function minifySourceTree(tree, options) {
  if (!tree) {
    throw new Error('Tree must be defined');
  }

  var minifiedTree = moveFile(tree, {
    srcFile:  options.srcFile,
    destFile: options.destFile
  });

  return uglifyJavaScript(minifiedTree, {
    mangle:   options.mangle,
    compress: options.compress
  });
};
