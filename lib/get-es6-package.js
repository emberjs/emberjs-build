'use strict';

// to avoid circular dependency shenanigans
module.exports = getES6Package;

var moveFile   = require('broccoli-file-mover');
var pickFiles  = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var jshintTree = require('broccoli-jshint');

var config                    = require('./build-config');
var packages                  = require('./packages');
var packageDependencyTree     = require('./get-package-dependency-tree');
var inlineTemplatePrecompiler = require('./utils/inline-template-precompiler');
var concatenateES6Modules     = require('./concatenate-es6-modules');

var disableJSHint = config.disableJSHint;

function getES6Package(packageName, opts) {
  var pkg     = packages[packageName];
  var options = opts || {};

  var libTree;

  /*
    Prematurely returns if already defined. Trees is (will be) an object that looks like:
    ```
      {lib: libTree, compiledTree: compiledTrees, vendorTrees: vendorTrees};
    ```
  */
  if (pkg['trees']) {
    return pkg['trees'];
  }

  /*
    Recursively load dependency graph as outlined in `lib/packages.js`
    #TODO: moar detail!!!
  */
  var dependencyTrees = packageDependencyTree(packageName);
  var vendorTrees = pkg.vendorTrees;

  /*
    The list of files to select. This is passed to `pickFiles` below.
  */
  var files = [ '**/*.js'];

  if (pkg.hasTemplates) {
    files.push('**/*.hbs');
  }

  /*
    For packages that are maintained by ember we assume the following structure:
    ```
    packages/ember-extension-support
      ├── lib
      │   ├── container_debug_adapter.js
      │   ├── data_adapter.js
      │   ├── initializers.js
      │   └── main.js
      └── tests
          ├── container_debug_adapter_test.js
          └── data_adapter_test.js
    ```
    And the following following will manipulate the above tree into something
    usuable for distribution
  */


  /*
    The following command will give us a libeTree which will look like the following:
    ```
      ember-extension-support
         ├── container_debug_adapter.js
         ├── data_adapter.js
         ├── initializers.js
         └── main.js
    ```
  */
  libTree = pickFiles(options.libPath || 'packages/' + packageName + '/lib', {
    srcDir: '/',
    files: files,
    destDir: packageName
  });

  /*
   Will rename the main.js file to packageName.js.
    ```
      ember-extension-support
         ├── container_debug_adapter.js
         ├── data_adapter.js
         ├── initializers.js
         └── ember-extension-support.js
    ```
  */
  libTree = moveFile(libTree, {
    srcFile: packageName + '/main.js',
    destFile: packageName + '.js'
  });

  var libJSHintTree = jshintTree(libTree);

  if (pkg.hasTemplates) {
    /*
      Utilizing the templateCompiler to compile inline templates to
      template functions.  This is done so that HTMLBars compiler is
      not required for running Ember.
    */
    libTree = inlineTemplatePrecompiler(libTree);
  }

  var testTree = pickFiles(options.testPath || 'packages/' + packageName + '/tests', {
    srcDir: '/',
    files: ['**/*.js'],
    destDir: '/' + packageName + '/tests'
  });

  var testJSHintTree = jshintTree(testTree);

  /*
    Merge jshint into testTree in order to ensure that if you have a jshint
    failure you'll see them fail in your browser tests
  */
  var testTrees;
  if (disableJSHint) {
    testTrees = testTree;
  } else {
    testTrees = mergeTrees([testTree, libJSHintTree, testJSHintTree]);
  }

  var compiledLib = concatenateES6Modules([dependencyTrees, libTree], {
    includeLoader: true,
    vendorTrees: vendorTrees,
    inputFiles: [packageName + '/**/*.js', packageName + '.js'],
    destFile: '/packages/' + packageName + '.js'
  });

  var compiledTrees = [compiledLib];

  /*
    Produces tree for packages.  This will eventually be merged into a single
    file for use in browser tests.
  */
  var compiledTest = concatenateES6Modules(testTrees, {
    includeLoader: false,
    destFile:      '/packages/' + packageName + '-tests.js'
  });

  if (!pkg.skipTests) { compiledTrees.push(compiledTest); }

  compiledTrees = mergeTrees(compiledTrees);

  // Memoizes trees. Guard above ensures that if this is set will automatically return.
  pkg['trees'] = {
    lib:          libTree,
    compiledTree: compiledTrees,
    vendorTrees:  vendorTrees
  };

  // tests go boom if you try to pick them and they don't exists
  if (!pkg.skipTests) {
    pkg['trees'].tests = testTrees;
  }

  // Baboom!!  Return the trees.
  return pkg['trees'];
}
