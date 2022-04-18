var app = angular.module("firstapp", [
  "ui.router",
  "ngCookies",
  "ui.bootstrap",
]);

app.controller("maincnontrol", function ($http, $scope, $cookies, $location) {
  // var vm = this;
  // var $scope = this;
  $scope.items = ["item1", "item2", "item3"];
  $scope.logout = function () {
    $cookies.remove("token");
    return $location.path("/login");
  };

  $scope.animationsEnabled = true;
});
app.config(function ($stateProvider, $httpProvider) {
  // console.log(user);
  // var user = false;

  $stateProvider
    .state("login", {
      url: "/login",
      templateUrl: "view/login.html",
      controller: "login",
    })
    .state("register", {
      url: "/register",
      templateUrl: "view/register.html",
      controller: "register",
    })

    .state("home", {
      abstract: true,
      url: "/",

      templateUrl: "view/home.html",
      controller: "maincnontrol",
    })
    .state("home.dashboard", {
      url: "",

      templateUrl: "view/dashboard.html",
      controller: "dashboard",
    })
    .state("home.addorder", {
      url: "/addorder",

      templateUrl: "view/addorder.html",
    })
    .state("home.metrices", {
      url: "metrices",

      templateUrl: "view/metrices.html",
      controller: "metrices",
    })
    .state("orderstatus", {
      url: "/orderstatus",

      templateUrl: "view/orderStatus.html",
      controller: "orderStatus",
    })
    .state("home.history", {
      url: "history",

      templateUrl: "view/history.html",
      controller: "history",
    });

  // testprovider.setname("jatin");

  // $httpProvider.interceptors.push("authInterceptor");
});

app.filter("lname", function () {
  return function (i) {
    return i + "helo";
  };
});

// var test = function ($q, $cookies, $location) {
//   var cookieValue = $cookies.get("token");
//   console.log(config, "configg");
//   return {
//     request: function (config) {
//       config.headers = config.headers || {};

//       if (cookieValue) {
//         config.headers.common["token"] = cookieValue;
//       }

//       return config;
//     },
//     responseError: function (response) {
//       if (response.status === 401 || response.status === 403) {
//         $location.path("/login");
//       }
//       return $q.reject(response);
//     },
//   };
// };

// angular.module("myInterceptor", []).config(function ($httpProvider) {
//   $httpProvider.interceptors.push(test);
// });
