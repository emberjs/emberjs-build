'use strict';

var fs = require('fs');
var jscsTree   = require('broccoli-jscs');

var originalProcessString = jscsTree.prototype.processString;

var jscsConfig = {};
if (fs.existsSync('.jscsrc')) {
  jscsConfig = JSON.parse(fs.readFileSync('.jscsrc', { encoding: 'utf8' }));
}

jscsTree.prototype.processString = function(content, relativePath) {
  if (jscsConfig.excludeFiles && jscsConfig.excludeFiles.indexOf(relativePath) > -1) {
    return '';
  }

  return originalProcessString.call(this, content, relativePath);
};

module.exports = jscsTree;
