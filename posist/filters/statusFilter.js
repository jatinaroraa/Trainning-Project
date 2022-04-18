app.filter("status", function () {
  return function (input) {
    var status;
    if (input == 1) return (status = "prepring");
    if (input == 2) return (status = "settled");
    if (input == 3) return (status = "prepared");
  };
});
