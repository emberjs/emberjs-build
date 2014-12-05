'use strict';

var expect = require('chai').expect;

var buildConfig = require('../lib/build-config');

describe('build config', function() {
  it('returns correct default configuration object', function() {
    expect(buildConfig).to.deep.equal({
      isDevelopment:       true,
      disableJSHint:       false,
      disableES3:          false,
      disableMin:          false,
      enableDocs:          false,
      disableDefeatureify: true,
      disableDerequire:    false
    });
  });

  it('sets maxTickDepth to 2000', function() {
    expect(process.maxTickDepth).to.equal(2000);
  });
});
