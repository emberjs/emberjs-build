
'use strict';

var path = require('path');
var StringReplace = require('broccoli-string-replace');
var getVersion = require('git-repo-version');

module.exports = function replaceVersion(trees, options) {
  var opts = options || {};
  var version = getVersion().replace(/^v/, '');

  var replace = new StringReplace(trees, {
    patterns: [{
      match:       opts.placeholder || /VERSION_STRING_PLACEHOLDER/g,
      replacement: opts.version     || version
    }]
  });

  replace.canProcessFile = function(relativePath) {
    var extensionsToMatch = ['.js', '.json'];
    var extension = path.extname(relativePath);

    return extensionsToMatch.indexOf(extension) > -1;
  };

  return replace;
};
