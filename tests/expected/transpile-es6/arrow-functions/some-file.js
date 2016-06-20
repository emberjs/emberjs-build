enifed("some-file", [], function () {
  "use strict";

  // Expression bodies
  var odds = evens.map(function (v) {
    return v + 1;
  });
  var nums = evens.map(function (v, i) {
    return v + i;
  });

  // Statement bodies
  nums.forEach(function (v) {
    if (v % 5 === 0) fives.push(v);
  });

  // Lexical this
  var bob = {
    _name: "Bob",
    _friends: [],
    printFriends: function () {
      var _this = this;

      this._friends.forEach(function (f) {
        return console.log(_this._name + " knows " + f);
      });
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvbWUtZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsTUFBSSxPQUFPLE1BQU0sR0FBTixDQUFVO0FBQUEsV0FBSyxJQUFJLENBQVQ7QUFBQSxHQUFWLENBQVg7QUFDQSxNQUFJLE9BQU8sTUFBTSxHQUFOLENBQVUsVUFBQyxDQUFELEVBQUksQ0FBSjtBQUFBLFdBQVUsSUFBSSxDQUFkO0FBQUEsR0FBVixDQUFYOzs7QUFHQSxPQUFLLE9BQUwsQ0FBYSxhQUFLO0FBQ2hCLFFBQUksSUFBSSxDQUFKLEtBQVUsQ0FBZCxFQUNFLE1BQU0sSUFBTixDQUFXLENBQVg7QUFDSCxHQUhEOzs7QUFNQSxNQUFJLE1BQU07QUFDUixXQUFPLEtBREM7QUFFUixjQUFVLEVBRkY7QUFHUixnQkFIUSxjQUdPO0FBQUE7O0FBQ2IsV0FBSyxRQUFMLENBQWMsT0FBZCxDQUFzQjtBQUFBLGVBQ3BCLFFBQVEsR0FBUixDQUFZLE1BQUssS0FBTCxHQUFhLFNBQWIsR0FBeUIsQ0FBckMsQ0FEb0I7QUFBQSxPQUF0QjtBQUVEO0FBTk8sR0FBViIsImZpbGUiOiJzb21lLWZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFeHByZXNzaW9uIGJvZGllc1xudmFyIG9kZHMgPSBldmVucy5tYXAodiA9PiB2ICsgMSk7XG52YXIgbnVtcyA9IGV2ZW5zLm1hcCgodiwgaSkgPT4gdiArIGkpO1xuXG4vLyBTdGF0ZW1lbnQgYm9kaWVzXG5udW1zLmZvckVhY2godiA9PiB7XG4gIGlmICh2ICUgNSA9PT0gMClcbiAgICBmaXZlcy5wdXNoKHYpO1xufSk7XG5cbi8vIExleGljYWwgdGhpc1xudmFyIGJvYiA9IHtcbiAgX25hbWU6IFwiQm9iXCIsXG4gIF9mcmllbmRzOiBbXSxcbiAgcHJpbnRGcmllbmRzKCkge1xuICAgIHRoaXMuX2ZyaWVuZHMuZm9yRWFjaChmID0+XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLl9uYW1lICsgXCIga25vd3MgXCIgKyBmKSk7XG4gIH1cbn1cbiJdfQ==
