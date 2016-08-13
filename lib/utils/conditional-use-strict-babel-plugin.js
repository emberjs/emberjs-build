'use strict';

var path = require('path');
var THIS_BREAK_KEYS = ['FunctionExpression', 'FunctionDeclaration', 'ClassProperty'];

function conditionalUseStrict(babel) {
  var t = babel.types;

  function isStrictDirective(node) {
    if (!t.isLiteral(node)) {
      return false;
    }

    var value;
    if (node.raw && node.rawValue === node.value) {
      value = node.rawValue;
    } else {
      value = node.value;
    }

    return value === 'use strict' || value === 'no use strict';
  }

  return new babel.Plugin('conditional-use-strict', {
    visitor: {
      Program: {
        enter: function(program) {
          var first = program.body[0];

          var directive;
          if (t.isExpressionStatement(first) && isStrictDirective(first.expression)) {
            directive = first;
          } else {
            directive = t.expressionStatement(t.literal('use strict'));
            this.unshiftContainer('body', directive);
            if (first) {
              directive.leadingComments = first.leadingComments;
              first.leadingComments = [];
            }
          }
          directive._blockHoist = Infinity;
        }
      },

      ThisExpression: function() {
        var foundParent = this.findParent(function(path) {
          return !path.is('shadow') && THIS_BREAK_KEYS.indexOf(path.type) >= 0;
        });

        if (!foundParent){
          return t.identifier('undefined');
        }
      }
    }
  });
}

conditionalUseStrict.baseDir = function() {
  return path.join(__dirname, '..', '..');
};

module.exports = conditionalUseStrict;
