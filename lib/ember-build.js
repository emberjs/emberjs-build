'use strict';

// TODO: Move line 3 to line 8 out of here
var concat           = require('broccoli-concat');
var replace          = require('broccoli-replace');
var getVersion       = require('git-repo-version');
var mergeTrees       = require('broccoli-merge-trees');
var yuidocPlugin     = require('ember-cli-yuidoc');

var es6Package             = require('./get-es6-package');
var buildConfig            = require('./build-config');
var getBowerTree           = require('./bower-tree');
var buildCJSTree           = require('./build-cjs-tree');
var getS3TestRunner        = require('./s3-test-runner');
var buildRuntimeTree       = require('./get-build-runtime-tree');
var minifySourceTree       = require('./minify-source-tree');
var getTestConfigTree      = require('./test-config-tree');
var getVendoredPackages    = require('./get-vendored-packages');
var getEmberDevTestHelpers = require('./ember-dev-test-helpers');
var concatenateES6Modules  = require('./concatenate-es6-modules');

var buildTemplateCompilerTree = require('./get-build-template-compiler-tree');

var vendoredPackages    = getVendoredPackages();
var emberDevTestHelpers = getEmberDevTestHelpers();

function EmberBuild(options) {
  this._init();

  if (options && options.packages) {
    this._packages      = options.packages;
    this._name          = options.name || 'ember';
    this._namespace     = options.namespace || 'Ember';
    this._skipRuntime   = options.skipRuntime;
    this._skipTemplates = options.skipTemplates;

    this._trees.distTrees = [
      this._generateCompiledSourceTree,
      this._generateCompiledTestsTree,
      this._generateTestingCompiledSourceTree,
      this._getTestConfigTree,
      this._getBowerTree,
    ];

    if (!this._skipTemplates) {
      this._trees.distTrees.push(this._buildTemplateCompilerTree);
    }

    this._trees.prodTrees = [
      this._generateDeprecatedDebugFileTree,
      this._getS3TestRunner,
      this._generateProdCompiledSourceTree,
      this._generateProdCompiledTestsTree
    ];
  }
}

EmberBuild.prototype._getBowerTree          = getBowerTree;
EmberBuild.prototype._buildCJSTree          = buildCJSTree;
EmberBuild.prototype._getS3TestRunner       = getS3TestRunner;
EmberBuild.prototype._buildRuntimeTree      = buildRuntimeTree;
EmberBuild.prototype._minifySourceTree      = minifySourceTree;
EmberBuild.prototype._getTestConfigTree     = getTestConfigTree;
EmberBuild.prototype._concatenateES6Modules = concatenateES6Modules;

EmberBuild.prototype._buildTemplateCompilerTree = buildTemplateCompilerTree;

EmberBuild.prototype._init = function init() {
  this._packages      = null;
  this._name          = null;
  this._namespace     = null;
  this._skipRuntime   = null;
  this._skipTemplates = null;

  this._trees = {
    buildTree:             null,
    distTrees:             null,
    prodTrees:             null,
    compiledTests:         null,
    compiledSource:        null,
    prodCompiledTests:     null,
    minCompiledSource:     null,
    prodCompiledSource:    null,
    deprecatedDebugFile:   null,
    testingCompiledSource: null
  };

  return this;
};

// Takes devSourceTrees and compiles / concats into ember.js (final output).
// If non-development will ensure that output is ES3 compliant.
EmberBuild.prototype._generateCompiledSourceTree = function generateCompiledSourceTree() {
  var buildTree = this._enumeratePackages();

  return this._trees.compiledSource = this._concatenateES6Modules(buildTree.devSourceTrees, {
    destFile:        '/' + this._name + '.debug.js',
    vendorTrees:     buildTree.vendorTrees,
    includeLoader:   true,
    bootstrapModule: this._name
  });
};

// Generates prod build. Defeatureify increases the overall runtime speed of ember.js by ~10%.
EmberBuild.prototype._generateProdCompiledSourceTree = function generateProdCompiledSourceTree() {
  var buildTree = this._enumeratePackages();

  return this._trees.prodCompiledSource = this._concatenateES6Modules(buildTree.prodSourceTrees, {
    destFile:        '/' + this._name + '.prod.js',
    vendorTrees:     buildTree.vendorTrees,
    includeLoader:   true,
    bootstrapModule: this._name,
    defeatureifyOptions: {
      stripDebug: true,
      environment: 'production'
    }
  });
};

EmberBuild.prototype._generateDeprecatedDebugFileTree = function generateDeprecatedDebugFileTree() {
  this._trees.deprecatedDebugFile = replace(this._trees.compiledSource, {
    files: [ this._name + '.debug.js' ],
    patterns: [{
      match: /var runningNonEmberDebugJS = false;/,
      replacement: 'var runningNonEmberDebugJS = true;'
    }]
  });

  return this._trees.deprecatedDebugFile = concat(this._trees.deprecatedDebugFile, {
    inputFiles: [ this._name + '.debug.js' ],
    outputFile: '/' + this._name + '.js'
  });
};

