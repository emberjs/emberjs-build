'use strict';

var path = require('path');
var fs = require('fs');
var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var typescript = require('broccoli-typescript-compiler').typescript;

module.exports = function typescriptCompiler(tree, packageName) {
  let ts = getTsTree(tree);
  let tsconfig = tsconfigForPackage(packageName);

  return typescript(ts, {
    tsconfig: tsconfig,
    annotation: 'compiled typescript'
  });
};

function getTsTree(tree) {
  var libs = funnel(findLib('typescript'), {
    include: ['lib.*.d.ts']
  });

  return funnel(mergeTrees([tree, libs]), {
    include: ['**/*.ts'],
    annotation: 'raw typescript'
  });
}

function findLib(name, libPath) {
  return path.resolve(path.dirname(require.resolve(name)), libPath || '.');
}

function tsconfigForPackage(packageName) {
  return JSON.parse(fs.readFileSync(path.resolve('packages', packageName, 'tsconfig.json')));
}
