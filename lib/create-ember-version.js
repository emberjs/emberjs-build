'use strict';
var WriteFile    = require('broccoli-file-creator');

module.exports = function createEmberVersion(version) {
  if (!version) {
    throw new Error('No version found for `create-ember-version`!');
  }

  var content = 'export default ' + JSON.stringify(version) + ';\n';
  var tree = new WriteFile('ember/version.js', content, {
    annotation: 'ember/version'
  });
  return tree;
};
