'use strict';
var Funnel = require('broccoli-funnel');
var UnwatchedDir = require('broccoli-source').UnwatchedDir;
var CompileFeaturesJSON = require('./utils/compile-features-json');

module.exports = function compileEmberFeatures(environment) {
  var featuresJSON = new Funnel(new UnwatchedDir('.'), {
    include: [ 'features.json' ],
    destDir: '/ember',
    annotation: 'features.json'
  });

  return new CompileFeaturesJSON(featuresJSON, {
    environment: environment,
    annotation: 'ember/features.js'
  });
};
