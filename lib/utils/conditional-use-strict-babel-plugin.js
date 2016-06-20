'use strict';

var path = require('path');
var THIS_BREAK_KEYS = ['FunctionExpression', 'FunctionDeclaration', 'ClassProperty'];

function conditionalUseStrict(babel) {
  var t = babel.types;

  return {
    visitor: {
      Program: {
        enter: function(path, state) {
          state.strictDirectives = [];
          state.nonStrictDirectives = [];
        },

        exit: function(path, state) {
          if (state.nonStrictDirectives.length !== 0) {
            state.strictDirectives.forEach(function(path) {
              path.remove();
            });
          } else if (state.strictDirectives.length === 0) {
            path.unshiftContainer('directives', t.directive(t.directiveLiteral('use strict')));
          }
        },
      },

      Directive: function(path, state) {
        if (path.node.value.value === 'use strict') {
          state.strictDirectives.push(path);
        } else if (path.node.value.value === 'no use strict') {
          state.nonStrictDirectives.push(path);
        }
      },
    }
  };
}

conditionalUseStrict.baseDir = function() {
  return path.join(__dirname, '..', '..');
};

module.exports = conditionalUseStrict;
