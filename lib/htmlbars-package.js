'use strict';

var Funnel       = require('broccoli-funnel');
var transpileES6 = require('./utils/transpile-es6');

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

  return transpileES6(tree);
};
