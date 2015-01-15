'use strict';

var _debug = require('broccoli-stew').debug;
var buildConfig = require('../config/build-config');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function debugTree(tree, name) {
  if (!buildConfig.enableTreeDebugging) { return tree; }

  var debugResult = _debug(tree, { name: name });

  return mergeTrees([debugResult, tree], { overwrite: true });
};
