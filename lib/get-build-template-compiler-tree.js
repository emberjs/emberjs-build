'use strict';

var mergeTrees = require('broccoli-merge-trees');

var es6Package            = require('./get-es6-package');
var getVendoredPackages   = require('./get-vendored-packages');
var concatenateES6Modules = require('./concatenate-es6-modules');
var createEmberVersion    = require('./create-ember-version');
var compileEmberFeatures  = require('./compile-ember-features');
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
  es6Package(packages, 'ember-console');
  es6Package(packages, 'ember-metal');
  es6Package(packages, 'ember-debug');
  es6Package(packages, 'ember-template-compiler');
  es6Package(packages, 'ember-htmlbars-template-compiler');
  es6Package(packages, 'ember-templates');

  var trees = [
    packages['ember-template-compiler'].trees.lib,
    packages['ember-debug'].trees.lib,
    packages['ember-console'].trees.lib,
    packages['ember-environment'].trees.lib,
    packages['ember-templates'].trees.lib,
    packages['ember-htmlbars-template-compiler'].trees.lib,
    createEmberVersion(),
    compileEmberFeatures()
  ];

  var templateCompilerVendor = packages['ember-template-compiler'].templateCompilerVendor || [];

  templateCompilerVendor = templateCompilerVendor.concat(packages['ember-htmlbars-template-compiler'].templateCompilerVendor || []);

  if (packages['ember-glimmer-template-compiler']) {
    es6Package(packages, 'ember-glimmer-template-compiler');
    trees.push(packages['ember-glimmer-template-compiler'].trees.lib);
    templateCompilerVendor = templateCompilerVendor.concat(packages['ember-glimmer-template-compiler'].templateCompilerVendor);
  }

  var vendorTrees = templateCompilerVendor.map(function(req){ return vendoredPackages[req];});

  trees.push(packages['ember-metal'].trees.lib);

  return concatenateES6Modules(trees, {
    enableSourceMaps: options.enableSourceMaps,
    babel: options.babel,
    includeLoader: true,
    bootstrapModules: ['ember-environment', 'ember-console', 'ember-debug'],
    moduleExport: 'ember-template-compiler',
    vendorTrees: mergeTrees(vendorTrees, {overwrite: true}),
    vendoredPackages: vendoredPackages,
    destFile: '/ember-template-compiler.js'
  });
};
