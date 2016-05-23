'use strict';

var Funnel       = require('broccoli-funnel');
var UglifyWriter = require('broccoli-uglify-sourcemap');

module.exports = function minifySourceTree(tree, options) {
  if (!tree) {
    throw new Error('Tree must be defined');
  }

  var srcFile = options.srcFile;
  var destFile = options.destFile;
  var files = [ srcFile ];
  var mapSrcFile = srcFile.slice(0, -2) + 'map';
  var mapDestFile = destFile.slice(0, -2) + 'map';
  if (options.enableSourceMaps) {
    files.push(mapSrcFile);
  }
  // because broccoli-uglify-sourcemap doesn't use persistent filter
  var reducedTree = new Funnel(tree, {
    annotation: 'reduce for minify',
    files: files
  });
  var minifiedTree = new UglifyWriter(reducedTree, {
    sourceMapConfig: {
      enabled: options.enableSourceMaps
    },
    negate_iife: options.negateIIFE,
    mangle:   options.mangle,
    compress: options.compress
  });
  return new Funnel(minifiedTree, {
    annotation: 'rename minified',
    files: files,
    getDestinationPath: function(relativePath) {
      if (relativePath === srcFile) {
        return destFile;
      }
      if (relativePath === mapSrcFile) {
        return mapDestFile;
      }
      return relativePath;
    }
  });
};
