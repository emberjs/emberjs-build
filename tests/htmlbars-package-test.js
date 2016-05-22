'use strict';

var path     = require('path');
var chai     = require('chai');
var expect   = chai.expect;
var walkSync = require('walk-sync');
var broccoli = require('broccoli');
var chaiFiles = require('chai-files');
var file      = chaiFiles.file;

chai.use(chaiFiles);

var htmlbarsPackage = require('../lib/htmlbars-package');
var testLibPath     = 'tests/fixtures/htmlbars/dist/es6/';

describe('htmlbars-package', function() {
  var builder;

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  /*
    Input:
      morph/
        dom-helper/
        dom-helper.js
        morph.js

    Output:
      morph/
        dom-helper/
        dom-helper.js
        morph.js
      morph.js
  */
  it('correctly creates a htmlbars tree', function() {
    var expected = [
      'htmlbars-util/',
      'htmlbars-util/safe-string.js',
      'htmlbars-util.js'
    ];

    var tree = htmlbarsPackage('htmlbars-util', {
      libPath: testLibPath
    });

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(expected);
      });
  });

  /*
    Input:
      htmlbars-test-helpers.js

    Output:
      htmlbars-test-helpers.js
  */
  it('correctly creates a htmlbars tree when singleFile is true', function() {
    var tree = htmlbarsPackage('htmlbars-test-helpers', {
      singleFile: true,
      libPath: testLibPath
    });

    builder = new broccoli.Builder(tree);

    return builder.build()
      .then(function(results) {
        var outputPath = results.directory;

        expect(walkSync(outputPath)).to.deep.equal(['htmlbars-test-helpers.js']);

        var filePath = path.join(outputPath, 'htmlbars-test-helpers.js');

        expect(file(filePath)).to.include('function bar()');
      });
  });
});
