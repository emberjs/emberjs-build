'use strict';

var vendoredPackage    = require('./lib/vendored-package');
var es6VendoredPackage = require('./lib/es6-vendored-package');
var htmlbarsPackage    = require('./lib/htmlbars-package');
var defeatureifyConfig = require('./lib/defeatureify-config');

module.exports = {
  vendoredPackage:    vendoredPackage,
  es6VendoredPackage: es6VendoredPackage,
  htmlbarsPackage:    htmlbarsPackage,
  defeatureifyConfig: defeatureifyConfig
};
