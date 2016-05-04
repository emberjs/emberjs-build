'use strict';
var getVersion   = require('git-repo-version');
var WriteFile    = require('broccoli-file-creator');

module.exports = function createEmberVersion() {
  var version = JSON.stringify(getVersion().replace(/^v/, ''));
  var content = 'export default ' + version + ';\n';
  var tree = new WriteFile('ember/version.js', content, {
    annotation: 'ember/version.js'
  });
  return tree;
};
