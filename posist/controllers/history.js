app.controller(
  "history",
  function (
    $scope,

    $uibModal,
    $log,
    $document,
    $location,
    $cookies,
    authenticate,
    order
  ) {
    $scope.pageNo = 1;

    $scope.init = function () {
      authenticate.auth();
      // order.preparedOrder.then(function (data) {
      //   console.log(data.data.data, "processing orders");
      //   var orderdata = data.data.data;
      //   var statusdata = orderdata.filter(function (item) {
      //     return item.status == 2;
      //   });
      //   $scope.data = statusdata;
      // });
      order.prepared($scope.pageNo, function (data) {
        $scope.data = data.data;
        $scope.bigTotalItems = data.length;
        console.log(data, "data from services");
      });
    };
    $scope.open = function (size, parentSelector) {
      var parentElem = parentSelector
        ? angular.element(
            $document[0].querySelector(".modal-demo " + parentSelector)
          )
        : undefined;
      var modalInstance = $uibModal.open({
        // animation: $scope.animationsEnabled,
        // ariaLabelledBy: "modal-title",
        // ariaDescribedBy: "modal-body",
        templateUrl: "view/modal.html",
        controller: "modal",
        // controllerAs: "$scope",
        size: "lg",
        appendTo: parentElem,
        resolve: {
          items: function () {
            // console.log($scope.items, "return modal");
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
          $scope.items = 0;

          $scope.totalamount = 0;
          $scope.taxes = [];
          $scope.totalTax = 0;
          // console.log(selectedItem, "modal");
          $scope.selected = selectedItem;
        },
        function () {
          $log.info("Modal dismissed ");
        }
      );
    };
    $scope.modal = function (item, amount, tableno, data) {
      console.log(data.amount);
      // return;
      $scope.totalamount = data.amount;
      $scope.items = data.items;
      $scope.tableno = tableno;
      $scope.taxes = data.taxes;
      $scope.totalTax = data.totalTax;
      console.log($scope.items, "modal");

      // $scope.modalitems = getOrders.orderModal(item, amount);
      $scope.open();
    };
    $scope.stat = "settled";
    $scope.status = function (status, id) {
      if (status == "settled") $scope.stat == "prepared";
      var index = $scope.data.findIndex(function (item) {
        return item._id === id;
      });

      console.log($scope.data[index], "index of data");
      $scope.data.splice(index, 1);
      order.orderStatus(status, id);
      $scope.maxSize = 3;

      $scope.bigCurrentPage = 1;

      $scope.pageChanged = function () {
        $scope.pageNo = $scope.bigCurrentPage;
        order.processing($scope.pageNo, function (data) {
          $scope.data = data.data;
          $scope.bigTotalItems = data.length;
          console.log(data, "data from services");
        });
        console.log("Page changed to: " + $scope.bigCurrentPage);

        // $log.log("Page changed to: " + $scope.currentPage);
      };

      // getOrders.orderStatus(status, id);
    };
  }
);
