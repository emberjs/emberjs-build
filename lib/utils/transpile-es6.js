'use strict';

var esperanto = require('esperanto');
var map = require('broccoli-stew').map;
var babel = require('babel-core');
var Cache = require('sync-disk-cache');
var crypto = require('crypto');

var SHOULD_CACHE = 'DISK_CACHE' in process.env;
var cache = new Cache('emberjs-build-es6');

if ('PURGE_DISK_CACHE' in process.env) {
  console.log('[purging] persistent es6 transpile cache');
  cache.clear();
}

if (SHOULD_CACHE) {
  console.log('[enabled] persistent es6 transpile cache');
}

module.exports = function(tree, description, options) {
  if (!options) {
    options = {};
  }

  var transpiler;
  var moduleNames = {};
  var format = options.format || 'amd';

  if (format === 'cjs') {
    transpiler = esperanto.toCjs;
  } else if (format === 'umd') {
    transpiler = esperanto.toUmd;
  } else {
    transpiler = esperanto.toAmd;
  }

  var outputTree = map(tree, '**/*.js', function(content, relativePath) {
    var moduleName = moduleNames[relativePath];

    if (!moduleName) {
      moduleName = moduleNames[relativePath] = relativePath.slice(0, -3);
    }

    var key;
    if (SHOULD_CACHE) {
      key = hash(content + 0x0 + moduleName);

      if (cache.has(key)) {
        return cache.get(key).value;
      }
    }

    content = babel.transform(content, {
      filename: relativePath,
      loose: true,
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
      ]
    }).code;

    content = transpiler(content, {
      amdName: moduleName,
      strict: true,
      _evilES3SafeReExports: true
      //sourceMap: 'inline',
      //sourceMapSource: relativePath,
      //sourceMapFile: moduleName + '.map'
    }).code;

    if (SHOULD_CACHE) {
      cache.set(key, content);
    }
    return content;
  });

  outputTree.description = 'ES6 Modules' + (description ? ': ' + description : '');
  return outputTree;
};

function hash(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}
