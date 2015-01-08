emberjs-build
=============

[![Build Status](https://travis-ci.org/emberjs/emberjs-build.svg)](https://travis-ci.org/emberjs/emberjs-build)

[![Code Climate](https://codeclimate.com/github/emberjs/emberjs-build/badges/gpa.svg)](https://codeclimate.com/github/emberjs/emberjs-build)

Build pipeline for [Ember.js](http://emberjs.com)

Usage
=====

Within your `Brocfile.js`, require and invoke `EmberBuild`.

```javascript
// Brocfile.js

// make sure your package file resembles this:
// https://github.com/emberjs/ember.js/blob/master/lib/packages.js
var packages   = require('./lib/packages');
var EmberBuild = require('emberjs-build');

var emberBuild = new EmberBuild({
  packages: packages
});

module.exports = emberBuild.getDistTrees();
```
