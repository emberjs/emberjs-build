'use strict';

var Funnel = require('broccoli-funnel');

module.exports = function getEmberDevTestHelpers() {
  return new Funnel('bower_components/ember-dev/addon', {
    include: [ /js$/ ],
    destDir: '/ember-dev'
  });
};
