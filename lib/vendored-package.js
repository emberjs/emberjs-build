'use strict';

var Funnel      = require('broccoli-funnel');
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

  /*
    For example:
      Given the following dir:
        /packages/metamorph
          └── lib
            └── main.js
      Then tree would be:
        /metamorph
          └── metamorph.js
   */
  var libTree = new Funnel(libPath, {
    getDestinationPath: function(relativePath) {
      if (relativePath === 'main.js') {
        return packageName + '.js';
      }

      return relativePath;
    },
    destDir: '/'
  });

  if (!buildConfig.isDevelopment && !buildConfig.disableES3) {
    libTree = es3recast(libTree);
  }

  return libTree;
};
