'use strict';

var Funnel = require('broccoli-funnel');

module.exports = function license(tree, licenseFile) {
  licenseFile = licenseFile || 'LICENSE';

  return new Funnel(tree, {
    include: [licenseFile]
  });
};
