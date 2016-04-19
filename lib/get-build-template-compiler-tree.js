'use strict';

var mergeTrees = require('broccoli-merge-trees');

var es6Package            = require('./get-es6-package');
var replaceFeatures       = require('./replace-features');
var getVendoredPackages   = require('./get-vendored-packages');
var concatenateES6Modules = require('./concatenate-es6-modules');

/*
  Resolves dependencies for ember-template-compiler and compiles / concats them to /ember-template-compiler.js

  Dependency graph looks like this:
  ```
    'ember-template-compiler':    {trees: null,  templateCompilerVendor: ['simple-html-tokenizer', 'htmlbars-util', 'htmlbars-compiler', 'htmlbars-syntax', 'htmlbars-test-helpers']},
  ```
*/
module.exports = function buildTemplateCompilerTree(packages, _vendoredPackages, options) {
  var vendoredPackages = _vendoredPackages || getVendoredPackages();

  es6Package(packages, 'ember-environment');
  es6Package(packages, 'ember-metal');
  es6Package(packages, 'ember-debug');
  es6Package(packages, 'ember-template-compiler');

  var trees = [packages['ember-template-compiler'].trees.lib, packages['ember-debug'].trees.lib, packages['ember-environment'].trees.lib];
  var templateCompilerVendor = packages['ember-template-compiler'].templateCompilerVendor || [];
  var vendorTrees = templateCompilerVendor.map(function(req){ return vendoredPackages[req];});

  var metal = replaceFeatures(packages['ember-metal'].trees.lib, {
    files: [ 'ember-metal/features.js' ]
  });

  trees.push(metal);

  return concatenateES6Modules(trees, {
    enableSourceMaps: options.enableSourceMaps,
    babel: options.babel,
    includeLoader: true,
    bootstrapModules: ['ember-environment', 'ember-debug'],
    moduleExport: 'ember-template-compiler',
    vendorTrees: mergeTrees(vendorTrees, {overwrite: true}),
    vendoredPackages: vendoredPackages,
    destFile: '/ember-template-compiler.js'
  });
};
