'use strict';

var defeatureifyConfig     = require('./lib/defeatureify-config');
var buildConfig            = require('./lib/build-config');
var testConfigTree         = require('./lib/test-config-tree');
var getBowerTree           = require('./lib/bower-tree');
var getEmberDevTestHelpers = require('./lib/ember-dev-test-helpers');
var getVendoredPackages    = require('./lib/get-vendored-packages');
var getS3TestRunner        = require('./lib/s3-test-runner');

var vendoredPackage        = require('./lib/vendored-package');
var htmlbarsPackage        = require('./lib/htmlbars-package');
var vendoredES6Package     = require('./lib/es6-vendored-package');

module.exports = {
  defeatureifyConfig:     defeatureifyConfig,
  buildConfig:            buildConfig,
  getVendoredPackages:    getVendoredPackages,
  getTestConfigTree:      testConfigTree,
  getBowerTree:           getBowerTree,
  getEmberDevTestHelpers: getEmberDevTestHelpers,
  getS3TestRunner:        getS3TestRunner,
  vendoredPackage:        vendoredPackage,
  htmlbarsPackage:        htmlbarsPackage,
  vendoredES6Package:     vendoredES6Package
};
