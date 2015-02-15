'use strict';

var replace   = require('broccoli-string-replace');

var defeatureifyConfig = require('./config/defeatureify-config');

function developmentFeatures() {
  var features = defeatureifyConfig().enabled;

  return JSON.stringify(features);
}

function productionFeatures() {
  var features = defeatureifyConfig({
    environment: 'production'
  }).enabled;

  return JSON.stringify(features);
}

module.exports = function replaceFeatures(tree, options) {

  return replace(tree, {
    files: options.files,
    patterns: [{
      match: /\{\{DEV_FEATURES\}\}/g,
      replacement: developmentFeatures
    }, {
      match: /\{\{PROD_FEATURES\}\}/g,
      replacement: productionFeatures
    }, {
      match: /DEFAULT_FEATURES/g,
      replacement: options.production ? productionFeatures : developmentFeatures
    }]
  });
};
