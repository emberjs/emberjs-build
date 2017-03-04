'use strict';

var Babel   = require('broccoli-babel-transpiler');
var assign = require('lodash/object/assign');
var config = require('../config/build-config');
var enifedFormatter = require('./babel-enifed-module-formatter');
var stripClassCallCheck = require('./babel-strip-class-call-check');
var resolveModules = require('amd-name-resolver').resolveModules;
var moduleResolver = resolveModules({ throwOnRootAccess: false });

module.exports = function(tree, description, _options) {
  var options = assign({
    moduleId: true,
    avoidDefine: true,
    sourceMaps: config.disableSourceMaps ? false : 'inline',
    resolveModuleSource: moduleResolver,
    plugins: [
      ['transform-es2015-template-literals', {loose: true}],
      ['transform-es2015-arrow-functions'],
      ['transform-es2015-destructuring', {loose: true}],
      ['transform-es2015-spread', {loose: true}],
      ['transform-es2015-parameters'],
      ['transform-es2015-computed-properties', {loose: true}],
      ['transform-es2015-shorthand-properties'],
      ['transform-es2015-block-scoping'],
      ['check-es2015-constants'],
      ['transform-es2015-modules-amd', {loose: true}],
      ['transform-es2015-classes', {loose: true}],
      ['transform-proto-to-assign']
    ],
    helperWhiteList: [
      'tagged-template-literal-loose',
      'slice',
      'defaults',
      'createClass',
      'classCallCheck',
      'interop-export-wildcard',
      'inherits',
      'interopRequireDefault'
    ]
  }, _options);

  if (!options.plugins) {
    options.plugins = [];
  } else {
    // avoid sharing the plugins list
    options.plugins = options.plugins.slice();
  }

  if (options.avoidDefine) {
    options.plugins.push([enifedFormatter, {position: 'after'}]);
  }

  if (options.stripRuntimeChecks && options.helperWhiteList.indexOf('class-call-check') > -1) {
    options.plugins.push([stripClassCallCheck]);
  }

  delete options.stripRuntimeChecks;
  delete options.avoidDefine;

  var babel = new Babel(tree, options);

  babel._annotation = description;

  return babel;
};
