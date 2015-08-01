'use strict';

var fs = require('fs');

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
  var features   = {};
  var stripDebug = false;

  if (configJson.hasOwnProperty('stripDebug')) { stripDebug = configJson.stripDebug; }
  if (options.hasOwnProperty('stripDebug')) { stripDebug = options.stripDebug; }

  // we only care about `development-only` or `null` features here
  // all `true`, `false`, or non-`null` features are already stripped
  // by the babel plugin
  for (var flag in configJson.features) {
    var feature = configJson.features[flag];

    if (feature === 'development-only') {
      features[flag] = options.environment !== 'production';
    } else if (feature === null) {
      features[flag] = null;
    }
  }

  console.log(features);

  return {
    enabled:           features,
    debugStatements:   options.debugStatements || configJson.debugStatements,
    namespace:         options.namespace || configJson.namespace,
    enableStripDebug:  stripDebug
  };
};
