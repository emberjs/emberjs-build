'use strict';

// to avoid circular dependency shenanigans
module.exports = getES6Package;

var Funnel     = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var ESLintTree = require('broccoli-lint-eslint');

var config                      = require('./config/build-config');
var packageDependencyTree       = require('./get-package-dependency-tree');
var htmlbarsTemplatePrecompiler = require('./utils/htmlbars-template-precompiler');
var glimmerTemplatePrecompiler  = require('./utils/glimmer-template-precompiler');
var typescriptCompiler          = require('./utils/typescript-compiler');

var disableESLint = config.disableESLint;

function getES6Package(packages, packageName, opts) {
  var pkg        = packages[packageName];
  var options    = opts || {};
  var jsRegExp   = /js$/;

  var libTree;

  /*
    Prematurely returns if already defined. Trees is (will be) an object that looks like:
    ```
      {lib: libTree, vendorTrees: vendorTrees};
    ```
  */
  if (pkg['trees']) {
    return pkg['trees'];
  }

  /*
    Recursively load dependency graph as outlined in `lib/packages.js`
    #TODO: moar detail!!!
  */
  packageDependencyTree(packages, packageName, {
    vendoredPackages: options.vendoredPackages,
    eslintRulePaths: options.eslintRulePaths,
  });
  var vendorTrees = pkg.vendorTrees;

  /*
    The list of files to select. This is passed to `Funnel` below.
  */
  var files = [ jsRegExp ];

  if (pkg.typescript) {
    files.push(/ts$/);
  }

  if (pkg.hasTemplates) {
    files.push(/hbs$/);
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
       ── ember-extenstion-support.js
    ```
  */
  libTree = new Funnel(options.libPath || 'packages/' + packageName + '/lib', {
    include: files,
    destDir: packageName,
    getDestinationPath: function(relativePath) {
      if (relativePath === 'main.js') {
        return '../' + packageName + '.js';
      }

      return relativePath;
    },
  });


  var eslintOptions = {
    testGenerator: 'qunit',
    options: { rulePaths: options.eslintRulePaths },
  };

  var libESLintTree = new ESLintTree(libTree, eslintOptions);

  if (pkg.hasTemplates) {
    /*
      Utilizing the templateCompiler to compile inline templates to
      template functions.  This is done so that HTMLBars compiler is
      not required for running Ember.
    */

    if (packageName.indexOf('htmlbars') > -1) {
      libTree = htmlbarsTemplatePrecompiler(libTree, {
        htmlbars: options.htmlbars
      });
    } else if (packageName.indexOf('glimmer') > -1) {
      libTree = glimmerTemplatePrecompiler(libTree, {
        glimmer: options.glimmer
      });
    }
  }

  if (pkg.typescript) {
    var nonTypescript = new Funnel(libTree, {
      include: [ jsRegExp ]
    });

    libTree = mergeTrees([nonTypescript, typescriptCompiler(libTree, packageName)]);
  }

  var testTree = new Funnel(options.testPath || 'packages/' + packageName + '/tests', {
    include: [ jsRegExp ],
    destDir: '/' + packageName + '/tests'
  });

  var testESLintTree = new ESLintTree(testTree, eslintOptions);

  /*
    Merge jshint into testTree in order to ensure that if you have a jshint
    failure you'll see them fail in your browser tests
  */
  var testTrees = [];
  if (!disableESLint) {
    testTrees.push(libESLintTree);
    testTrees.push(testESLintTree);
  }
  testTrees.push(testTree);

  testTrees = testTrees.length > 0 ? mergeTrees(testTrees, { overwrite: true }) : testTree;

  // Memoizes trees. Guard above ensures that if this is set will automatically return.
  pkg['trees'] = {
    lib:          libTree,
    vendorTrees:  vendorTrees
  };

  // tests go boom if you try to pick them and they don't exists
  if (!pkg.skipTests) {
    pkg['trees'].tests = testTrees;
  }

  // Baboom!!  Return the trees.
  return pkg['trees'];
}
