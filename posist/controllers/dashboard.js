app.controller(
  "dashboard",
  function (
    $http,
    $scope,
    $uibModal,
    $log,
    $document,
    $location,
    $cookies,
    authenticate,
    order,
    totalOrders,
    tableData,
    socket,
    bulkchange

    // modalFunc
  ) {
    // var cookieValue = $cookies.get("token");
    // $http.defaults.headers.common.Authorization = cookieValue;
    $scope.totalamount = 0;
    $scope.pageNo = 1;
    $scope.getorder = function () {
      authenticate.auth();
      // order.processingorder.then(function (data) {
      //   console.log(data.data.data, "processing orders");
      //   var orderdata = data.data.data;
      //   var statusdata = orderdata.filter(function (item) {
      //     return item.status == 1;
      //   });
      //   $scope.data = statusdata;
      // });
      order.processing($scope.pageNo, function (data) {
        console.log(data.data, "processing dashboard");
        // console.log(data.data.reverse(), "reverse");

        $scope.data = data.data;
        $scope.data.reverse();
        $scope.bigTotalItems = data.length;
        console.log($scope.bigTotalItems, "data from services");
      });
    };
    // logout
    $scope.logout = function () {
      $cookies.remove("token");
      return $location.path("/login");
    };

    // open modal
    // $scope.open = modalFunc.open(
    //   parentSelector,
    //   $scope.items,
    //   $scope.totalamount
    // );
    $scope.open = function (size, parentSelector) {
      var parentElem = parentSelector
        ? angular.element(
            $document[0].querySelector(".modal-demo " + parentSelector)
          )
        : undefined;
      var modalInstance = $uibModal.open({
        templateUrl: "view/modal.html",
        controller: "modal",

        size: "lg",
        appendTo: parentElem,
        resolve: {
          items: function () {
            console.log($scope.items, "return modal");
            return $scope.items;
          },
          amount: function () {
            var totalamount = {
              amount: $scope.totalamount,
              taxes: $scope.taxes,
              totalTax: $scope.totalTax,
            };
            return totalamount;
          },
          tableno: function () {
            return $scope.tableno;
          },
        },
      });

      modalInstance.result.then(
        function (selectedItem) {
          // console.log(selectedItem, "modal");
          $scope.items = 0;
        },
        function () {
          $scope.items = 0;
          $scope.totalamount = 0;
          $scope.taxes = [];
          $scope.totalTax = 0;
          $log.info("Modal dismissed ");
        }
      );
    };
    $scope.button = true;
    $scope.openAddOrder = function (parentSelector) {
      var parentEle = parentSelector
        ? angular.element(
            $document[0].querySelector(".modal-demo " + parentSelector)
          )
        : undefined;
      var modelAddorder = $uibModal.open({
        templateUrl: "view/modalAddOrder.html",
        controller: "modalAddOrder",
        size: "lg",
        appendTo: parentEle,
        resolve: {
          items: function () {
            console.log($scope.items, "edit button");
            return $scope.items;
          },
          amount: function () {
            var totalamount = {
              amount: $scope.totalamount,
              taxes: $scope.taxes,
              totalTax: $scope.totalTax,
            };
            return totalamount;
          },
          details: function () {
            var data = {
              name: $scope.name,
              number: $scope.number,
              id: $scope.id,
              tableNo: $scope.tableNo,
            };
            return data;
          },
          button: function () {
            return $scope.button;
          },
        },
      });
      modelAddorder.result.then(
        function (data) {
          console.log(data, "befor push data");
          if (data.update == false) {
            $scope.data.reverse();
            $scope.data.push(data);

            return $scope.data.reverse();
          }
          if (data.update == true) {
            $scope.items = 0;
            $scope.name = "";
            $scope.number = 0;
            $scope.totalamount = 0;
            $scope.taxes = [];
            $scope.totalTax = 0;
            $scope.id = 0;
            $scope.tableNo = 0;
            $scope.button = true;
            totalOrders.dismiss();
            $scope.data = $scope.data.map(function (item) {
              if (item._id == data.id) {
                item.name = data.name;
                item.number = data.number;
                item.amount = data.amount;
                item.status = data.status;
                item.items = data.items;
                item.tableNo = data.tableNo;
                item.taxes = data.taxes;
                item.totalTax = data.totalTax;

                console.log(item, "after edit in dashboard");
              }
              return item;
            });
          }
          totalOrders.dismiss();

          console.log($scope.data, "add order modal");
        },
        function () {
          $scope.items = 0;
          $scope.name = "";
          $scope.number = 0;
          $scope.totalamount = 0;
          $scope.taxes = [];
          $scope.totalTax = 0;
          $scope.id = 0;
          $scope.button = true;
          totalOrders.dismiss();

          console.log($scope.items, $scope.totalamount, "dismissed");

          console.log("dismissed");
        }
      );
    };
    $scope.bigModal = function (
      id,
      item,
      amount,
      name,
      number,
      tableNo,
      taxes,
      totalTax
    ) {
      $scope.id = id;
      $scope.totalamount = amount;
      $scope.taxes = taxes;
      $scope.totalTax = totalTax;
      console.log(item, "big modal function");

      $scope.items = item;

      $scope.name = name;
      $scope.tableNo = tableNo;
      $scope.number = number;
      $scope.button = false;

      $scope.openAddOrder();
    };

    $scope.modal = function (item, amount, tableNo, data) {
      console.log(data, "item in small modal");
      $scope.totalamount = data[0].amount;
      $scope.items = data[0].items;
      $scope.tableno = tableNo;
      $scope.taxes = data[0].taxes;
      $scope.totalTax = data[0].totalTax;
      // totalamount = {
      //   amount: $scope.totalamount,
      //   taxes: $scope.taxes,
      //   totalTax: $scope.totalTax,
      // };

      // $scope.modalitems = getOrders.orderModal(item, amount);
      $scope.open();
    };
    function bulkCallback(data) {
      if (data.code != 200) return window.alert("data not saved");
    }
    function uncheckAll() {
      var inputs = document.querySelectorAll(".check2");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
      }
    }
    $scope.changeInBulk = function (status) {
      $scope.enable = false;
      uncheckAll();

      if ($scope.bulkchange.length == 0) return;

      if (status == "settled") {
        bulkchange.statusChange($scope.bulkchange, status, bulkCallback);
        $scope.bulkchange.map(function (item) {
          var index = $scope.data.findIndex(function (it) {
            return it._id == item;
          });
          if (index != -1) $scope.data.splice(index, 1);
        });
      } else {
        bulkchange.statusChange($scope.bulkchange, status, bulkCallback);

        $scope.bulkchange.map(function (item) {
          var index = $scope.data.findIndex(function (it) {
            return it._id == item;
          });
          if (index != -1) $scope.data[index].status = status;
        });
      }

      // bulkchange.statusChange($scope.bulkchange, status);
    };
    $scope.bulkchange = [];
    $scope.disable = "true";
    $scope.checkbox = function (data) {
      if ($scope.bulkchange.length == 0) {
        // $scope.disable = "false";

        return $scope.bulkchange.push(data._id);
      } else {
        $scope.disable = "true";
      }
      var index = $scope.bulkchange.findIndex(function (item) {
        return item == data._id;
      });
      if (index == -1) {
        return $scope.bulkchange.push(data._id);
      }
      console.log($scope.bulkchange, "checkbox");

      $scope.bulkchange.splice(index, 1);
      console.log($scope.bulkchange, "checkbox");
    };
    $scope.enable = false;

    $scope.enableBulk = function () {
      $scope.enable = !$scope.enable;
    };
    $scope.swapStatus = function (value, id) {
      var msg = "hello from frontend";

      var index = $scope.data.findIndex(function (item) {
        return item._id == id;
      });

      var temp = value;
      $scope.data[index].status = $scope.stat2;
      $scope.stat2 = temp;
      order.orderStatus($scope.data[index].status, id);

      console.log($scope.data[index].status);
      // socket
      socket.emit("order", $scope.data[index]);
      // socket.on("messege", function (data) {
      //   console.log(data, "frontend");
      //   // appendmess(data, "received");
      // });
    };
    $scope.value = function (val) {
      if (val == "prepared") $scope.stat2 = "preparing";
      else $scope.stat2 = "prepared";
    };
    $scope.stat = "preparing";
    $scope.status = function (status, id, tableNo) {
      console.log(status, "dashboard ");
      // if (status == "preparing") return ($scope.stat = "Preparing");
      // if (status == "prepared") return ($scope.stat = "prepared");
      if (status == "settled") $scope.stat = "prepared";

      var index = $scope.data.findIndex(function (item) {
        return item._id === id;
      });

      console.log($scope.data[index], "index of data");
      $scope.data.splice(index, 1);
      order.orderStatus(status, id);
      tableData.editTable(tableNo, null, false);

      // getOrders.orderStatus(status, id);
    };
    // $scope.totalItems = 5;
    // $scope.currentPage = 4;

    // $scope.setPage = function (pageNo) {
    //   $scope.currentPage = pageNo;
    // };
    $scope.maxSize = 5;
    // $scope.totalItems = 64;
    // $scope.currentPage = 4;
    $scope.bigCurrentPage = 1;
    // $scope.bigTotalItems = 120;
    $scope.pageChanged = function () {
      $scope.pageNo = $scope.bigCurrentPage;
      order.processing($scope.pageNo, function (data) {
        $scope.data = data.data;
        $scope.bigTotalItems = data.length;
        console.log($scope.bigTotalItems, "data from services");
      });
      console.log("Page changed to: " + $scope.bigCurrentPage);

      // $log.log("Page changed to: " + $scope.currentPage);
    };
  }
);
