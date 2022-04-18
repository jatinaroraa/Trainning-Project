app.service("bulkchange", function ($http) {
  var baseUrl = "http://localhost:3000/";

  this.statusChange = function (ids, status, callback) {
    var data = {
      id: ids,
      status: status,
    };
    $http.patch(`${baseUrl}bulkupdate`, data).then(function (data) {
      callback(data.data);
    });
  };
});
