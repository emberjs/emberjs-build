'use strict';

var fs = require('fs');

function cleanContent(str) {
  if (!str) { return str; }

  return str.replace(/\n/g, '');
}

function readContent(path) {
  if (!path) { return path; }

  return cleanContent(fs.readFileSync(path, 'utf8'));
}

module.exports = readContent;
