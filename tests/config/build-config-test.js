'use strict';

var expect = require('chai').expect;

var buildConfig = require('../../lib/config/build-config');

describe('build config', function() {
  it('returns correct default configuration object', function() {
    expect(buildConfig).to.deep.equal({
      isDevelopment:       true,
      disableJSHint:       false,
      disableJSCS:         false,
      disableMin:          false,
      enableDocs:          false,
      disableDefeatureify: true,
      disableDerequire:    false,
      enableTreeDebugging: false,
      disableSourceMaps:   false,
    });
  });

  it('sets maxTickDepth to 2000', function() {
    expect(process.maxTickDepth).to.equal(2000);
  });
});
