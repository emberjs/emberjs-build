'use strict';
var WriteFile    = require('broccoli-file-creator');

module.exports = function compileEmberFeatures(features) {
  if (!features) {
    throw new Error('No features provided for `create-ember-features`!');
  }

  var content = 'export default ' + JSON.stringify(features) + ';\n';
  var tree = new WriteFile('ember/features.js', content, {
    annotation: 'ember/features.js'
  });
  return tree;
};