// Take testsTrees and compile them for consumption in the browser test suite.
EmberBuild.prototype._generateCompiledTestsTree = function generateCompiledTestsTree() {
  var buildTree = this._enumeratePackages();

  return this._trees.compiledTests = this._concatenateES6Modules(buildTree.testTree, {
    destFile:      '/' + this._name + '-tests.js',
    includeLoader: true
  });
};

// Take testsTrees and compile them for consumption in the browser test suite
// to be used by production builds
EmberBuild.prototype._generateProdCompiledTestsTree = function generateProdCompiledTestsTree() {
  var buildTree = this._enumeratePackages();

  return this._trees.prodCompiledTests = this._concatenateES6Modules(buildTree.testTree, {
    destFile:      '/' + this._name + '-tests.prod.js',
    includeLoader: true,
    defeatureifyOptions: {
      environment: 'production'
    }
  });
};

// Generates ember-testing.js to allow testing against production Ember builds.
EmberBuild.prototype._generateTestingCompiledSourceTree = function generateTestingCompiledSourceTree() {
  var buildTree = this._enumeratePackages();

  return this._trees.testingCompiledSource = this._concatenateES6Modules(buildTree.testingSourceTrees, {
    destFile:      '/' + this._name + '-testing.js',
    includeLoader: true,
    bootstrapModule: this._name + '-testing'
  });
};

// Take prod output and minify. This reduces filesize (as you'd expect)
EmberBuild.prototype._generateMinifiedCompiledSourceTree = function generateMinifiedCompiledSourceTree() {
  return this._trees.minCompiledSource = minifySourceTree(this._trees.prodCompiledSource, {
    srcFile:  this._name + '.prod.js',
    destFile: this._name + '.min.js',
    mangle:   true,
    compress: true
  });
};

EmberBuild.prototype._enumeratePackages = function enumeratePackages() {
  if (this._trees.buildTree) {
    return this._trees.buildTree;
  }

  var packages             = this._packages;
  var testTrees            = [emberDevTestHelpers];
  var compiledPackageTrees = [];
  var devSourceTrees       = [];
  var vendorTrees          = [];
  var testingSourceTrees   = [];
  var prodSourceTrees      = [];

  for (var packageName in packages) {
    var currentPackage = packages[packageName];

    currentPackage.trees = es6Package(packages, packageName);

    if (currentPackage['vendorRequirements']) {
      /* jshint -W083 */
      currentPackage['vendorRequirements'].forEach(function(dependency) {
        vendorTrees.push(vendoredPackages[dependency]);
      });
    }

    if (currentPackage.trees.lib) {
      devSourceTrees.push(currentPackage.trees.lib);

      if (currentPackage.developmentOnly) {
        testingSourceTrees.push(currentPackage.trees.lib);
      } else {
        prodSourceTrees.push(currentPackage.trees.lib);
      }
    }

    if (currentPackage.trees.compiledTree) {
      compiledPackageTrees.push(currentPackage.trees.compiledTree);
    }

    if (currentPackage.trees.tests) {
      testTrees.push(currentPackage.trees.tests);
    }
  }

  this._trees.buildTree = {
    testTree:             mergeTrees(testTrees),
    vendorTrees:          mergeTrees(vendorTrees, { overwrite: true }),
    devSourceTrees:       mergeTrees(devSourceTrees),
    compiledPackageTrees: mergeTrees(compiledPackageTrees),
    testingSourceTrees:   testingSourceTrees,
    prodSourceTrees:      prodSourceTrees
  };

  return this._trees.buildTree;
};

EmberBuild.prototype.getDistTrees = function getDistTrees() {
  var distTrees = [];

  for (var i = 0, l = this._trees.distTrees.length; i < l; i++) {
    distTrees.push(
      this._trees.distTrees[i].call(this, this._packages)
    );
  }

  distTrees.push(this._buildCJSTree(this._trees.compiledSource, {
    name: this._name,
    namespace: this._namespace
  }));

  // If you are not running in dev add Production and Minify build to distTrees.
  // This ensures development build speed is not affected by unnecessary
  // minification and defeaturification
  if (!buildConfig.isDevelopment) {
    for (var j = 0, k = this._trees.prodTrees.length; j < k; j++) {
      distTrees.push(
        this._trees.prodTrees[j].call(this)
      );
    }

    if (!buildConfig.disableMin) {
      distTrees.push(this._generateMinifiedCompiledSourceTree());
    }

    if (!this._skipRuntime) {
      distTrees.push(this._buildRuntimeTree(this._packages));
    }
  }

  // merge distTrees and sub out version placeholders for distribution
  distTrees = mergeTrees(distTrees);

  if (buildConfig.enableDocs && ['serve', 's'].indexOf(process.argv[2]) !== -1 ) {
    distTrees = yuidocPlugin.addDocsToTree(distTrees);
  }

  distTrees = replace(distTrees, {
    files: [ '**/*.js', '**/*.json' ],
    patterns: [
      { match: /VERSION_STRING_PLACEHOLDER/g, replacement: getVersion() }
    ]
  });

  return distTrees;
};

module.exports = EmberBuild;
