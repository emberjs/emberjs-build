'use strict';

var path = require('path');

function enifedModuleFormatter(babel) {
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
}

enifedModuleFormatter.baseDir = function() {
  return path.join(__dirname, '..', '..');
};

enifedModuleFormatter.cacheKey = function() {
  return 'define-to-enifed';
};

module.exports = enifedModuleFormatter;
