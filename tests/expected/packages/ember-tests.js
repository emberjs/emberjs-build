
(function() {

define("ember-metal.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('ember-metal.js should pass jshint', function() { 
      ok(true, 'ember-metal.js should pass jshint.'); 
    });
  });
define("ember-metal/alias.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal');
    test('ember-metal/alias.js should pass jshint', function() { 
      ok(true, 'ember-metal/alias.js should pass jshint.'); 
    });
  });
define("ember-metal/array.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal');
    test('ember-metal/array.js should pass jshint', function() { 
      ok(true, 'ember-metal/array.js should pass jshint.'); 
    });
  });
define("ember-metal/binding.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal');
    test('ember-metal/binding.js should pass jshint', function() { 
      ok(true, 'ember-metal/binding.js should pass jshint.'); 
    });
  });
define("ember-metal/streams/simple.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal/streams');
    test('ember-metal/streams/simple.js should pass jshint', function() { 
      ok(true, 'ember-metal/streams/simple.js should pass jshint.'); 
    });
  });
define("ember-metal/tests/alias_test",
  ["ember-metal/alias","ember-metal/properties","ember-metal/property_get","ember-metal/property_set","ember-metal/utils","ember-metal/watching","ember-metal/observer"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__) {
    "use strict";
    // jshint ignore: start
    var alias = __dependency1__["default"];
    var defineProperty = __dependency2__.defineProperty;
    var get = __dependency3__.get;
    var set = __dependency4__.set;
    var meta = __dependency5__.meta;
    var isWatching = __dependency6__.isWatching;
    var addObserver = __dependency7__.addObserver;
    var removeObserver = __dependency7__.removeObserver;

    QUnit.module('ember-metal/alias');

    test('should proxy get to alt key');
  });
define("ember-metal/tests/alias_test.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal/tests');
    test('ember-metal/tests/alias_test.js should pass jshint', function() { 
      ok(true, 'ember-metal/tests/alias_test.js should pass jshint.'); 
    });
  });
define("ember-metal/tests/array_test",
  ["ember-metal/alias","ember-metal/properties","ember-metal/property_get","ember-metal/property_set","ember-metal/utils","ember-metal/watching","ember-metal/observer"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__) {
    "use strict";
    // jshint ignore: start
    var alias = __dependency1__["default"];
    var defineProperty = __dependency2__.defineProperty;
    var get = __dependency3__.get;
    var set = __dependency4__.set;
    var meta = __dependency5__.meta;
    var isWatching = __dependency6__.isWatching;
    var addObserver = __dependency7__.addObserver;
    var removeObserver = __dependency7__.removeObserver;

    QUnit.module('ember-metal/array');

    test('should proxy get to alt key');
  });
define("ember-metal/tests/array_test.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal/tests');
    test('ember-metal/tests/array_test.js should pass jshint', function() { 
      ok(true, 'ember-metal/tests/array_test.js should pass jshint.'); 
    });
  });
define("ember-metal/tests/binding_test",
  ["ember-metal/alias","ember-metal/properties","ember-metal/property_get","ember-metal/property_set","ember-metal/utils","ember-metal/watching","ember-metal/observer"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__) {
    "use strict";
    // jshint ignore: start
    var alias = __dependency1__["default"];
    var defineProperty = __dependency2__.defineProperty;
    var get = __dependency3__.get;
    var set = __dependency4__.set;
    var meta = __dependency5__.meta;
    var isWatching = __dependency6__.isWatching;
    var addObserver = __dependency7__.addObserver;
    var removeObserver = __dependency7__.removeObserver;

    QUnit.module('ember-metal/binding');

    test('should proxy get to alt key', function() { });
  });
define("ember-metal/tests/binding_test.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal/tests');
    test('ember-metal/tests/binding_test.js should pass jshint', function() { 
      ok(true, 'ember-metal/tests/binding_test.js should pass jshint.'); 
    });
  });
define("ember-metal/tests/streams/simple_test",
  ["ember-metal/alias","ember-metal/properties","ember-metal/property_get","ember-metal/property_set","ember-metal/utils","ember-metal/watching","ember-metal/observer"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__) {
    "use strict";
    // jshint ignore: start
    var alias = __dependency1__["default"];
    var defineProperty = __dependency2__.defineProperty;
    var get = __dependency3__.get;
    var set = __dependency4__.set;
    var meta = __dependency5__.meta;
    var isWatching = __dependency6__.isWatching;
    var addObserver = __dependency7__.addObserver;
    var removeObserver = __dependency7__.removeObserver;

    QUnit.module('ember-metal/streams/simple');

    test('should proxy get to alt key');
  });
define("ember-metal/tests/streams/simple_test.jshint",
  [],
  function() {
    "use strict";
    module('JSHint - ember-metal/tests/streams');
    test('ember-metal/tests/streams/simple_test.js should pass jshint', function() { 
      ok(true, 'ember-metal/tests/streams/simple_test.js should pass jshint.'); 
    });
  });
})();
