'use strict';

// TODO: Move line 3 to line 10 out of here
var concat           = require('broccoli-concat');
var replace          = require('broccoli-replace');
var moveFile         = require('broccoli-file-mover');
var getVersion       = require('git-repo-version');
var mergeTrees       = require('broccoli-merge-trees');
var yuidocPlugin     = require('ember-cli-yuidoc');
var uglifyJavaScript = require('broccoli-uglify-js');

var concatES6              = require('./concat-es6');
var es6Package             = require('./get-es6-package');
var buildConfig            = require('./build-config');
var getBowerTree           = require('./bower-tree');
var buildCJSTree           = require('./build-cjs-tree');
var getS3TestRunner        = require('./s3-test-runner');
var buildRuntimeTree       = require('./get-build-runtime-tree');
var getTestConfigTree      = require('./test-config-tree');
var getVendoredPackages    = require('./get-vendored-packages');
var getEmberDevTestHelpers = require('./ember-dev-test-helpers');

var vendoredPackages    = getVendoredPackages();
var emberDevTestHelpers = getEmberDevTestHelpers();

function EmberBuild(options) {
  this._init();

  if (options && options.packages) {
    this._packages = options.packages;

    this._trees.distTrees = [
      this._generateCompiledSourceTree,
      this._generateCompiledTestsTree,
      this._generateTestingCompiledSourceTree,
      this._getTestConfigTree,
      this._getBowerTree
    ];

    this._trees.prodTrees = [
      this._generateDeprecatedDebugFileTree,
      this._getS3TestRunner,
      this._generateProdCompiledSourceTree,
      this._generateProdCompiledTestsTree
    ];
  }
}

EmberBuild.prototype._getBowerTree      = getBowerTree;
EmberBuild.prototype._buildCJSTree      = buildCJSTree;
EmberBuild.prototype._getS3TestRunner   = getS3TestRunner;
EmberBuild.prototype._buildRuntimeTree  = buildRuntimeTree;
EmberBuild.prototype._getTestConfigTree = getTestConfigTree;

EmberBuild.prototype._init = function init() {
  this._packages = null;

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

  this._trees.compiledSource = concatES6(buildTree.devSourceTrees, {
    es3Safe:         !buildConfig.isDevelopment,
    destFile:        '/ember.debug.js',
    derequire:       !buildConfig.isDevelopment,
    inputFiles:      ['**/*.js'],
    vendorTrees:     buildTree.vendorTrees,
    includeLoader:   true,
    bootstrapModule: 'ember'
  });

  return this._trees.compiledSource;
};

// Generates prod build. Defeatureify increases the overall runtime speed of ember.js by ~10%.
EmberBuild.prototype._generateProdCompiledSourceTree = function generateProdCompiledSourceTree() {
  var buildTree = this._enumeratePackages();

  this._trees.prodCompiledSource = concatES6(buildTree.prodSourceTrees, {
    es3Safe:         !buildConfig.isDevelopment,
    destFile:        '/ember.prod.js',
    derequire:       !buildConfig.isDevelopment,
    inputFiles:      ['**/*.js'],
    vendorTrees:     buildTree.vendorTrees,
    includeLoader:   true,
    bootstrapModule: 'ember',
    defeatureifyOptions: {
      stripDebug: true,
      environment: 'production'
    }
  });

  return this._trees.prodCompiledSource;
};

EmberBuild.prototype._generateDeprecatedDebugFileTree = function generateDeprecatedDebugFileTree() {
  this._trees.deprecatedDebugFile = replace(this._trees.compiledSource, {
    files: [ 'ember.debug.js' ],
    patterns: [{
      match: /var runningNonEmberDebugJS = false;/,
      replacement: 'var runningNonEmberDebugJS = true;'
    }]
  });

  this._trees.deprecatedDebugFile = concat(this._trees.deprecatedDebugFile, {
    inputFiles: [ 'ember.debug.js' ],
    outputFile: '/ember.js'
  });

  return this._trees.deprecatedDebugFile;
};

// Take testsTrees and compile them for consumption in the browser test suite.
EmberBuild.prototype._generateCompiledTestsTree = function generateCompiledTestsTree() {
  var buildTree = this._enumeratePackages();

  this._trees.compiledTests = concatES6(buildTree.testTree, {
    es3Safe:       !buildConfig.isDevelopment,
    destFile:      '/ember-tests.js',
    derequire:     !buildConfig.isDevelopment,
    inputFiles:    ['**/*.js'],
    includeLoader: true
  });

  return this._trees.compiledTests;
};

// Take testsTrees and compile them for consumption in the browser test suite
// to be used by production builds
EmberBuild.prototype._generateProdCompiledTestsTree = function generateProdCompiledTestsTree() {
  var buildTree = this._enumeratePackages();

  this._trees.prodCompiledTests = concatES6(buildTree.testTree, {
    es3Safe:       !buildConfig.isDevelopment,
    destFile:      '/ember-tests.prod.js',
    derequire:     !buildConfig.isDevelopment,
    inputFiles:    ['**/*.js'],
    includeLoader: true,
    defeatureifyOptions: {
      environment: 'production'
    }
  });

  return this._trees.prodCompiledTests;
};

// Generates ember-testing.js to allow testing against production Ember builds.
EmberBuild.prototype._generateTestingCompiledSourceTree = function generateTestingCompiledSourceTree() {
  var buildTree = this._enumeratePackages();

  this._trees.testingCompiledSource = concatES6(buildTree.testingSourceTrees, {
    es3Safe:          !buildConfig.isDevelopment,
    destFile:         '/ember-testing.js',
    derequire:        !buildConfig.isDevelopment,
    inputFiles:       ['**/*.js'],
    includeLoader:    true,
    bootstrapModule: 'ember-testing'
  });

  return this._trees.testingCompiledSource;
};

// Take prod output and minify. This reduces filesize (as you'd expect)
EmberBuild.prototype._generateMinifiedCompiledSourceTree = function generateMinifiedCompiledSourceTree() {
  this._trees.minCompiledSource = moveFile(this._trees.prodCompiledSource, {
    srcFile: 'ember.prod.js',
    destFile: 'ember.min.js'
  });

  this._trees.minCompiledSource = uglifyJavaScript(this._trees.minCompiledSource, {
    mangle: true,
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

    currentPackage.trees = es6Package(packageName);

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
    vendorTrees:          mergeTrees(vendorTrees),
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
      this._trees.distTrees[i].call(this)
    );
  }

  distTrees.push(this._buildCJSTree(this._trees.compiledSource));

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

    distTrees.push(this._buildRuntimeTree());
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
