'use strict';

module.exports = function(babel) {
  var t = babel.types;

  return new babel.Plugin('define-to-enifed', {
    visitor: {
      CallExpression: function(node){
        if (t.isIdentifier(node.callee, {name: 'define'})){
          node.callee = t.identifier('enifed');
        }
      },
      BlockStatement: function(){
        this.skip();
      }
    }
  });
};
