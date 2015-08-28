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

  it('does not add `use strict` if `no use strict` directive is present', function() {
    var strictDirectiveFixture = path.join(transpileFixtures, 'conditional-use-strict');

    var tree = transpileES6(strictDirectiveFixture);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        expect(
          readContent(results.directory + '/without-directive.js')
        ).to.match(/['"]use strict['"];/);

        expect(
          readContent(results.directory + '/with-no-use-strict-directive.js')
        ).not.to.match(/['"]use strict['"];/);

        expect(
          readContent(results.directory + '/with-no-use-strict-directive.js')
        ).to.match(/['"]no use strict['"];/);

        expect(
          readContent(results.directory + '/with-use-strict-directive.js')
        ).to.match(/['"]use strict['"];/);
      });
  });
});
