'use strict';

var chai = require('chai');
var path = require('path');
var expect = chai.expect;
var broccoli = require('broccoli');

chai.use(require('chai-fs'));

var readContent = require('../helpers/file');
var transpileES6 = require('../../lib/utils/transpile-es6');
var transpileFixtures = path.join(__dirname, '..', 'fixtures', 'transpile-es6');

describe('transpileES6', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly replaces arrowFunctions', function() {
    var arrowFunctionFixture = path.join(transpileFixtures, 'arrow-functions');

    var tree = transpileES6(arrowFunctionFixture);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var filePath = results.directory + '/some-file.js';
        var fileContent = readContent(filePath);

        expect(fileContent).not.to.contain('=>');
      });
  });
});
