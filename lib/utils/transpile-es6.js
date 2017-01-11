'use strict';

var Babel   = require('broccoli-babel-transpiler');
var assign = require('lodash/object/assign');
var config = require('../config/build-config');
var conditionalUseStrict = require('./conditional-use-strict-babel-plugin');
var enifedFormatter = require('./babel-enifed-module-formatter');
var stripClassCallCheck = require('./babel-strip-class-call-check');
var resolveModules = require('amd-name-resolver').resolveModules;
var moduleResolver = resolveModules({ throwOnRootAccess: false });

module.exports = function(tree, description, _options) {
  var options = assign({
    loose: true,
    moduleId: true,
    modules: 'amdStrict',
    avoidDefine: true,
    sourceMaps: config.disableSourceMaps ? false : 'inline',
    nonStandard: false,
    resolveModuleSource: moduleResolver,
    externalHelpers: true,
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
      'spec.protoToAssign',
      'es6.forOf'
    ],
    helperWhiteList: [
      'tagged-template-literal-loose',
      'slice',
      'defaults',
      'create-class',
      'class-call-check',
      'interop-export-wildcard',
      'inherits'
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

  if (options.stripRuntimeChecks && options.helperWhiteList.indexOf('class-call-check') > -1) {
    options.plugins.push({ transformer: stripClassCallCheck, position: 'after' });
  }

  delete options.stripRuntimeChecks;
  delete options.avoidDefine;

  var babel = new Babel(tree, options);

  babel._annotation = description;

  return babel;
};
