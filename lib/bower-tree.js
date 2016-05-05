'use strict';
var replaceVersion = require('./utils/replace-version');
var Funnel     = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

// List of bower component trees that require no special handling.
// These will be included in the distTrees for use within
// testsConfig/index.html

var bowerFiles = [
  replaceVersion(new Funnel('config/package_manager_files', {
    destDir: '/'
  })),

  new Funnel('bower_components/qunit/qunit', {
    destDir: '/qunit'
  }),

  new Funnel('bower_components/jquery/dist', {
    files: ['jquery.js'],
    destDir: '/jquery'
  })
];

var bowerTree = mergeTrees(bowerFiles);

module.exports = function getBowerTree() {
  return bowerTree;
};
