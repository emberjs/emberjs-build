'use strict';

var path = require('path');
var fs = require('fs');
var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var typescript = require('broccoli-typescript-compiler').typescript;

module.exports = function typeScriptCompiler(tree, packagePath) {
  var ts = getTsTree(tree, packagePath);
  var tsconfig = tsconfigForPackage(packagePath);
  var compiledTs = compileTs(ts, tsconfig);
  var js = selectJsFromTree(tree);

  return mergeTrees([compiledTs, js]);
};

function getTsTree(tree, packagePath) {
  var libs = funnel(findLib('typescript'), {
    include: ['lib.*.d.ts']
  });

  var nodeModules = funnel(path.join(packagePath, '../../node_modules'), {
    destDir: 'node_modules'
  });

  return mergeTrees([tree, libs, nodeModules]);
}

function findLib(name) {
  return path.resolve(path.dirname(require.resolve(name)));
}

function tsconfigForPackage(packagePath) {
  var filePath = path.join(packagePath, 'tsconfig.json');

  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath));
  }

  throw Error('Could not find a tsconfig.json at ' + filePath);
}

function selectJsFromTree(tree) {
  return funnel(tree, {
    include: [ /js$/ ]
  });
}

function compileTs(ts, tsconfig) {
  return typescript(ts, {
    tsconfig: tsconfig,
    annotation: 'compiled typescript'
  });
}
