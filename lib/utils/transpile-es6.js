'use strict';

var transpileES6   = require('broccoli-babel-transpiler');
var assign = require('lodash/object/assign');
var config = require('../config/build-config');
var conditionalUseStrict = require('./conditional-use-strict-babel-plugin');
var enifedFormatter = require('./babel-enifed-module-formatter');

// thanks to @chadhietala in amd-name-resolver
function moduleResolver(child, name) {
  if (child.charAt(0) !== '.') { return child; }

  var parts = child.split('/');
  var nameParts = name.split('/');
  var parentBase = nameParts.slice(0, -1);

  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i];

    if (part === '..') {
      if (parentBase.length === 0) {
        // this is tweaked from amd-name-resolver (it throws there)
        continue;
      }
      parentBase.pop();
    } else if (part === '.') {

      continue;
    } else { parentBase.push(part); }
  }

  return parentBase.join('/');
}

module.exports = function(tree, description, _options) {
  var options = assign({
    loose: true,
    moduleId: true,
    modules: 'amdStrict',
    avoidDefine: true,
    // until we fix them, we should just turn of high fedility sourcemaps
    sourceMaps: false, //config.disableSourceMaps ? false : 'inline',
    nonStandard: false,
    resolveModuleSource: moduleResolver,
    whitelist: [
      'es6.templateLiterals',
      'es6.arrowFunctions',
      'es6.destructuring',
      'es6.spread',
      'es6.parameters',
      'es6.properties.computed',
      'es6.properties.shorthand',
      'es6.blockScoping',
      'es6.constants',
      'es6.modules',
      'es6.classes',
      'spec.protoToAssign'
    ]
  }, _options);

  if (!options.plugins) {
    options.plugins = [];
  } else {
    // avoid sharing the plugins list
    options.plugins = options.plugins.slice();
  }

  options.plugins.push(conditionalUseStrict);
  if (options.avoidDefine) {
    options.plugins.push({ transformer: enifedFormatter, position: 'after' });
  }

  delete options.avoidDefine;

  var outputTree = transpileES6(tree, options);
  if (description) {
    outputTree.description = description;
  }

  return outputTree;
};
