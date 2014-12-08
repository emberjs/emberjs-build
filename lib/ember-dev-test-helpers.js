'use strict';

var pickFiles = require('broccoli-static-compiler');

var emberDevTestHelpers = pickFiles('bower_components/ember-dev/addon', {
  srcDir: '/',
  destDir: '/ember-dev',
  files: ['**/*.js']
});

module.exports = function getEmberDevTestHelpers() {
  return emberDevTestHelpers;
};
