'use strict';

var expect = require('chai').expect;

var defeatureifyConfig = require('../../lib/config/defeatureify-config');
var debugStatements = [
  'Ember.warn',
  'Ember.assert',
  'Ember.deprecate',
  'Ember.debug',
  'Ember.Logger.info',
  'Ember.runInDebug'
];

describe('defeatureify-config', function() {
  it('returns correct configuration object', function() {
    var config = defeatureifyConfig();

    expect(config).to.deep.equal({
      enabled: { 'foo-bar': null },
      debugStatements: debugStatements,
      namespace: undefined,
      enableStripDebug: false
    });
  });

  it('returns correct configuration object when `options` are passed in', function() {
    var config = defeatureifyConfig({
      stripDebug:  true,
      environment: 'production'
    });

    expect(config).to.deep.equal({
      enabled: { 'foo-bar': null },
      debugStatements: debugStatements,
      namespace: undefined,
      enableStripDebug: true
    });
  });
});
