'use strict';

var concat     = require('broccoli-sourcemap-concat');
var writeFile  = require('broccoli-file-creator');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function buildCJSTree(compiledSourceTree, opts) {
  var options = opts || {};
  var name = options.name || 'ember';
  var namespace = options.namespace || 'Ember';
  var exportsTree = writeFile('export-' + name, ';module.exports = ' + namespace + ';\n');

  return concat(mergeTrees([compiledSourceTree, exportsTree]), {
    wrapInEval: false,
    inputFiles: [name + '.debug.js', 'export-' + name],
    outputFile: '/' + name + '.debug.cjs.js'
  });
};
