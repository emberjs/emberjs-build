'use strict';

var fs = require('fs');
var merge = require('lodash-node/modern/objects/merge');

var configJson = JSON.parse(fs.readFileSync('features.json').toString());

/*
  Defeatureify is used in the ember-dev package to enable or remove features and
  strip debug statements during the Ember.js build process.  Used largely for
  removing features.  An example might look like this:

  ```
    if (Ember.FEATURES.isEnabled('ember-metal-is-present')) {
      ...
    }
  ```

  The `...` and if block would be stripped out of final output unless
  `features.json` has `ember-metal-is-present` set to true.

  opts: {
    stripDebug: true/false/undefined,
    environment: 'production'
  }
*/
module.exports = function defeatureifyConfig(opts) {
  var options    = opts || {};
  var features   = merge({}, options.features || configJson.features);
  var stripDebug = false;

  if (configJson.hasOwnProperty('stripDebug')) { stripDebug = configJson.stripDebug; }
  if (options.hasOwnProperty('stripDebug')) { stripDebug = options.stripDebug; }

  for (var flag in features) {
    if (features[flag] === 'development-only') {
      features[flag] = options.environment !== 'production';
    }
  }

  return {
    enabled:           features,
    debugStatements:   options.debugStatements || configJson.debugStatements,
    namespace:         options.namespace || configJson.namespace,
    enableStripDebug:  stripDebug
  };
};
