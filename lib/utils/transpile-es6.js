'use strict';

var transpileES6   = require('broccoli-babel-transpiler');
var assign = require('lodash/object/assign');
var config = require('../config/build-config');
var conditionalUseStrict = require('./conditional-use-strict-babel-plugin');
var enifedFormatter = require('./babel-enifed-module-formatter');
var resolveModules = require('amd-name-resolver').resolveModules;
var moduleResolver = resolveModules({ throwOnRootAccess: false });
var stringify  = require('json-stable-stringify');
var crypto     = require('crypto');

module.exports = function(tree, description, _options) {
  var options = assign({
    loose: true,
    moduleId: true,
    modules: 'amdStrict',
    avoidDefine: true,
    sourceMaps: config.disableSourceMaps ? false : 'inline',
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
  // override default optionsHash until we can land
  // https://github.com/babel/broccoli-babel-transpiler/pull/89
  outputTree.optionsHash = function() {
    var options = this.options;
    var hash = {};
    var key, value;

    if (!this._optionsHash) {
      for (key in options) {
        value = options[key];
        hash[key] = (typeof value === 'function') ? (value + '') : value;
      }

      if (options.plugins) {
        hash.plugins = [];

        for (var i = 0; i < options.plugins.length; i++) {
          var plugin = options.plugins[i];

          // do not look for `._augmentCacheKey` on string plugins
          var pluginType = typeof plugin;
          if (pluginType === 'string') {
            hash.plugins.push(plugin);
          } else if (pluginType === 'object' && typeof plugin._augmentCacheKey === 'function') {
            hash.plugins.push(plugin._augmentCacheKey());
          }
        }
      }

      this._optionsHash = crypto.createHash('md5').update(stringify(hash), 'utf8').digest('hex');
    }

    return this._optionsHash;
  };

  if (description) {
    outputTree.description = description;
  }

  return outputTree;
};
