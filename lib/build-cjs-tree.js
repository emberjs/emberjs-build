'use strict';

var concat     = require('broccoli-concat');
var writeFile  = require('broccoli-file-creator');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function buildCJSTree(compiledSourceTree) {
  var exportsTree = writeFile('export-ember', ';module.exports = Ember;\n');

  return concat(mergeTrees([compiledSourceTree, exportsTree]), {
    wrapInEval: false,
    inputFiles: ['ember.debug.js', 'export-ember'],
    outputFile: '/ember.debug.cjs.js'
  });
};
