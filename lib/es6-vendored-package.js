'use strict';

var es3recast        = require('broccoli-es3-safe-recast');
var pickFiles        = require('broccoli-static-compiler');
var transpileES6     = require('broccoli-es6-module-transpiler');
var useStrictRemover = require('broccoli-use-strict-remover');
var buildConfig      = require('./build-config');

/*
  Relies on `bower` to install other Ember microlibs `#{packageName}`.
  Assumes that `/lib` is available and contains all the necessary ES6
  modules for the library to be required.

  Transpiles them.

  This method is used for:
    + `backburner`
    + `rsvp`
    + `jquery`
    + `dag-map`
    + `router.js`
    + `router-recognizer`
    + `handlebars`
    + `qunit`
    + `qunit-phantom-runner`
*/
module.exports = function vendoredES6Package(packageName, opts) {
  var options = opts || {};

  var tree = pickFiles(options.libPath || 'bower_components/' + packageName + '/lib', {
    srcDir:  '/',
    destDir: '/'
  });

  var sourceTree = transpileES6(tree, {
    moduleName: true
  });

  if (!buildConfig.isDevelopment && !buildConfig.disableES3) {
    sourceTree = es3recast(sourceTree);
  }

  sourceTree = useStrictRemover(sourceTree);

  return sourceTree;
};
