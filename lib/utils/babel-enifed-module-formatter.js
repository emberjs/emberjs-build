'use strict';

var path = require('path');

function enifedModuleFormatter(babel) {
  var t = babel.types;

  return {
    name: 'define-to-enifed',
    visitor: {
      Program: {
        exit: function(path) {
          if  (path.node.body.length > 0) {
            var defineExpression = path.node.body[0].expression;
            if (defineExpression) {
              var define = defineExpression.callee;
              var deps = defineExpression.arguments[1];

              if (t.isIdentifier(define, { name: 'define' })) {
                path.node.body[0].expression.callee = t.identifier('enifed');
                if (deps.elements.length === 0) {
                  path.node.body[0].expression.arguments[1].elements.push(t.stringLiteral('exports'));
                  path.node.body[0].expression.arguments[2].params.push(t.identifier('exports'));
                }
              }
            }
          }
        }
      }
    }
  };
}

enifedModuleFormatter.baseDir = function() {
  return path.join(__dirname, '..', '..');
};

enifedModuleFormatter.cacheKey = function() {
  return 'define-to-enifed';
};

module.exports = enifedModuleFormatter;
