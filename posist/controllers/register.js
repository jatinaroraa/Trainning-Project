app.controller("register", function ($http, $scope, $location) {
  $scope.register = async function (email, password, cpassword) {
    if (password != cpassword) return window.alert("invalid details");
    try {
      data = { email: email, password: password, cpassword: cpassword };

      const response = await $http.post(
        "http://localhost:3000/register",
        JSON.stringify(data)
      );
      // if(response)
      if (response.data.code == "200") {
        return $location.path("/login");
      }
      if (response.data.code == "400")
        return window.alert("email already exist");
      else if (response.data.code == "401")
        return window.alert(`${response.data.mess}`);
      console.log(response.data.code, "register");
    } catch (error) {
      console.log(error);
    }
  };
});
