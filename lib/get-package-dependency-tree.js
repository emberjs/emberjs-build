'use strict';

// to avoid circular dependency shenanigans
module.exports = packageDependencyTree;

var mergeTrees = require('broccoli-merge-trees');

var es6Package          = require('./get-es6-package');
var getVendoredPackages = require('./get-vendored-packages');

/*
  Iterate over dependencyTree as specified within `lib/packages.js`.
  Make sure all dependencies are met for each package.
*/
function packageDependencyTree(packages, packageName, opts) {
  var options = opts || {};
  var vendoredPackages = options.vendoredPackages || getVendoredPackages();
  var dependencyTrees = packages[packageName]['dependencyTrees'];

  // Return if we've already processed this package
  if (dependencyTrees) {
    return dependencyTrees;
  } else {
    dependencyTrees = [];
  }

  var requiredDependencies = packages[packageName]['requirements'] || [];
  var vendoredDependencies = packages[packageName]['vendorRequirements'] || [];

  var libTrees = [];
  var vendorTrees = [];

  // Push vendorPackage tree onto vendorTrees array local hash lookup.
  // See above.
  vendoredDependencies.forEach(function(dependency) {
    vendorTrees.push(vendoredPackages[dependency]);
  });

  /*
    For example (simplified for demonstration):

    ```
      {
        'ember-views':   {requirements: ['ember-runtime']},
        'ember-runtime': {requirements: ['container', 'ember-metal']},
        'container':     {requirements: []},
        'ember-metal':   {requirements: []}
      }
    ```

    When processing `ember-views` will process dependencies (this is recursive).
    This will call itself on `ember-runtime` which will in turn call itself on
    `container` and then `ember-metal` which (because it has no requirements)
    will terminate the recursion.
    Finally each recurse will return the dependency's lib tree.  So we end with
    an array of lib trees for each dependency in the graph
  */
  requiredDependencies.forEach(function(dependency) {
    libTrees.concat(packageDependencyTree(packages, dependency, {
      vendoredPackages: vendoredPackages
    }));
    libTrees.push(es6Package(packages, dependency, {
      vendoredPackages: vendoredPackages
    }).lib);
  });
  // }, this);

  /*
    Merge and return dependencyTrees.  Overwrite _MUST_ occur in order to
    prevent requirements from stepping on one another.
  */
  packages[packageName]['vendorTrees']            = mergeTrees(vendorTrees, {overwrite: true});
  return packages[packageName]['dependencyTrees'] = mergeTrees(libTrees, {overwrite: true});
}
