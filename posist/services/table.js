app.service("tableData", function ($http, $cookies) {
  var token = $cookies.get("token");

  var url = "http://localhost:3000";
  this.emptyTable = function (data) {
    $http
      .get(`${url}/tabledata`, {
        headers: { token: token },
      })
      .then(function (table) {
        data(table.data.data, "table data");
      });
  };
  this.editTable = function (tableNo, id, fill) {
    var data = {
      tableNo: tableNo,
      id: id,
      fill: fill,
    };
    console.log(data);

    $http
      .patch(`${url}/tabledata`, data, {
        headers: { token: token },
      })
      .then(function (res) {
        console.log(res.data, "edit table");
      });
  };
  this.editFilledTable = function (tableNo1, id1, tableNo2, id2) {
    var data = {
      tableNo1: tableNo1,
      tableNo2: tableNo2,
      id1: id1,
      id2: id2,
    };
    console.log(tableNo1, id1, tableNo2, id2);
    // return;
    $http
      .patch(`${url}/filledtable`, data, {
        headers: { token: token },
      })
      .then(function (res) {
        console.log(res.data, "edit filled table");
      });
  };
});
