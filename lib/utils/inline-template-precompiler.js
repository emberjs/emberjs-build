'use strict';

/*jshint node: true */

var Filter = require('broccoli-filter');
var getVersion = require('git-repo-version');

EmberTemplatePrecompiler.prototype = Object.create(Filter.prototype);
EmberTemplatePrecompiler.prototype.constructor = EmberTemplatePrecompiler;
function EmberTemplatePrecompiler (inputTree, options) {
  if (!(this instanceof EmberTemplatePrecompiler)) {
    return new EmberTemplatePrecompiler(inputTree, options);
  }

  options = options || {};
  this.inputTree = inputTree;
  this.htmlbarsCompiler = options.htmlbars.compileSpec;
}

EmberTemplatePrecompiler.prototype.extensions = ['hbs'];
EmberTemplatePrecompiler.prototype.targetExtension = 'js';

EmberTemplatePrecompiler.prototype.read = function() {
  this.revision = 'Ember@' + getVersion();

  return Filter.prototype.read.apply(this, arguments);
};

EmberTemplatePrecompiler.prototype.processString = function(content) {
  var compileOptions = {
    revision: this.revision
  };

  var compiledSpec = this.htmlbarsCompiler(content, compileOptions);
  var template = 'import template from "ember-template-compiler/system/template";\n';
  template += 'export default template(' + compiledSpec + ');';

  return template;
};

module.exports = EmberTemplatePrecompiler;
