'use strict';

var replace    = require('broccoli-replace');
var getVersion = require('git-repo-version');

module.exports = function replaceVersion(trees, options) {
  var opts = options || {};
  var version = getVersion().replace(/^v/, '');

  return replace(trees, {
    files: [ '**/*.js', '**/*.json' ],
    patterns: [{
      match:       opts.placeholder || /VERSION_STRING_PLACEHOLDER/g,
      replacement: opts.version     || version
    }]
  });
};
