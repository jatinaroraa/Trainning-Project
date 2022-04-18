app.service("order", function ($http, $cookies) {
  var token = $cookies.get("token");

  var baseUrl = "http://localhost:3000/";

  // this.processingorder = new Promise(function (resolve, reject) {
  //   console.log(`${baseUrl}`, "url");

  //   var data = $http.get(`${baseUrl}orders`);
  //   // console.log(data, "promise ");
  //   resolve(data);
  // });
  this.recommend = function (data, callback) {
    var data = JSON.stringify(data);
    console.log(data, "recommend send data");

    $http.get(`${baseUrl}recommend/?data=${data}`).then(function (data) {
      callback(data.data.data);
    });
  };
  this.processing = function (pageno, getOrderData) {
    $http
      .get(`${baseUrl}orders/preparing/?pageno=${pageno}`, {
        headers: { token: token },
      })
      .then(function (data) {
        console.log(data.data);
        getOrderData(data.data);
      });
  };

  // prepared order
  this.prepared = function (pageno, preparedData) {
    console.log(pageno, "page no from orderjs");
    $http
      .get(`${baseUrl}orders/prepared/?pageno=${pageno}`, {
        headers: { token: `${token}` },
      })
      .then(function (data) {
        console.log(data.data);
        preparedData(data.data);
      });
  };

  // this.preparedOrder = new Promise(function (resolve, reject) {
  //   console.log(`${baseUrl}`, "url");

  //   var data = $http.get(`${baseUrl}orders/prepared`);
  //   // console.log(data, "promise ");
  //   resolve(data);
  // });
  // order status
  this.orderStatus = function (status, id) {
    var data = {
      id: id,
      status: status,
    };
    console.log(status, "status function");
    $http
      .post(`${baseUrl}orderstatus`, data, {
        headers: { token: token },
      })
      .then(function (d) {
        console.log(d, "order status request");
      })
      .catch(function (e) {
        console.log(e, "order status request");
      });
    console.log(id, "order status", data);
  };
  // aggregations
  this.aggregate = new Promise(function (resolve, reject) {
    var data = $http.get(`${baseUrl}matrices`, {
      headers: { token: token },
    });

    // console.log(data, "promise ");

    resolve(data);
  });
  // add orders

  this.addorders = function (
    name,
    number,
    amount,
    items,
    tableNo,
    taxes,
    totalTax
  ) {
    var data = {
      name: name,
      number: number,
      items: items,
      amount: amount,
      status: "preparing",
      tableNo: tableNo,
      taxes: taxes,
      totalTax: totalTax,
    };

    $http
      .post(`${baseUrl}addorders`, data, {
        headers: { token: token },
      })
      .then(function (res) {
        if (res.data.code == 200) console.log("data saved");
      })
      .catch(function (e) {
        console.log(e);
      });
  };
  // update orders
  this.updateOrders = function (
    id,
    name,
    number,
    amount,
    items,
    tableNo,
    taxes,
    totalTax
  ) {
    var data = {
      id: id,
      name: name,
      number: number,
      items: items,
      amount: amount,
      status: "preparing",
      tableNo: tableNo,
      taxes: taxes,
      totalTax: totalTax,
    };
    console.log(data, "update order");

    $http
      .patch(`${baseUrl}updateorders`, data, {
        headers: { token: token },
      })
      .then(function (res) {
        if (res.data.code == 200) console.log(res.data, "data updated");
      })
      .catch(function (e) {
        console.log(e);
      });
  };
  // menue
  this.menue = new Promise(function (resolve, reject) {
    var data = $http.get(`${baseUrl}menue`);
    // console.log(data, "promise ");
    resolve(data);
  });
});
