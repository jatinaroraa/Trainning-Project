app.controller(
  "modalAddOrder",
  function (
    $uibModalInstance,
    items,
    amount,
    details,
    $scope,
    button,
    tableData,
    $http,
    totalOrders,
    socket,

    order
  ) {
    $scope.totalOrders = [];
    $scope.totalAmount = 0;
    $scope.data = [];
    $scope.qty = 1;
    $scope.name = "";
    $scope.init = function () {
      if (button == true) {
        $scope.finish = true;
      }
      if (button == false) {
        $scope.update = true;
      }
      if (items != 0) {
        if (items[0].name != undefined) {
          $scope.update = "true";

          var data = totalOrders.editOrder(items, amount);
          $scope.totalOrders = data.totalOrders;
          $scope.totalAmount = data.totalAmount;
          $scope.name = details.name;
          $scope.number = details.number;
          $scope.id = details.id;
          $scope.tableNo = details.tableNo;
          $scope.oldTableNo = details.tableNo;
        }
      }
      tableData.emptyTable(function (table) {
        $scope.table = table.filter(function (item) {
          if (item.fill == false) return item;
        });
        $scope.filledTable = table.filter(function (item) {
          if (item.fill == true) return item;
        });
        if ($scope.table == null) $scope.table = "no empty table";
      });
    };

    $scope.tablefunction = function (tableno, id, oldtable, tableupdate) {
      $scope.tableupdate = tableupdate;
      $scope.filledId = id;
      $scope.tableNo = tableno;
    };

    $scope.addOrder = function () {
      $uibModalInstance.close();
    };

    $scope.cancelOrder = function () {
      $scope.data = [];

      $uibModalInstance.dismiss("cancel");
    };

    order.menue
      .then(function (data) {
        var d = data.data.res;
        var recommend = data.data.recommend;
        $scope.data = d;

        $scope.totaldata = totalOrders.newarray(d);
      })
      .catch(function (e) {
        console.log(e);
      });
    var cart = [];

    $scope.orders = function (name, price, qty, taxes, tags, category, id) {
      $scope.recommend = [];
      cart.push(id);
      order.recommend(cart, function (data) {
        $scope.recommend = totalOrders.recommend(data);
      });
      $scope.totalOrders = totalOrders.orders(
        name,
        price,
        qty,
        taxes,
        tags,
        id
      );

      $scope.totalAmount = totalOrders.totalAmount();
    };

    $scope.deleteItem = function (name, qty) {
      $scope.deleteitem = totalOrders.deleteItem(name, qty);
      var index = cart.indexOf(function (item) {
        return item.name == name;
      });

      cart.splice(index, 1);

      if (cart.length) {
        order.recommend(cart, function (data) {
          $scope.recommend = totalOrders.recommend(data);
        });
      } else {
        $scope.recommend = [];
      }
    };
    $scope.plus = function (qty, name, category) {
      $scope.Plus = totalOrders.plus(qty, name, category);
    };
    $scope.minus = function (qty, name, category) {
      $scope.Minus = totalOrders.minus(qty, name, category);
    };

    $scope.sendData = function (
      name,
      number,
      amount,
      tableNo,
      taxes,
      totalTax
    ) {
      if (!name || number.length < 10)
        return window.alert("enter full details");
      totalOrders.dismiss();
      var table;
      if (tableNo == undefined) table = null;
      else table = tableNo;
      order.addorders(
        name,
        number,
        amount,
        $scope.totalOrders,
        table,
        taxes,
        totalTax
      );

      var data = {
        name: name,
        number: number,
        items: $scope.totalOrders,
        amount: amount,
        taxes: taxes,
        totalTax: totalTax,
        status: "preparing",
        update: false,
        tableNo: table,
        fill: true,
      };
      socket.emit("newOrder", data);
      $uibModalInstance.close(data);
    };
    $scope.updateOrders = function (
      name,
      number,
      amount,
      tableNo,
      newTableNo,
      taxes,
      totalTax
    ) {
      order.updateOrders(
        $scope.id,
        name,
        number,
        amount,
        $scope.totalOrders,
        newTableNo,
        taxes,
        totalTax
      );
      // old table
      if ($scope.tableupdate == true) {
        tableData.editFilledTable(
          $scope.oldTableNo,
          $scope.id,
          newTableNo,
          $scope.filledId
        );
      } else {
        tableData.editTable($scope.oldTableNo, null, false);
        tableData.editTable(newTableNo, $scope.id, true);
      }

      var data = {
        id: $scope.id,
        name: name,
        number: number,
        amount: amount,
        items: $scope.totalOrders,
        status: "preparing",
        update: true,
        tableNo: newTableNo,
        taxes: taxes,
        totalTax: totalTax,
      };
      socket.emit("newOrder", data);

      $uibModalInstance.close(data);
    };
  }
);
