'use strict';

var chai     = require('chai');
var path     = require('path');
var expect   = chai.expect;
var Funnel   = require('broccoli-funnel');
var broccoli = require('broccoli');
var chaiFiles = require('chai-files');
var file     = chaiFiles.file;

chai.use(chaiFiles);

var concatenateES6Modules = require('../lib/concatenate-es6-modules');

var generatorsPath     = path.join(__dirname, './fixtures/generators');
var fixturesTestPath   = path.join(__dirname, './fixtures/concat-tests');
var expectedTestPath   = path.join(__dirname, './expected/concat-tests');
var fixturesLoaderPath = path.join(__dirname, './fixtures/loader');

describe('concatenate-es6-modules', function() {
  var builder;

  var testTree = new Funnel(fixturesTestPath, {
    includes: [ /js$/ ],
    destDir: '/'
  });

  var loaderTree = new Funnel(fixturesLoaderPath, {
    files: ['loader/index.js'],
    destDir: '/'
  });

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly concats test tree into one file properly', function() {
    var compiledTests = concatenateES6Modules(testTree, {
      es3Safe:   false,
      includeLoader: true,
      destFile: '/ember-tests.js',
      generators: generatorsPath,
      loader:     loaderTree,
      version: 'foo'
    });

    builder = new broccoli.Builder(compiledTests);

    return builder.build().then(function(results) {
      expect(file(results.directory + '/ember-tests.js'))
        .to.equal(file(expectedTestPath + '/ember-tests.js'));
    });
  });
});
