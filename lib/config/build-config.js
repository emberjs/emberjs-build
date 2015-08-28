'use strict';

// To create fast production builds (without minification, JSCS, or JSHint)
// run the following:
//
// DISABLE_JSHINT=true DISABLE_JSCS=true DISABLE_MIN=true ember serve --environment=production

var env           = process.env.EMBER_ENV || 'development';
var isDevelopment = env === 'development';

var disableJSHint = !!process.env.DISABLE_JSHINT || false;
var disableJSCS   = !!process.env.DISABLE_JSCS || false;
var disableMin    = !!process.env.DISABLE_MIN || false;
var enableDocs    = !!process.env.ENABLE_DOCS || false;

var enableTreeDebugging = !!process.env.ENABLE_TREE_DEBUGGING || false;

// We must increase the maxTickDepth in order to prevent errors from node
process.maxTickDepth = 2000;

var disableSourceMaps = false;
if ('DISABLE_SOURCE_MAPS' in process.env) {
  disableSourceMaps = true;
}
if (!isDevelopment && !disableMin) {
  disableSourceMaps = true;
}

module.exports = {
  isDevelopment:       isDevelopment,
  disableJSHint:       disableJSHint,
  disableJSCS:         disableJSCS,
  disableMin:          disableMin,
  enableDocs:          enableDocs,
  enableTreeDebugging: enableTreeDebugging,
  disableSourceMaps:   disableSourceMaps,
};
