'use strict';

var Funnel     = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

// List of bower component trees that require no special handling.
// These will be included in the distTrees for use within
// testsConfig/index.html

module.exports = function getBowerTree(funnels) {
  if (!funnels) {
    funnels = {
      'config/package_manager_files': {
        destDir: '/'
      },

      'bower_components/qunit/qunit': {
        destDir: '/qunit'
      },

      'bower_components/jquery/dist': {
        files: ['jquery.js'],
        destDir: '/jquery'
      }
    };
  }
  var bowerFiles = [];

  for (var path in funnels) {
    var funnel = new Funnel(path, funnels[path]);
    bowerFiles.push(funnel);
  }

  return mergeTrees(bowerFiles);
};
