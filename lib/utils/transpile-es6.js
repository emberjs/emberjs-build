'use strict';

var transpileES6   = require('broccoli-babel-transpiler');

module.exports = function(tree, description, options) {
  if (!options) {
    options = {};
  }

  var format = options.format || 'amdStrict';

  return transpileES6(tree, {
    loose: true,
    moduleId: true,
    modules: format,
    sourceMaps: 'inline',
    nonStandard: false,
    whitelist: [
      'es6.templateLiterals',
      'es6.parameters.rest',
      'es6.arrowFunctions',
      'es6.destructuring',
      'es6.spread',
      'es6.parameters.default',
      'es6.properties.computed',
      'es6.properties.shorthand',
      'es6.blockScoping',
      'es6.constants',
      'es6.modules'
    ]
  });
};
