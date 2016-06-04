'use strict';

var lint = require('mocha-eslint');

lint(['.'], {
  timeout: 10000
});
