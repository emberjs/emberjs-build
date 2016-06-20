'use strict';

module.exports = function(babel) {
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
};
