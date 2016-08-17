'use strict';

var vendoredPackage    = require('./vendored-package');
var htmlbarsPackage    = require('./htmlbars-package');
var vendoredES6Package = require('./es6-vendored-package');

var vendoredPackages;

module.exports = function getVendoredPackages() {
  if (!vendoredPackages) {
    vendoredPackages = {
      'external-helpers':      vendoredPackage('external-helpers'),
      'loader':                vendoredPackage('loader'),
      'rsvp':                  vendoredES6Package('rsvp'),
      'backburner':            vendoredES6Package('backburner'),
      'router':                vendoredES6Package('router.js'),
      'dag-map':               vendoredES6Package('dag-map'),
      'route-recognizer':      htmlbarsPackage('route-recognizer', { libPath: 'node_modules/route-recognizer/dist/es6/' }),
      'dom-helper':            htmlbarsPackage('dom-helper'),
      'morph-range':           htmlbarsPackage('morph-range'),
      'morph-attr':            htmlbarsPackage('morph-attr'),
      'htmlbars-compiler':     htmlbarsPackage('htmlbars-compiler'),
      'htmlbars-syntax':       htmlbarsPackage('htmlbars-syntax'),
      'simple-html-tokenizer': htmlbarsPackage('simple-html-tokenizer'),
      'htmlbars-test-helpers': htmlbarsPackage('htmlbars-test-helpers', { singleFile: true }),
      'htmlbars-util':         htmlbarsPackage('htmlbars-util')
    };
  }

  return vendoredPackages;
};
