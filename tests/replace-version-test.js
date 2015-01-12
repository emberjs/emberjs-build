'use strict';

var chai      = require('chai');
var path      = require('path');
var expect    = chai.expect;
var broccoli  = require('broccoli');
var walkSync  = require('walk-sync');
var pickFiles = require('broccoli-static-compiler');

var readContent    = require('./helpers/file');
var replaceVersion = require('../lib/utils/replace-version');

var filePath;

var fixturesPath = path.join(__dirname, './fixtures/versioned-files');

describe('replace-version', function() {
  var builder;

  var trees = pickFiles(fixturesPath, {
    srcDir: '/',
    files: ['**/*.js', '**/*.json'],
    destDir: '/'
  });

  afterEach(function() {
    if (builder) {
      return builder.cleanup();
    }
  });

  it('correctly replaces version', function() {
    var replacedTree = replaceVersion(trees, {
      version: '0.0.13'
    });

    builder = new broccoli.Builder(replacedTree);

    return builder.build()
      .then(function(results) {
        var files = walkSync(results.directory);

        for (var i = 1, l = files.length; i < l; i++) {
          filePath = path.join(results.directory, files[i]);
          expect(readContent(filePath)).to.have.string('0.0.13');
        }
      });
  });
});
