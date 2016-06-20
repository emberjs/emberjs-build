'use strict';

var path = require('path');

function enifedModuleFormatter(babel) {
  var t = babel.types;

  return {
    visitor: {
      CallExpression: function(path) {
        var node = path.node;
        if (t.isIdentifier(node.callee, {name: 'define'})){
          node.callee = t.identifier('enifed');
        }
      },
      BlockStatement: function(path) {
        path.skip();
      }
    }
  };
}

enifedModuleFormatter.baseDir = function() {
  return path.join(__dirname, '..', '..');
};

module.exports = enifedModuleFormatter;
