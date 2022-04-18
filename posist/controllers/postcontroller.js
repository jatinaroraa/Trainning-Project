function Controller($http) {
  vm = this;
  $http.get("https://jsonplaceholder.typicode.com/posts").then(function (res) {
    vm.post = res.data;
    console.log(res.data);
  });
}

app.component("postlist", {
  templateUrl: "controller.html",
  controller: Controller,
  controllerAs: "vm",
});
