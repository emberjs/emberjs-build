'use strict';

var merge            = require('lodash-node/modern/objects/merge');
var util             = require('util');
var concat           = require('broccoli-sourcemap-concat');
var writeFile        = require('broccoli-file-creator');
var es3recast        = require('broccoli-es3-safe-recast');
var derequire        = require('broccoli-derequire');
var mergeTrees       = require('broccoli-merge-trees');
var defeatureify     = require('broccoli-defeatureify');
var transpileES6     = require('./utils/transpile-es6');
var useStrictRemover = require('broccoli-use-strict-remover');

var debug               = require('./utils/debug-tree');
var buildConfig         = require('./config/build-config');
var defeatureifyConfig  = require('./config/defeatureify-config');
var getVendoredPackages = require('./get-vendored-packages');

var disableES3          = buildConfig.disableES3;
var disableDerequire    = buildConfig.disableDerequire;
var disableDefeatureify = buildConfig.disableDefeatureify;

var iifeStart = writeFile('iife-start', '(function() {');
var iifeStop  = writeFile('iife-stop', '})();');

var defaultOptions = {
  es3Safe:    !buildConfig.isDevelopment,
  derequire:  !buildConfig.isDevelopment,
  inputFiles: ['**/*.js'],
  generators: 'generators'
};

/*
  Responsible for concatenating ES6 modules together wrapped in loader and iife
  (immediately-invoked function expression)
*/
module.exports = function concatenateES6Modules(inputTrees, options) {
  var mergedOptions = merge(defaultOptions, options || {});
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

  sourceTrees = transpileES6(sourceTrees);

  sourceTrees = useStrictRemover(sourceTrees);

  /*
    In order to ensure that tree is compliant with older Javascript versions we
    recast these trees here.  For example, in ie6 the following would be an
    error:
    ```
     {default: "something"}.default
    ```
    However, in ECMA5 this is allowed.  es3recast will convert the above into:
    ```
     {default: "something"}['default']
    ```
   */
  if (mergedOptions.es3Safe && !disableES3) {
    sourceTrees = es3recast(sourceTrees);
  }

  // see defeatureify
  if (!disableDefeatureify) {
    sourceTrees = defeatureify(sourceTrees, defeatureifyConfig(mergedOptions.defeatureifyOptions));
  }

  var concatTrees = [loader, mergedOptions.generators, iifeStart, iifeStop, sourceTrees];
  if (mergedOptions.includeLoader) {
    inputFiles.unshift('loader.js');
  }

  if (mergedOptions.bootstrapModule) {
    var bootstrapTree = writeFile('bootstrap', 'requireModule("' + mergedOptions.bootstrapModule + '");\n');
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

  // concats the local `concatTrees` variable see concat options here:
  // https://github.com/rlivsey/broccoli-concat/blob/master/README.md
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
