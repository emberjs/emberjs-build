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

  it('correctly handles let', function () {
    var letFixture = path.join(transpileFixtures, 'let-statement');

    var tree = transpileES6(letFixture);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var filePath = results.directory + '/application-instance.js';
        var fileContent = readContent(filePath);

        expect(fileContent).not.to.match(/register\([^\)]+nvironment\.default/);
      });
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

  describe('`conditional-use-strict` plugin', function() {
    var results;

    beforeEach(function() {
      var strictDirectiveFixture = path.join(transpileFixtures, 'conditional-use-strict');

      var tree = transpileES6(strictDirectiveFixture);

      builder = new broccoli.Builder(tree);

      return builder.build().then(function(r) {
        results = r;
      });
    });

    it('adds `use strict` if it is not present', function() {
      expect(file(results.directory + '/without-directive.js'))
        .to.equal(file(transpileExpected + '/conditional-use-strict/without-directive.js').content.trim());
    });

    it('keeps `no use strict` if it is present', function() {
      expect(file(results.directory + '/with-no-use-strict-directive.js'))
        .to.equal(file(transpileExpected + '/conditional-use-strict/with-no-use-strict-directive.js').content.trim());
    });

    it('keeps `use strict` if it is present', function() {
      expect(file(results.directory + '/with-use-strict-directive.js'))
        .to.equal(file(transpileExpected + '/conditional-use-strict/with-use-strict-directive.js').content.trim());
    });
  });
});
