'use strict';

var pickFiles  = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

// List of bower component trees that require no special handling.
// These will be included in the distTrees for use within
// testsConfig/index.html

var bowerFiles = [
  pickFiles('config/package_manager_files', {
    srcDir: '/',
    destDir: '/'
  }),

  pickFiles('bower_components/qunit/qunit', {
    srcDir: '/',
    destDir: '/qunit'
  }),

  pickFiles('bower_components/jquery/dist', {
    files: ['jquery.js'],
    srcDir: '/',
    destDir: '/jquery'
  }),

  pickFiles('bower_components/handlebars', {
    files: ['handlebars.js'],
    srcDir: '/',
    destDir: '/handlebars'
  })
];

var bowerTree = mergeTrees(bowerFiles);

module.exports = function getBowerTree() {
  return bowerTree;
};
