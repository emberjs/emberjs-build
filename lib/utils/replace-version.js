
'use strict';

var path = require('path');
var StringReplace = require('broccoli-string-replace');

module.exports = function replaceVersion(trees, options) {
  var opts = options || {};

  if (!opts.version) {
    throw new Error('No version found!');
  }

  var replace = new StringReplace(trees, {
    patterns: [{
      match:       opts.placeholder || /VERSION_STRING_PLACEHOLDER/g,
      replacement: opts.version
    }]
  });

  replace.canProcessFile = function(relativePath) {
    var extensionsToMatch = ['.js', '.json'];
    var extension = path.extname(relativePath);

    return extensionsToMatch.indexOf(extension) > -1;
  };

  return replace;
};
