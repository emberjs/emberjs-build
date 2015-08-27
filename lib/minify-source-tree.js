'use strict';

var Funnel           = require('broccoli-funnel');
var uglifyJavaScript = require('broccoli-uglify-sourcemap');

module.exports = function minifySourceTree(tree, options) {
  if (!tree) {
    throw new Error('Tree must be defined');
  }

  var inputFile = options.srcFile;
  var files = [ inputFile ];
  if (options.enableSourceMaps) {
    files.push(inputFile.slice(0, -2) + 'map');
  }

  var minifiedTree = new Funnel(tree, {
    files: files,

    getDestinationPath: function(relativePath) {
      if (relativePath === options.srcFile) {
        return options.destFile;
      } else {
        return relativePath;
      }
    }
  });

  return uglifyJavaScript(minifiedTree, {
    enabled: options.enableSourceMaps,
    mangle:   options.mangle,
    compress: options.compress
  });
};
