'use strict';


// TODO: Move line 4 to line 7 out of here
var concat       = require('broccoli-sourcemap-concat');
var replace      = require('broccoli-string-replace');
var mergeTrees   = require('broccoli-merge-trees');
var yuidocPlugin = require('ember-cli-yuidoc');
var CoreObject   = require('core-object');

var debug                  = require('./utils/debug-tree');
var es6Package             = require('./get-es6-package');
var buildConfig            = require('./config/build-config');
var getBowerTree           = require('./bower-tree');
var buildCJSTree           = require('./build-cjs-tree');
var replaceVersion         = require('./utils/replace-version');
var replaceFeatures        = require('./replace-features');
var getS3TestRunner        = require('./s3-test-runner');
var buildRuntimeTree       = require('./get-build-runtime-tree');
var minifySourceTree       = require('./minify-source-tree');
var getTestConfigTree      = require('./config/test-config-tree');
var getVendoredPackages    = require('./get-vendored-packages');
var getEmberDevTestHelpers = require('./ember-dev-test-helpers');
var concatenateES6Modules  = require('./concatenate-es6-modules');

var buildTemplateCompilerTree = require('./get-build-template-compiler-tree');

var emberDevTestHelpers = getEmberDevTestHelpers();

var EmberBuild = CoreObject.extend({
  _name:          null,
  _packages:      null,
  _namespace:     null,
  _skipRuntime:   null,
  _skipTemplates: null,
  _vendoredPackages: null,

  _trees:         {
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
  },

  init: function(_options) {
    var options = _options || {};

    this._packages      = options.packages;
    this._name          = options.name || 'ember';
    this._namespace     = options.namespace || 'Ember';
    this._skipRuntime   = options.skipRuntime;
    this._skipTemplates = options.skipTemplates;
    this._vendoredPackages = options.vendoredPackages;
    this._enableSourceMaps = options.hasOwnProperty('enableSourceMaps') ? options.enableSourceMaps : !buildConfig.disableSourceMaps;

    this._babelConfig = options.babel || {};

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
  },

  _getBowerTree:              getBowerTree,
  _buildCJSTree:              buildCJSTree,
  _getS3TestRunner:           getS3TestRunner,
  _replaceFeatures:           replaceFeatures,
  _minifySourceTree:          minifySourceTree,
  _getTestConfigTree:         getTestConfigTree,
  _concatenateES6Modules:     concatenateES6Modules,
  _buildTemplateCompilerTree: buildTemplateCompilerTree,

  // Takes devSourceTrees and compiles / concats into ember.js (final output).
  // If non-development will ensure that output is ES3 compliant.
  _generateCompiledSourceTree: function generateCompiledSourceTree() {
    var buildTree = this._enumeratePackages();

    var compiledSource = this._concatenateES6Modules(buildTree.devSourceTrees, {
      babel:            this._babelConfig.development,
      enableSourceMaps: this._enableSourceMaps,
      destFile:        '/' + this._name + '.debug.js',
      vendorTrees:     buildTree.devVendorTrees,
      vendoredPackages: this._vendoredPackages,
      includeLoader:   true,
      bootstrapModule: this._name
    });

    return this._trees.compiledSource = this._replaceFeatures(debug(compiledSource, 'compiled-source'), {
      files: [ this._name + '.debug.js' ]
    });
  },

  // Generates prod build. Defeatureify increases the overall runtime speed of ember.js by ~10%.
  _generateProdCompiledSourceTree: function generateProdCompiledSourceTree() {
    var buildTree = this._enumeratePackages();

    var prodTree = this._concatenateES6Modules(buildTree.prodSourceTrees, {
      babel:            this._babelConfig.production,
      enableSourceMaps: this._enableSourceMaps,
      destFile:        '/' + this._name + '.prod.js',
      vendorTrees:     buildTree.prodVendorTrees,
      includeLoader:   true,
      bootstrapModule: this._name
    });

    return this._trees.prodCompiledSource = this._replaceFeatures(prodTree, {
      files: [ this._name + '.prod.js' ],
      production: true
    });
  },

  _generateDeprecatedDebugFileTree: function generateDeprecatedDebugFileTree() {
    this._trees.deprecatedDebugFile = replace(this._trees.compiledSource, {
      files: [ this._name + '.debug.js' ],
      patterns: [{
        match: /var runningNonEmberDebugJS = false;/,
        replacement: 'var runningNonEmberDebugJS = true;'
      }]
    });

    return this._trees.deprecatedDebugFile = concat(this._trees.deprecatedDebugFile, {
      inputFiles: [ this._name + '.debug.js' ],
      outputFile: '/' + this._name + '.js',
      sourceMapConfig: { enabled: this._enableSourceMaps }
    });
  },

  // Take testsTrees and compile them for consumption in the browser test suite.
  _generateCompiledTestsTree: function generateCompiledTestsTree() {
    var buildTree = this._enumeratePackages();

    return this._trees.compiledTests = this._concatenateES6Modules(buildTree.testTree, {
      babel:         this._babelConfig.development,
      destFile:      '/' + this._name + '-tests.js',
      vendorTrees:     buildTree.testVendorTrees,
      includeLoader: true
    });
  },

  // Take testsTrees and compile them for consumption in the browser test suite
  // to be used by production builds
  _generateProdCompiledTestsTree: function generateProdCompiledTestsTree() {
    var buildTree = this._enumeratePackages();

    return this._trees.prodCompiledTests = this._concatenateES6Modules(buildTree.testTree, {
      babel:         this._babelConfig.production,
      destFile:      '/' + this._name + '-tests.prod.js',
      includeLoader: true
    });
  },

  // Generates ember-testing.js to allow testing against production Ember builds.
  _generateTestingCompiledSourceTree: function generateTestingCompiledSourceTree() {
    var buildTree = this._enumeratePackages();

    return this._trees.testingCompiledSource = this._concatenateES6Modules(buildTree.testingSourceTrees, {
      babel:         this._babelConfig.development,
      destFile:      '/' + this._name + '-testing.js',
      includeLoader: true,
      bootstrapModule: this._name + '-testing'
    });
  },

  // Take prod output and minify. This reduces filesize (as you'd expect)
  _generateMinifiedCompiledSourceTree: function generateMinifiedCompiledSourceTree() {
    return this._trees.minCompiledSource = this._minifySourceTree(this._trees.prodCompiledSource, {
      enableSourceMaps: this._enableSourceMaps,
      negateIIFE: false,
      srcFile:  this._name + '.prod.js',
      destFile: this._name + '.min.js',
      mangle:   true,
      compress: true
    });
  },

  _buildRuntimeTree: function _buildRuntimeTree() {
    return buildRuntimeTree(this._packages, this._vendoredPackages, {
      enableSourceMaps: this._enableSourceMaps
    });
  },

  _enumeratePackages: function enumeratePackages() {
    if (this._trees.buildTree) {
      return this._trees.buildTree;
    }

    var packages             = this._packages;
    var testTrees            = [emberDevTestHelpers];
    var devSourceTrees       = [];
    var testingSourceTrees   = [];
    var prodSourceTrees      = [];
    var prodVendorTrees      = [];
    var devVendorTrees       = [];
    var testVendorTrees      = [];
    var vendoredPackages     = this._vendoredPackages || getVendoredPackages();

    for (var packageName in packages) {
      var currentPackage = packages[packageName];

      currentPackage.trees = es6Package(packages, packageName, {
        htmlbars: this.htmlbars,
        vendoredPackages: vendoredPackages
      });

      if (currentPackage['vendorRequirements']) {
        /* jshint -W083 */
        currentPackage['vendorRequirements'].forEach(function(dependency) {
          devVendorTrees.push(vendoredPackages[dependency]);
          prodVendorTrees.push(vendoredPackages[dependency]);
        });
      }

      if (currentPackage['developmentVendorRequirements']) {
        /* jshint -W083 */
        currentPackage['developmentVendorRequirements'].forEach(function(dependency) {
          devVendorTrees.push(vendoredPackages[dependency]);
        });
      }

      if (currentPackage['testingVendorRequirements']) {
        /* jshint -W083 */
        currentPackage['testingVendorRequirements'].forEach(function(dependency) {
          testVendorTrees.push(vendoredPackages[dependency]);
        });
      }

      if (currentPackage.trees.lib) {
        devSourceTrees.push(currentPackage.trees.lib);

        if (currentPackage.developmentOnly) {
          /* do nothing */
        } else if (currentPackage.testing) {
          testingSourceTrees.push(currentPackage.trees.lib);
        } else {
          prodSourceTrees.push(currentPackage.trees.lib);
        }
      }

      if (currentPackage.trees.tests) {
        testTrees.push(currentPackage.trees.tests);
      }
    }

    this._trees.buildTree = {
      testTree:             mergeTrees(testTrees),
      prodVendorTrees:      debug(mergeTrees(prodVendorTrees, { overwrite: true}), 'prod-vendor-trees'),
      devVendorTrees:       debug(mergeTrees(devVendorTrees, { overwrite: true}), 'dev-vendor-trees'),
      testVendorTrees:      debug(mergeTrees(testVendorTrees, { overwrite: true}), 'test-vendor-trees'),
      devSourceTrees:       mergeTrees(devSourceTrees),
      testingSourceTrees:   testingSourceTrees,
      prodSourceTrees:      prodSourceTrees
    };

    return this._trees.buildTree;
  },

  getDistTrees: function getDistTrees() {
    var distTrees = [];

    for (var i = 0, l = this._trees.distTrees.length; i < l; i++) {
      distTrees.push(
        this._trees.distTrees[i].call(this, this._packages, this._vendoredPackages, {
          babel: this._babelConfig.development,
          enableSourceMaps: this._enableSourceMaps
        })
      );
    }

    distTrees.push(this._buildCJSTree(this._trees.compiledSource, {
      name: this._name,
      namespace: this._namespace
    }));

    if (!this._skipRuntime) {
      distTrees.push(this._buildRuntimeTree());
    }

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
    }

    // merge distTrees and sub out version placeholders for distribution
    distTrees = mergeTrees(distTrees);

    if (buildConfig.enableDocs && ['serve', 's'].indexOf(process.argv[2]) !== -1 ) {
      distTrees = yuidocPlugin.addDocsToTree(distTrees);
    }

    distTrees = replaceVersion(distTrees);

    return distTrees;
  }
});

module.exports = EmberBuild;
