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

var testConfig          = getTestConfigTree();
var bowerFiles          = getBowerTree();
var s3TestRunner        = getS3TestRunner();
var vendoredPackages    = getVendoredPackages();
var emberDevTestHelpers = getEmberDevTestHelpers();

function EmberBuild(options) {
  this._init();

  var buildTree = this._enumeratePackages(options.packages);

  this._generateCompiledSourceTree(buildTree.vendorTrees, buildTree.devSourceTrees);
  this._generateProdCompiledSourceTree(buildTree.vendorTrees, buildTree.prodSourceTrees);

  this._generateDeprecatedDebugFileTree();

  this._generateMinifiedCompiledSourceTree();

  this._generateCompiledTestsTree(buildTree.testTree);
  this._generateProdCompiledTestsTree(buildTree.testTree);

  this._generateTestingCompiledSourceTree(buildTree.testingSourceTrees);
}

EmberBuild.prototype._init = function init() {
  this._distTrees             = null;
  this._compiledTests         = null;
  this._compiledSource        = null;
  this._prodCompiledTests     = null;
  this._prodCompiledSource    = null;
  this._deprecatedDebugFile   = null;
  this._testingCompiledSource = null;
  this._minCompiledSource     = null;
};

// Takes devSourceTrees and compiles / concats into ember.js (final output).
// If non-development will ensure that output is ES3 compliant.
EmberBuild.prototype._generateCompiledSourceTree = function generateCompiledSourceTree(vendorTrees, devSourceTrees) {
  this._compiledSource = concatES6(devSourceTrees, {
    es3Safe:         !buildConfig.isDevelopment,
    destFile:        '/ember.debug.js',
    derequire:       !buildConfig.isDevelopment,
    inputFiles:      ['**/*.js'],
    vendorTrees:     vendorTrees,
    includeLoader:   true,
    bootstrapModule: 'ember'
  });
};

// Generates prod build. Defeatureify increases the overall runtime speed of ember.js by ~10%.
EmberBuild.prototype._generateProdCompiledSourceTree = function generateProdCompiledSourceTree(vendorTrees, prodSourceTrees) {
  this._prodCompiledSource = concatES6(prodSourceTrees, {
    es3Safe:         !buildConfig.isDevelopment,
    destFile:        '/ember.prod.js',
    derequire:       !buildConfig.isDevelopment,
    inputFiles:      ['**/*.js'],
    vendorTrees:     vendorTrees,
    includeLoader:   true,
    bootstrapModule: 'ember',
    defeatureifyOptions: {
      stripDebug: true,
      environment: 'production'
    }
  });
};

EmberBuild.prototype._generateDeprecatedDebugFileTree = function generateDeprecatedDebugFileTree() {
  this._deprecatedDebugFile = replace(this._compiledSource, {
    files: [ 'ember.debug.js' ],
    patterns: [{
      match: /var runningNonEmberDebugJS = false;/,
      replacement: 'var runningNonEmberDebugJS = true;'
    }]
  });

  this._deprecatedDebugFile = concat(this._deprecatedDebugFile, {
    inputFiles: [ 'ember.debug.js' ],
    outputFile: '/ember.js'
  });
};

// Take testsTrees and compile them for consumption in the browser test suite.
EmberBuild.prototype._generateCompiledTestsTree = function generateCompiledTestsTree(testTree) {
  this._compiledTests = concatES6(testTree, {
    es3Safe:       !buildConfig.isDevelopment,
    destFile:      '/ember-tests.js',
    derequire:     !buildConfig.isDevelopment,
    inputFiles:    ['**/*.js'],
    includeLoader: true
  });
};

// Take testsTrees and compile them for consumption in the browser test suite
// to be used by production builds
EmberBuild.prototype._generateProdCompiledTestsTree = function generateProdCompiledTestsTree(testTree) {
  this._prodCompiledTests = concatES6(testTree, {
    es3Safe:       !buildConfig.isDevelopment,
    destFile:      '/ember-tests.prod.js',
    derequire:     !buildConfig.isDevelopment,
    inputFiles:    ['**/*.js'],
    includeLoader: true,
    defeatureifyOptions: {
      environment: 'production'
    }
  });
};

// Generates ember-testing.js to allow testing against production Ember builds.
EmberBuild.prototype._generateTestingCompiledSourceTree = function generateTestingCompiledSourceTree(testingSourceTrees) {
  this._testingCompiledSource = concatES6(testingSourceTrees, {
    es3Safe:          !buildConfig.isDevelopment,
    destFile:         '/ember-testing.js',
    derequire:        !buildConfig.isDevelopment,
    inputFiles:       ['**/*.js'],
    includeLoader:    true,
    bootstrapModule: 'ember-testing'
  });
};


// Take prod output and minify.  This reduces filesize (as you'd expect)
EmberBuild.prototype._generateMinifiedCompiledSourceTree = function generateMinifiedCompiledSourceTree() {
  this._minCompiledSource = moveFile(this._prodCompiledSource, {
    srcFile: 'ember.prod.js',
    destFile: 'ember.min.js'
  });

  this._minCompiledSource = uglifyJavaScript(this._minCompiledSource, {
    mangle: true,
    compress: true
  });
};

EmberBuild.prototype._enumeratePackages = function enumeratePackages(packages) {
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

  return {
    testTree:             mergeTrees(testTrees),
    vendorTrees:          mergeTrees(vendorTrees),
    devSourceTrees:       mergeTrees(devSourceTrees),
    compiledPackageTrees: mergeTrees(compiledPackageTrees),
    testingSourceTrees:   testingSourceTrees,
    prodSourceTrees:      prodSourceTrees
  };
};

EmberBuild.prototype.getDistTrees = function getDistTrees() {
  var distTrees = [
    this._compiledSource,
    this._compiledTests,
    this._testingCompiledSource,
    testConfig,
    bowerFiles,
    buildCJSTree(this._compiledSource)
  ];

  // If you are not running in dev add Production and Minify build to distTrees.
  // This ensures development build speed is not affected by unnecessary
  // minification and defeaturification
  if (!buildConfig.isDevelopment) {
    distTrees.push(this._deprecatedDebugFile);
    distTrees.push(s3TestRunner);
    distTrees.push(this._prodCompiledSource);
    distTrees.push(this._prodCompiledTests);

    if (!buildConfig.disableMin) {
      distTrees.push(this._minCompiledSource);
    }

    distTrees.push(buildRuntimeTree());
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
