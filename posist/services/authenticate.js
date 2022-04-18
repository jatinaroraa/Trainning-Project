app.service("authenticate", function ($http, $cookies, $location) {
  /**
   * this fucntion abc
   */
  this.auth = function () {
    var token = $cookies.get("token");
    var data = {
      token: token,
    };

    $http.post("http://localhost:3000", data).then(function (res) {
      console.log(res.data.code, "authenticate service");
      if (res.data.code == 400) {
        $location.path("/login");
      }
    });
  };
});
