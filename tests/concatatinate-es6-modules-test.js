'use strict';

var chai     = require('chai');
var path     = require('path');
var expect   = chai.expect;
var Funnel   = require('broccoli-funnel');
var broccoli = require('broccoli');
var walkSync = require('walk-sync');

chai.use(require('chai-fs'));

var readContent           = require('./helpers/file');
var concatenateES6Modules = require('../lib/concatenate-es6-modules');

var generatorsPath     = path.join(__dirname, './fixtures/generators');
var fixturesTestPath   = path.join(__dirname, './fixtures/concat-tests');
var fixturesLoaderPath = path.join(__dirname, './fixtures/loader');

describe('concatenate-es6-modules', function() {
  var builder;

  var testTree = new Funnel(fixturesTestPath, {
    includes: [ /js$/ ],
    destDir: '/'
  });

  var loaderTree = new Funnel(fixturesLoaderPath, {
    files: ['loader.js'],
    destDir: '/'
  });

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly concats test tree into one file properly', function() {
    var inputFiles = walkSync(fixturesTestPath)
      .filter(function(relativePath) {
        return relativePath.match(/\.js$/);
      });

    var compiledTests = concatenateES6Modules(testTree, {
      es3Safe:   false,
      derequire: false,
      includeLoader: true,
      destFile: '/ember-tests.js',
      generators: generatorsPath,
      loader:     loaderTree
    });

    builder = new broccoli.Builder(compiledTests);

    return builder.build()
      .then(function(results) {
        var filePath = results.directory + '/ember-tests.js';
        var fileContent = readContent(filePath);

        expect(filePath).to.be.a.path('file exists');
        inputFiles.forEach(function(relativePath) {
          expect(fileContent).to.contain(relativePath.slice(0, -3));
        });
      });
  });
});
