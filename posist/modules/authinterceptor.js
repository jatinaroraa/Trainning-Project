app.factory("authInterceptor", function ($q, $cookies, $location) {
  return {
    request: function (config) {
      config.headers = config.headers || {};

      if ($cookies.get("token")) {
        console.log(cookieValue, "token call");
        config.headers.Authorization.token = $cookies.get("token");
      }

      return config;
    },
    responseError: function (response) {
      if (response.status === 401 || response.status === 403) {
        $location.path("/login");
      }
      return $q.reject(response);
    },
  };
});
