'use strict';
var path = require('path');
var Filter = require('broccoli-persistent-filter');

CompileFeaturesJSON.prototype = Object.create(Filter.prototype);
CompileFeaturesJSON.prototype.constructor = CompileFeaturesJSON;

function CompileFeaturesJSON(inputNode, options) {
  Filter.call(this, inputNode, {
    annotation: options.annotation,
    persist: true
  });
  this.isDevelopment = options.environment !== 'production';
}

CompileFeaturesJSON.prototype.extensions = ['json'];
CompileFeaturesJSON.prototype.targetExtension = 'js';

CompileFeaturesJSON.prototype.baseDir = function() {
  return path.resolve(__dirname, '../..');
};

CompileFeaturesJSON.prototype.processString = function(content) {
  var json = JSON.parse(content);
  var features = {};
  var isDevelopment = this.isDevelopment;

  eachFeature(json.features, function (flag, feature) {
    if (feature === 'development-only') {
      features[flag] = isDevelopment;
    } else if (feature === null) {
      features[flag] = null;
    }
  });

  return 'export default ' + JSON.stringify(features) + ';\n';
};

function eachFeature(features, cb) {
  Object.keys(features).forEach(function (flag) {
    cb(flag, features[flag]);
  });
}

module.exports = CompileFeaturesJSON;
