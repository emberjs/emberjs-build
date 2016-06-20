enifed("some-file", [], function () {
  "use strict";

  function _defaults(obj, defaults) {
    var keys = Object.getOwnPropertyNames(defaults);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = Object.getOwnPropertyDescriptor(defaults, key);

      if (value && value.configurable && obj[key] === undefined) {
        Object.defineProperty(obj, key, value);
      }
    }

    return obj;
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var A = function () {
    function A() {
      _classCallCheck(this, A);
    }

    A.foo = function foo() {
      return "foo";
    };

    A.prototype.bar = function bar() {
      return "bar";
    };

    A.prototype.foobar = function foobar() {
      return this.constructor.foo() + this.bar();
    };

    return A;
  }();

  var B = function (_A) {
    _inherits(B, _A);

    function B() {
      _classCallCheck(this, B);

      return _possibleConstructorReturn(this, _A.apply(this, arguments));
    }

    B.prototype.baz = function baz() {
      return "baz";
    };

    B.prototype.foobarbaz = function foobarbaz() {
      return this.foobar() + this.baz();
    };

    return B;
  }(A);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvbWUtZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFBTSxDOzs7OztNQUNHLEcsa0JBQU07QUFDWCxhQUFPLEtBQVA7QUFDRCxLOztnQkFFRCxHLGtCQUFNO0FBQ0osYUFBTyxLQUFQO0FBQ0QsSzs7Z0JBRUQsTSxxQkFBUztBQUNQLGFBQU8sS0FBSyxXQUFMLENBQWlCLEdBQWpCLEtBQXlCLEtBQUssR0FBTCxFQUFoQztBQUNELEs7Ozs7O01BR0csQzs7Ozs7Ozs7O2dCQUNKLEcsa0JBQU07QUFDSixhQUFPLEtBQVA7QUFDRCxLOztnQkFFRCxTLHdCQUFZO0FBQ1YsYUFBTyxLQUFLLE1BQUwsS0FBZ0IsS0FBSyxHQUFMLEVBQXZCO0FBQ0QsSzs7O0lBUGEsQyIsImZpbGUiOiJzb21lLWZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBIHtcbiAgc3RhdGljIGZvbygpIHtcbiAgICByZXR1cm4gXCJmb29cIjtcbiAgfVxuXG4gIGJhcigpIHtcbiAgICByZXR1cm4gXCJiYXJcIjtcbiAgfVxuXG4gIGZvb2JhcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb28oKSArIHRoaXMuYmFyKCk7XG4gIH1cbn1cblxuY2xhc3MgQiBleHRlbmRzIEEge1xuICBiYXooKSB7XG4gICAgcmV0dXJuIFwiYmF6XCI7XG4gIH1cblxuICBmb29iYXJiYXooKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9vYmFyKCkgKyB0aGlzLmJheigpO1xuICB9XG59XG4iXX0=
