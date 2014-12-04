'use strict';

var moveFile = require('broccoli-file-mover');
var pickFiles = require('broccoli-static-compiler');
var es3recast = require('broccoli-es3-safe-recast');

/*
  Returns a tree picked from `packages/#{packageName}/lib`
  and then move `main.js` to `/#{packageName}.js`.
*/
module.exports = function vendoredPackage(packageName, _options, isDevelopment, disableES3) {
  var options = _options || {};

  var libPath = options.libPath || 'packages/' + packageName + '/lib';
  var mainFile = options.mainFile || 'main.js';

  /*
    For example:
      Given the following dir:
        /packages/metamorph
          └── lib
            └── main.js
      Then tree would be:
        /metamorph
          └── main.js
   */
  var libTree = pickFiles(libPath, {
    files: [ mainFile ],
    srcDir: '/',
    destDir: '/' + packageName
  });

  /*
    Then we move the main.js to packageName.js
    Given:
      /metamorph
        └── main.js
    Then:
      /metamorph
        └── metamorph.js
   */
  var sourceTree = moveFile(libTree, {
    srcFile:  packageName + '/' + mainFile,
    destFile: packageName + '.js'
  });

  if (!isDevelopment && !disableES3) {
    sourceTree = es3recast(sourceTree);
  }

  return sourceTree;
};
