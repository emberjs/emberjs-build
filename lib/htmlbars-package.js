'use strict';

var pickFiles = require('broccoli-static-compiler');
var es3recast = require('broccoli-es3-safe-recast');
var transpileES6 = require('broccoli-es6-module-transpiler');

module.exports = function htmlbarsPackage(packageName, _options, isDevelopment, disableES3) {
  var options = _options || {};
  var fileGlobs = [];

  if (!options.singleFile) {
    fileGlobs.push(packageName + '/**/*.js');
  }

  if (!options.ignoreMain) {
    fileGlobs.push(packageName + '.js');
  }

  var tree = pickFiles(options.libPath || 'node_modules/htmlbars/dist/es6/', {
    files: fileGlobs,
    srcDir: '/',
    destDir: '/'
  });

  tree = transpileES6(tree, {
    moduleName: true
  });

  if (!isDevelopment && !disableES3) {
    tree = es3recast(tree);
  }

  return tree;
};
