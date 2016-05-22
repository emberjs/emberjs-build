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
        expect(file(filePath)).not.to.contain('=>');
      });
  });

  it('correctly transpile classes', function() {
    var classesFixture = path.join(transpileFixtures, 'classes');

    var tree = transpileES6(classesFixture);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var filePath = results.directory + '/some-file.js';
        var f = file(filePath);

        expect(f).not.to.contain('class A');

        // Ensure Babel has inserted its class helpers
        // TODO: flip this assertion when switching to global helpers
        expect(f).to.contain('_inherits');
        expect(f).to.contain('_classCallCheck');

        // IE <= 10 does not support __proto__, so we cannot use it for statics
        expect(f).not.to.contain('__proto__');
        expect(f).to.contain('_defaults');
      });
  });

  it('does not add `use strict` if `no use strict` directive is present', function() {
    var strictDirectiveFixture = path.join(transpileFixtures, 'conditional-use-strict');

    var tree = transpileES6(strictDirectiveFixture);

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        expect(file(results.directory + '/without-directive.js'))
          .to.match(/['"]use strict['"];/);

        expect(file(results.directory + '/with-no-use-strict-directive.js'))
          .not.to.match(/['"]use strict['"];/);

        expect(file(results.directory + '/with-no-use-strict-directive.js'))
          .to.match(/['"]no use strict['"];/);

        expect(file(results.directory + '/with-use-strict-directive.js'))
          .to.match(/['"]use strict['"];/);
      });
  });
});
