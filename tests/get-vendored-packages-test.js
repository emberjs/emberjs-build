'use strict';

var getVendoredPackages = require('../lib/get-vendored-packages');

var expect = require('chai').expect;

var vendoredPackages = [
  'loader',
  'rsvp',
  'backburner',
  'router',
  'route-recognizer',
  'dag-map',
  'morph',
  'htmlbars-compiler',
  'htmlbars-syntax',
  'simple-html-tokenizer',
  'htmlbars-test-helpers',
  'htmlbars-util',
  'handlebars'
];

describe('get-vendored-packages', function() {
  it('returns correct vendored packages', function() {
    var actualPackages = getVendoredPackages();

    vendoredPackages.forEach(function(packageName) {
      expect(actualPackages.hasOwnProperty(packageName)).to.be.true();
    });
  });
});
