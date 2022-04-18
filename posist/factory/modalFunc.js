app.factory("modalFunc", function ($http) {
  return {
    open: open,
  };

  function open(parentSelector, items, totalamount) {
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
          // console.log($scope.items, "return modal");
          return items;
        },
        amount: function () {
          return totalamount;
        },
      },
    });

    modalInstance.result.then(
      function (selectedItem) {
        // console.log(selectedItem, "modal");
        var selected = selectedItem;
      },
      function () {
        $log.info("Modal dismissed ");
      }
    );
  }
});
