enifed("some-file", ["exports"], function (exports) {
  "use strict";

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var A = (function () {
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
  })();

  var B = (function (_A) {
    _inherits(B, _A);

    function B() {
      _classCallCheck(this, B);

      _A.apply(this, arguments);
    }

    B.prototype.baz = function baz() {
      return "baz";
    };

    B.prototype.foobarbaz = function foobarbaz() {
      return this.foobar() + this.baz();
    };

    return B;
  })(A);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvbWUtZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7TUFBTSxDQUFDO2FBQUQsQ0FBQzs0QkFBRCxDQUFDOzs7QUFBRCxLQUFDLENBQ0UsR0FBRyxHQUFBLGVBQUc7QUFDWCxhQUFPLEtBQUssQ0FBQztLQUNkOztBQUhHLEtBQUMsV0FLTCxHQUFHLEdBQUEsZUFBRztBQUNKLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7O0FBUEcsS0FBQyxXQVNMLE1BQU0sR0FBQSxrQkFBRztBQUNQLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDNUM7O1dBWEcsQ0FBQzs7O01BY0QsQ0FBQztjQUFELENBQUM7O2FBQUQsQ0FBQzs0QkFBRCxDQUFDOzs7OztBQUFELEtBQUMsV0FDTCxHQUFHLEdBQUEsZUFBRztBQUNKLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7O0FBSEcsS0FBQyxXQUtMLFNBQVMsR0FBQSxxQkFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNuQzs7V0FQRyxDQUFDO0tBQVMsQ0FBQyIsImZpbGUiOiJzb21lLWZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBIHtcbiAgc3RhdGljIGZvbygpIHtcbiAgICByZXR1cm4gXCJmb29cIjtcbiAgfVxuXG4gIGJhcigpIHtcbiAgICByZXR1cm4gXCJiYXJcIjtcbiAgfVxuXG4gIGZvb2JhcigpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5mb28oKSArIHRoaXMuYmFyKCk7XG4gIH1cbn1cblxuY2xhc3MgQiBleHRlbmRzIEEge1xuICBiYXooKSB7XG4gICAgcmV0dXJuIFwiYmF6XCI7XG4gIH1cblxuICBmb29iYXJiYXooKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9vYmFyKCkgKyB0aGlzLmJheigpO1xuICB9XG59XG4iXX0=
