'use strict';

var Funnel       = require('broccoli-funnel');
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
  var options  = _options || {};
  var includes = [];

  if (!options.singleFile) {
    includes.push(packageName + '/**/*.js');
  }

  if (!options.ignoreMain) {
    includes.push(packageName + '.js');
  }

  var tree = new Funnel(options.libPath || 'node_modules/htmlbars/dist/es6/', {
    include: includes,
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
