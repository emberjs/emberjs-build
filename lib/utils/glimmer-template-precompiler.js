'use strict';

var Filter = require('broccoli-persistent-filter');

GlimmerTemplatePrecompiler.prototype = Object.create(Filter.prototype);

function GlimmerTemplatePrecompiler (inputTree, options) {
  if (!(this instanceof GlimmerTemplatePrecompiler)) {
    return new GlimmerTemplatePrecompiler(inputTree, options);
  }

  Filter.call(this, inputTree, {});

  this.inputTree = inputTree;
  if (!options.glimmer) {
    throw new Error('No glimmer option provided!');
  }
  this.compile = options.glimmer.compileSpec;
}

GlimmerTemplatePrecompiler.prototype.extensions = ['hbs'];
GlimmerTemplatePrecompiler.prototype.targetExtension = 'js';

GlimmerTemplatePrecompiler.prototype.baseDir = function() {
  return __dirname;
};

GlimmerTemplatePrecompiler.prototype.processString = function(content, relativePath) {
  var compiledSpec = this.compile(content, { moduleName: relativePath });
  var template = 'import { template } from "ember-glimmer";\n';
  template += 'export default template(' + JSON.stringify(compiledSpec) + ');';

  return template;
};

module.exports = GlimmerTemplatePrecompiler;
