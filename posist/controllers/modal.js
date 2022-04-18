app.controller(
  "modal",
  function ($uibModalInstance, items, $scope, amount, tableno) {
    //   var $scope = this;
    // var amount = 0
    $scope.items = items;
    $scope.tableno = tableno;

    $scope.totalAmount = amount;
    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss("cancel");
    };
  }
);
