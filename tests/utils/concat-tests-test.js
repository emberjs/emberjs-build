'use strict';

var chai     = require('chai');
var path     = require('path');
var expect   = chai.expect;
var broccoli = require('broccoli');

chai.use(require('chai-fs'));

var readContent   = require('../helpers/file');
var getES6Package = require('../../lib/get-es6-package');
var concatES6     = require('../../lib/utils/concat-es6');

var fixtureLibPath  = path.join(__dirname, 'fixtures/packages/ember-metal/lib');
var fixtureTestPath = path.join(__dirname, 'fixtures/packages/ember-metal/tests');

describe('concat-es6', function() {
  var builder;

  var fullTree = getES6Package('ember-metal', {
    libPath:  fixtureLibPath,
    testPath: fixtureTestPath
  });

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly concats test tree into one file properly', function() {
    var expectedFilePath = path.join(__dirname, '../expected/packages/ember-tests.js');
    var expectedContent  = readContent(expectedFilePath);

    var compiledTests = concatES6(fullTree.tests, {
      es3Safe:   false,
      derequire: false,
      includeLoader: true,
      inputFiles: ['**/*.js'],
      destFile: '/ember-tests.js'
    });

    builder = new broccoli.Builder(compiledTests);

    return builder.build()
      .then(function(results) {
        var filePath = results.directory + '/ember-tests.js';
        var fileContent = readContent(filePath);

        expect(filePath).to.be.a.path('file exists');
        expect(fileContent).to.equal(expectedContent);
      });
  });
});
