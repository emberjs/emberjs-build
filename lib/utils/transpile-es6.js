'use strict';

var transpileES6   = require('broccoli-babel-transpiler');
var assign = require('lodash-node/modern/objects/assign');

module.exports = function(tree, description, options) {
  var outputTree = transpileES6(tree, assign({
    loose: true,
    moduleId: true,
    modules: 'amdStrict',
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
  }, options));

  if (description) {
    outputTree.description = description;
  }

  return outputTree;
};

