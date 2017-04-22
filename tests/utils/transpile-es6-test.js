'use strict';

var chai = require('chai');
var path = require('path');
var expect = chai.expect;
var broccoli = require('broccoli');
var chaiFiles = require('chai-files');
var file = chaiFiles.file;

chai.use(chaiFiles);

var transpileES6 = require('../../lib/utils/transpile-es6');
var transpileFixtures = path.join(__dirname, '..', 'fixtures', 'transpile-es6');
var transpileExpected = path.join(__dirname, '..', 'expected', 'transpile-es6');

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

    return builder.build().then(function(results) {
      expect(file(results.directory + '/some-file.js'))
        .to.equal(file(transpileExpected + '/arrow-functions/some-file.js').content.trim());
    });
  });

  it('correctly transpile classes', function() {
    var classesFixture = path.join(transpileFixtures, 'classes');

    var tree = transpileES6(classesFixture);

    builder = new broccoli.Builder(tree);

    return builder.build().then(function(results) {
      expect(file(results.directory + '/some-file.js'))
        .to.equal(file(transpileExpected + '/classes/some-file.js').content.trim());
    });
  });
});
