'use strict';

var vendoredPackage    = require('./vendored-package');
var htmlbarsPackage    = require('./htmlbars-package');
var vendoredES6Package = require('./es6-vendored-package');

var vendoredPackages;

module.exports = function getVendoredPackages() {
  if (!vendoredPackages) {
    vendoredPackages = {
      'loader':                vendoredPackage('loader'),
      'rsvp':                  vendoredES6Package('rsvp'),
      'backburner':            vendoredES6Package('backburner'),
      'router':                vendoredES6Package('router.js'),
      'route-recognizer':      vendoredES6Package('route-recognizer'),
      'dag-map':               vendoredES6Package('dag-map'),
      'morph':                 htmlbarsPackage('morph'),
      'htmlbars-compiler':     htmlbarsPackage('htmlbars-compiler'),
      'htmlbars-syntax':       htmlbarsPackage('htmlbars-syntax'),
      'simple-html-tokenizer': htmlbarsPackage('simple-html-tokenizer'),
      'htmlbars-test-helpers': htmlbarsPackage('htmlbars-test-helpers', { singleFile: true }),
      'htmlbars-util':         htmlbarsPackage('htmlbars-util')
    };
  }

  return vendoredPackages;
};
