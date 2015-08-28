'use strict';

var merge            = require('lodash-node/modern/objects/merge');
var util             = require('util');
var concat           = require('broccoli-sourcemap-concat');
var writeFile        = require('broccoli-file-creator');
var derequire        = require('broccoli-derequire');
var mergeTrees       = require('broccoli-merge-trees');
var transpileES6     = require('./utils/transpile-es6');

var debug               = require('./utils/debug-tree');
var buildConfig         = require('./config/build-config');
var getVendoredPackages = require('./get-vendored-packages');

var disableDerequire    = buildConfig.disableDerequire;

var iifeStart = writeFile('iife-start', '(function() {');
var iifeStop  = writeFile('iife-stop', '})();');

var defaultOptions = {
  derequire:  !buildConfig.isDevelopment,
  inputFiles: ['**/*.js'],
  generators: 'generators'
};

/*
  Responsible for concatenating ES6 modules together wrapped in loader and iife
  (immediately-invoked function expression)
*/
module.exports = function concatenateES6Modules(inputTrees, options) {
  var mergedOptions = merge({}, defaultOptions, options || {});
  var vendoredPackages  = mergedOptions.vendoredPackages || getVendoredPackages();
  var loader        = options.loader || vendoredPackages['loader'];
  var inputFiles    = mergedOptions.inputFiles;
  var destFile      = mergedOptions.destFile;

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

  var concatTrees = [loader, mergedOptions.generators, iifeStart, iifeStop, sourceTrees];
  if (mergedOptions.includeLoader) {
    inputFiles.unshift('loader.js');
  }

  if (mergedOptions.bootstrapModule) {
    mergedOptions.bootstrapModules = [mergedOptions.bootstrapModule];
  }

  if (mergedOptions.bootstrapModules) {
    var contents = mergedOptions.bootstrapModules.map(function(module) {
      return 'requireModule("' + module + '");';
    })
    .join('\n');

    var bootstrapTree = writeFile('bootstrap', contents + '\n');
    concatTrees.push(bootstrapTree);
    inputFiles.push('bootstrap');
  }

  // do not modify inputFiles after here (otherwise IIFE will be messed up)
  if (!mergedOptions.wrapInIIFE) {
    inputFiles.unshift('iife-start');
    inputFiles.push('iife-stop');
  }

  if (!mergedOptions.includeLicense) {
    inputFiles.unshift('license.js');
  }

  if (mergedOptions.vendorTrees) {
    concatTrees.push(mergedOptions.vendorTrees);
  }

  var concattedES6 = concat(debug(mergeTrees(concatTrees), 'concatted-es6' + destFile), {
    sourceMapConfig: { enabled: !!options.enableSourceMaps },
    inputFiles: inputFiles,
    outputFile: destFile,
    allowNone: true,
    description: 'Concat ES6: ' + destFile
  });

  if (mergedOptions.derequire && !disableDerequire) {
    concattedES6 = derequire(concattedES6);
  }

  return concattedES6;
};
