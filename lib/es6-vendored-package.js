'use strict';

var Funnel           = require('broccoli-funnel');
var transpileES6     = require('./utils/transpile-es6');
var useStrictRemover = require('broccoli-use-strict-remover');

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
    + `qunit`
    + `qunit-phantom-runner`
*/
module.exports = function vendoredES6Package(packageName, opts) {
  var options = opts || {};

  var tree = new Funnel(options.libPath || 'bower_components/' + packageName + '/lib', {
    getDestinationPath: function(relativePath) {
      if (relativePath === 'main.js') {
        return packageName + '.js';
      }

      return relativePath;
    },
    destDir: '/'
  });

  return useStrictRemover(transpileES6(tree));
};
