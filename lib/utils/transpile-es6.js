'use strict';

var esperanto = require('esperanto');
var map = require('broccoli-stew').map;
var babel = require('babel-core');

module.exports = function(tree, description) {
  var moduleNames = {};

  var outputTree = map(tree, '**/*.js', function(content, relativePath) {
    var moduleName = moduleNames[relativePath];

    if (!moduleName) {
      moduleName = moduleNames[relativePath] = relativePath.slice(0, -3);
    }

    content = babel.transform(content, {
      whitelist: [
        'es6.templateLiterals',
        'es6.parameters.rest',
        'es6.arrowFunctions',
        'es6.destructuring',
        'es6.spread',
        'es6.parameters.default',
        'es6.properties.shorthand'
      ]
    }).code;

    return esperanto.toAmd(content, {
      amdName: moduleName,
      strict: true,
      _evilES3SafeReExports: true
      //sourceMap: 'inline',
      //sourceMapSource: relativePath,
      //sourceMapFile: moduleName + '.map'
    }).code;

  });

  outputTree.description = 'ES6 Modules' + (description ? ': ' + description : '');

  return outputTree;
};
