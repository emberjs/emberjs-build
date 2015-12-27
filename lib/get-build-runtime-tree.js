'use strict';

var concat     = require('broccoli-concat');
var writeFile  = require('broccoli-file-creator');
var mergeTrees = require('broccoli-merge-trees');

var es6Package            = require('./get-es6-package');
var getVendoredPackages   = require('./get-vendored-packages');
var concatenateES6Modules = require('./concatenate-es6-modules');
var replaceFeatures       = require('./replace-features');

/*
  Resolves dependencies for ember-runtime and compiles / concats them to /ember-runtime.js

  Dependency graph looks like this:
  ```
    'ember-runtime': {vendorRequirements: ['rsvp'], requirements: ['container', 'ember-metal']}
  ```
*/
module.exports = function buildRuntimeTree(packages, _vendoredPackages, _options) {
  var options = _options || {};
  var vendoredPackages = _vendoredPackages || getVendoredPackages();
  es6Package(packages, 'ember-runtime');

  var runtimeTrees = [packages['ember-runtime'].trees.lib];
  var runtimeVendorTrees = packages['ember-runtime'].vendorRequirements.map(function(req){ return vendoredPackages[req];});

  packages['ember-runtime'].requirements.forEach(function(req){
    es6Package(packages, req);
    runtimeTrees.push(packages[req].trees.lib);
    (packages[req].vendorRequirements || []).forEach(function(vreq) {
      runtimeVendorTrees.push(vendoredPackages[vreq]);
    });
  });

  var mergedRuntimeTree = replaceFeatures(mergeTrees(runtimeTrees), {
    files: [ 'ember-metal/features.js' ]
  });

  var compiledRuntime = concatenateES6Modules(mergedRuntimeTree, {
    babel: options.babel,
    enableSourceMaps: options.enableSourceMaps,
    includeLoader: true,
    bootstrapModule: 'ember-runtime',
    vendorTrees: mergeTrees(runtimeVendorTrees),
    destFile: '/ember-runtime.js'
  });

  var exportsTree = writeFile('export-ember', ';module.exports = Ember;\n');

  return concat(mergeTrees([compiledRuntime, exportsTree]), {
    sourcemap: { enabled: options.enableSourceMaps },
    wrapInEval: false,
    inputFiles: ['ember-runtime.js', 'export-ember'],
    outputFile: '/ember-runtime.js'
  });
};
