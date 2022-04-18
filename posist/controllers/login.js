app.controller("login", function ($scope, $http, $cookies, $location) {
  $scope.login = function (email, password) {
    // postdata

    data = { email: email, password: password };
    console.log(data, "function login");
    $http
      .post("http://localhost:3000/login", JSON.stringify(data))
      .then(function (res) {
        var token = res.data.token;
        $cookies.put("token", token);
        if (res.data.code == 200) return $location.path("/");
      })
      .catch(function (e) {
        return $location.path("/login");
      });
  };
});
