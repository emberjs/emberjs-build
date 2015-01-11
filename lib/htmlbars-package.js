'use strict';

var pickFiles    = require('broccoli-static-compiler');
var es3recast    = require('broccoli-es3-safe-recast');
var transpileES6 = require('broccoli-es6-module-transpiler');
var buildConfig  = require('./config/build-config');

/*
  Returns a tree picked from `node_modules/htmlbars/dist/es6/#{packageName}.js`

  This method is used for:
    + `morph`
    + `htmlbars-compiler`
    + `simple-html-tokenizer`
    + `htmlbars-test-helpers`
    + `htmlbars-util`
*/
module.exports = function htmlbarsPackage(packageName, _options) {
  var options = _options || {};
  var fileGlobs = [];

  if (!options.singleFile) {
    fileGlobs.push(packageName + '/**/*.js');
  }

  if (!options.ignoreMain) {
    fileGlobs.push(packageName + '.js');
  }

  var tree = pickFiles(options.libPath || 'node_modules/htmlbars/dist/es6/', {
    files:   fileGlobs,
    srcDir:  '/',
    destDir: '/'
  });

  tree = transpileES6(tree, {
    moduleName: true
  });

  if (!buildConfig.isDevelopment && !buildConfig.disableES3) {
    tree = es3recast(tree);
  }

  return tree;
};
