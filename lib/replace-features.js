'use strict';

var replace   = require('broccoli-string-replace');

module.exports = function replaceFeatures(tree, options) {
  return replace(tree, {
    files: options.files,
    patterns: [{
      match: /\{\{DEV_FEATURES\}\}/g,
      replacement: JSON.stringify(options.features.development)
    }, {
      match: /\{\{PROD_FEATURES\}\}/g,
      replacement: JSON.stringify(options.features.production)
    }, {
      match: /DEFAULT_FEATURES/g,
      replacement: options.production ? JSON.stringify(options.features.production) : JSON.stringify(options.features.development)
    }],
    annotation: options.annotation
  });
};
