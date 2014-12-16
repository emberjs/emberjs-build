'use strict';

var util             = require('util');
var concat           = require('broccoli-concat');
var writeFile        = require('broccoli-file-creator');
var es3recast        = require('broccoli-es3-safe-recast');
var derequire        = require('broccoli-derequire');
var mergeTrees       = require('broccoli-merge-trees');
var defeatureify     = require('broccoli-defeatureify');
var transpileES6     = require('broccoli-es6-module-transpiler');
var useStrictRemover = require('broccoli-use-strict-remover');

var config              = require('./build-config');
var defeatureifyConfig  = require('./defeatureify-config');
var getVendoredPackages = require('./get-vendored-packages');

var disableES3          = config.disableES3;
var disableDerequire    = config.disableDerequire;
var vendoredPackages    = getVendoredPackages();
var disableDefeatureify = config.disableDefeatureify;

var iifeStart = writeFile('iife-start', '(function() {');
var iifeStop  = writeFile('iife-stop', '})();');

/*
  Responsible for concatenating ES6 modules together wrapped in loader and iife
  (immediately-invoked function expression)
*/
module.exports = function concatES6(inputTrees, options) {
  // see vendoredPackage
  var loader = vendoredPackages['loader'];
  var inputFiles = options.inputFiles;
  var destFile = options.destFile;
  var sourceTrees;

  // if given an array of trees merge into single tree
  if (util.isArray(inputTrees)) {
    sourceTrees = mergeTrees(inputTrees, {overwrite: true});
  } else {
    sourceTrees = inputTrees;
  }

  sourceTrees = transpileES6(sourceTrees, {
    moduleName: true
  });

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
  if (options.es3Safe && !disableES3) {
    sourceTrees = es3recast(sourceTrees);
  }

  // see defeatureify
  if (!disableDefeatureify) {
    sourceTrees = defeatureify(sourceTrees, defeatureifyConfig(options.defeatureifyOptions));
  }

  var concatTrees = [loader, 'generators', iifeStart, iifeStop, sourceTrees];
  if (options.includeLoader) {
    inputFiles.unshift('loader.js');
  }

  if (options.bootstrapModule) {
    var bootstrapTree = writeFile('bootstrap', 'requireModule("' + options.bootstrapModule + '");\n');
    concatTrees.push(bootstrapTree);
    inputFiles.push('bootstrap');
  }

  // do not modify inputFiles after here (otherwise IIFE will be messed up)
  if (!options.wrapInIIFE) {
    inputFiles.unshift('iife-start');
    inputFiles.push('iife-stop');
  }

  if (!options.includeLicense) {
    inputFiles.unshift('license.js');
  }

  if (options.vendorTrees) {
    concatTrees.push(options.vendorTrees);
  }

  // concats the local `concatTrees` variable see concat options here:
  // https://github.com/rlivsey/broccoli-concat/blob/master/README.md
  var concattedES6 = concat(mergeTrees(concatTrees), {
    wrapInEval: options.wrapInEval,
    inputFiles: inputFiles,
    outputFile: destFile
  });

  if (options.derequire && !disableDerequire) {
     concattedES6 =  derequire(concattedES6);
  }

  return concattedES6;
};
