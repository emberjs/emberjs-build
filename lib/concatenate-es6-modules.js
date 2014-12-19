'use strict';

var merge = require('lodash-node/modern/objects/merge');

var concatES6   = require('./utils/concat-es6');
var buildConfig = require('./build-config');

var defaultOptions = {
  es3Safe:    !buildConfig.isDevelopment,
  derequire:  !buildConfig.isDevelopment,
  inputFiles: ['**/*.js']
};

module.exports = function concatenateES6Modules(tree, options) {
  return concatES6(tree, merge(options || {}, defaultOptions));
};
