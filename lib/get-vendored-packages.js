'use strict';

var vendoredPackage    = require('./vendored-package');
var htmlbarsPackage    = require('./htmlbars-package');
var vendoredES6Package = require('./es6-vendored-package');

/*
  For use in dependency resolution. If referenced from within
  `lib/pacakage.js` under the vendorRequirements property will resolve
  dependency graph on behalf of requiring library.

  ```
    'ember-metal': {trees: null,  vendorRequirements: ['backburner']}
  ```
*/
var handlebarsConfig = {
  libPath:  'node_modules/handlebars/dist',
  mainFile: 'handlebars.amd.js'
};

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
      'htmlbars-util':         htmlbarsPackage('htmlbars-util'),
      'handlebars':            vendoredPackage('handlebars', handlebarsConfig)
    };
  }

  return vendoredPackages;
};
