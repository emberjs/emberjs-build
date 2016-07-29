'use strict';
var replaceVersion = require('./utils/replace-version');
var Funnel     = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');



module.exports = function getBowerTree() {
  var options = arguments[arguments.length - 1] || {};

  // List of bower component trees that require no special handling.
  // These will be included in the distTrees for use within
  // testsConfig/index.html
  var bowerFiles = [
    replaceVersion(new Funnel('config/package_manager_files', {destDir: '/'}, {
      version: options.version
    })),

    new Funnel('bower_components/qunit/qunit', {
      destDir: '/qunit'
    }),

    new Funnel('bower_components/jquery/dist', {
      files: ['jquery.js'],
      destDir: '/jquery'
    })
  ];

  return mergeTrees(bowerFiles);
};
