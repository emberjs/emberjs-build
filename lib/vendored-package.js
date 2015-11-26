'use strict';

var Funnel      = require('broccoli-funnel');

/*
  Returns a tree picked from `packages/#{packageName}/lib`.

  This method is used for `loader`.
*/
module.exports = function vendoredPackage(packageName, opts) {
  var options = opts || {};

  var libPath = options.libPath || 'packages/' + packageName + '/lib';

  /*
    For example:
      Given the following dir:
        /packages/metamorph
          └── lib
            └── index.js
      Then tree would be:
        /metamorph
          └── index.js
   */
  return new Funnel(libPath, {
    destDir: '/'
  });
};
