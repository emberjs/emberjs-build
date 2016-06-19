'use strict';

var lint = require('mocha-eslint');

lint(['.'], {
  timeout: 20000
});
