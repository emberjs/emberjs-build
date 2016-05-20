'use strict';

/*jshint node: true */

var Filter = require('broccoli-persistent-filter');
var compile = require('glimmer-engine-precompiler');

GlimmerTemplatePrecompiler.prototype = Object.create(Filter.prototype);

function GlimmerTemplatePrecompiler (inputTree) {
  if (!(this instanceof GlimmerTemplatePrecompiler)) {
    return new GlimmerTemplatePrecompiler(inputTree);
  }

  Filter.call(this, inputTree, {});

  this.inputTree = inputTree;
}

GlimmerTemplatePrecompiler.prototype.extensions = ['hbs'];
GlimmerTemplatePrecompiler.prototype.targetExtension = 'js';

GlimmerTemplatePrecompiler.prototype.baseDir = function() {
  return __dirname;
};

GlimmerTemplatePrecompiler.prototype.processString = function(content) {
  var compiledSpec = compile(content);
  var template = 'import { template } from "ember-glimmer-template-compiler";\n';
  template += 'export default template(' + JSON.stringify(compiledSpec) + ');';

  return template;
};

module.exports = GlimmerTemplatePrecompiler;
