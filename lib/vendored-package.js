'use strict';

var moveFile    = require('broccoli-file-mover');
var pickFiles   = require('broccoli-static-compiler');
var es3recast   = require('broccoli-es3-safe-recast');
var buildConfig = require('./config/build-config');

/*
  Returns a tree picked from `packages/#{packageName}/lib`
  and then move `main.js` to `/#{packageName}.js`.

  This method is used for `handlebars` and `loader`.
*/
module.exports = function vendoredPackage(packageName, opts) {
  var options = opts || {};

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

  if (!buildConfig.isDevelopment && !buildConfig.disableES3) {
    sourceTree = es3recast(sourceTree);
  }

  return sourceTree;
};
