'use strict';

var expect = require('chai').expect;

var defeatureifyConfig = require('../../lib/config/defeatureify-config');

describe('defeatureify-config', function() {
  it('returns correct configuration object', function() {
    var config = defeatureifyConfig();

    expect(config).to.deep.equal({
      enabled: { 'foo-bar': null },
      namespace: undefined
    });
  });

  it('returns correct configuration object when `options` are passed in', function() {
    var config = defeatureifyConfig({
      environment: 'production'
    });

    expect(config).to.deep.equal({
      enabled: { 'foo-bar': null },
      namespace: undefined
    });
  });
});
