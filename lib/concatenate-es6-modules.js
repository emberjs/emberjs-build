'use strict';

var merge            = require('lodash-node/modern/objects/merge');
var util             = require('util');
var concat           = require('broccoli-sourcemap-concat');
var writeFile        = require('broccoli-file-creator');
var mergeTrees       = require('broccoli-merge-trees');
var transpileES6     = require('./utils/transpile-es6');

var debug               = require('./utils/debug-tree');
var getVendoredPackages = require('./get-vendored-packages');

var defaultOptions = {
  inputFiles: ['**/*.js'],
  generators: 'generators',
  wrapInIIFE: true
};

/*
  Responsible for concatenating ES6 modules together wrapped in loader and iife
  (immediately-invoked function expression)
*/
module.exports = function concatenateES6Modules(inputTrees, _options) {
  var options = merge({}, defaultOptions, _options || {});
  var vendoredPackages  = options.vendoredPackages || getVendoredPackages();
  var loader        = _options.loader || vendoredPackages['loader'];
  var inputFiles    = options.inputFiles;
  var headerFiles   = [];
  var footerFiles   = [];
  var destFile      = options.destFile;

  var sourceTrees;

  // if given an array of trees merge into single tree
  if (util.isArray(inputTrees)) {
    sourceTrees = mergeTrees(inputTrees, {overwrite: true});
  } else {
    sourceTrees = inputTrees;
  }

  sourceTrees = transpileES6(sourceTrees, options.description, {
    plugins: options.babel ? options.babel.plugins : []
  });

  if (!loader) {
    throw new TypeError('vendoredPackages.loader not found, it is not optional');
  }
  var concatTrees = [
    loader,
    options.generators,
    sourceTrees
  ];

  if (!options.includeLicense) { headerFiles.push('license.js'); }
  if (options.includeLoader)   { headerFiles.push('loader.js'); }

  if (options.bootstrapModule) {
    options.bootstrapModules = [options.bootstrapModule];
  }

  if (options.bootstrapModules) {
    var contents = options.bootstrapModules.map(function(module) {
      return 'requireModule("' + module + '");';
    })
    .join('\n');

    var bootstrapTree = writeFile('bootstrap', contents + '\n');

    concatTrees.push(bootstrapTree);
    footerFiles.push('bootstrap');
  }

  if (options.vendorTrees) {
    concatTrees.push(options.vendorTrees);
  }

  return concat(debug(mergeTrees(concatTrees), 'concatted-es6' + destFile), {
    sourceMapConfig: {
      enabled: !!options.enableSourceMaps
    },
    header: options.wrapInIIFE && ';(function() {',
    headerFiles: headerFiles,
    inputFiles: inputFiles,
    footerFiles: footerFiles,
    footer: options.wrapInIIFE && '}());',
    outputFile: destFile,
    allowNone: true,
    description: 'Concat ES6: ' + destFile
  });
};
