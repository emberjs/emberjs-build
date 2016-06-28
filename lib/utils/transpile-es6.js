'use strict';

var transpileES6   = require('broccoli-babel-transpiler');
var assign = require('lodash/object/assign');
var config = require('../config/build-config');
var conditionalUseStrict = require('./conditional-use-strict-babel-plugin');
var enifedFormatter = require('./babel-enifed-module-formatter');
var resolveModules = require('amd-name-resolver').resolveModules;
var moduleResolver = resolveModules({ throwOnRootAccess: false });

module.exports = function(tree, description, _options) {
  var options = assign({
    passPerPreset: true,
    moduleIds: true,
    avoidDefine: true,
    sourceMaps: config.disableSourceMaps ? false : 'inline',
    resolveModuleSource: moduleResolver,
    firstPass: [
      ['transform-es2015-template-literals', {loose: true}],
      ['transform-es2015-arrow-functions'],
      ['transform-es2015-destructuring', {loose: true}],
      ['transform-es2015-spread', {loose: true}],
      ['transform-es2015-parameters'],
      ['transform-es2015-computed-properties', {loose: true}],
      ['transform-es2015-shorthand-properties'],
      ['transform-es2015-block-scoping'],
      ['check-es2015-constants'],
      ['transform-es2015-classes', {loose: true}],
    ],
    secondPass:[
      ['transform-proto-to-assign'],
    ],
    thirdPass:[],
  }, _options);

  if (!options.plugins) {
    options.plugins = [];
  } else {
    // avoid sharing the plugins list
    options.plugins = options.plugins.slice();
  }

  options.secondPass.push(['transform-es2015-modules-amd', {strict: false}]);
  options.firstPass.push(conditionalUseStrict);
  if (options.avoidDefine) {
    // `enifedFormatter` is added as a preset with `passPerPreset: true`
    // so that it runs *after* `transform-es2015-modules-amd`
    options.thirdPass.push(enifedFormatter);
    delete options.avoidDefine;
  }

  if (!options.presets) {
    options.presets = [];
  }

  options.presets.push({
    plugins: options.firstPass,
  });

  options.presets.push({
    plugins: options.secondPass,
  });

  if (options.thirdPass.length !== 0) {
    options.presets.push({
      plugins: options.thirdPass,
    });
  }

  delete options.firstPass;
  delete options.secondPass;
  delete options.thirdPass;

  var outputTree = transpileES6(tree, options);
  if (description) {
    outputTree.description = description;
  }

  return outputTree;
};
