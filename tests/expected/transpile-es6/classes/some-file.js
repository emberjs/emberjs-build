enifed("some-file", ["exports"], function (exports) {
  "use strict";

  var A = (function () {
    function A() {
      babelHelpers.classCallCheck(this, A);
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
    babelHelpers.inherits(B, _A);

    function B() {
      babelHelpers.classCallCheck(this, B);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvbWUtZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7TUFBTSxDQUFDO2FBQUQsQ0FBQzt3Q0FBRCxDQUFDOzs7QUFBRCxLQUFDLENBQ0UsR0FBRyxHQUFBLGVBQUc7QUFDWCxhQUFPLEtBQUssQ0FBQztLQUNkOztBQUhHLEtBQUMsV0FLTCxHQUFHLEdBQUEsZUFBRztBQUNKLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7O0FBUEcsS0FBQyxXQVNMLE1BQU0sR0FBQSxrQkFBRztBQUNQLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDNUM7O1dBWEcsQ0FBQzs7O01BY0QsQ0FBQzswQkFBRCxDQUFDOzthQUFELENBQUM7d0NBQUQsQ0FBQzs7Ozs7QUFBRCxLQUFDLFdBQ0wsR0FBRyxHQUFBLGVBQUc7QUFDSixhQUFPLEtBQUssQ0FBQztLQUNkOztBQUhHLEtBQUMsV0FLTCxTQUFTLEdBQUEscUJBQUc7QUFDVixhQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDbkM7O1dBUEcsQ0FBQztLQUFTLENBQUMiLCJmaWxlIjoic29tZS1maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQSB7XG4gIHN0YXRpYyBmb28oKSB7XG4gICAgcmV0dXJuIFwiZm9vXCI7XG4gIH1cblxuICBiYXIoKSB7XG4gICAgcmV0dXJuIFwiYmFyXCI7XG4gIH1cblxuICBmb29iYXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuZm9vKCkgKyB0aGlzLmJhcigpO1xuICB9XG59XG5cbmNsYXNzIEIgZXh0ZW5kcyBBIHtcbiAgYmF6KCkge1xuICAgIHJldHVybiBcImJhelwiO1xuICB9XG5cbiAgZm9vYmFyYmF6KCkge1xuICAgIHJldHVybiB0aGlzLmZvb2JhcigpICsgdGhpcy5iYXooKTtcbiAgfVxufVxuIl19