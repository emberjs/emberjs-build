'use strict';

// To create fast production builds (without ES3 support, minification, derequire, or JSHint)
// run the following:
//
// DISABLE_ES3=true DISABLE_JSHINT=true DISABLE_MIN=true DISABLE_DEREQUIRE=true ember serve --environment=production

var env           = process.env.EMBER_ENV || 'development';
var isDevelopment = env === 'development';

var disableJSHint = !!process.env.DISABLE_JSHINT || false;
var disableJSCS   = !!process.env.DISABLE_JSCS || false;
var disableES3    = !!process.env.DISABLE_ES3 || false;
var disableMin    = !!process.env.DISABLE_MIN || false;
var enableDocs    = !!process.env.ENABLE_DOCS || false;

var disableDefeatureify;

var disableDerequire = !!process.env.DISABLE_DEREQUIRE || false;

// We must increase the maxTickDepth in order to prevent errors from node
process.maxTickDepth = 2000;

if (process.env.DEFEATUREIFY === 'true') {
  disableDefeatureify = false;
} else {
  disableDefeatureify = isDevelopment;
}

module.exports = {
  isDevelopment:       isDevelopment,
  disableJSHint:       disableJSHint,
  disableJSCS:         disableJSCS,
  disableES3:          disableES3,
  disableMin:          disableMin,
  enableDocs:          enableDocs,
  disableDefeatureify: disableDefeatureify,
  disableDerequire:    disableDerequire
};
