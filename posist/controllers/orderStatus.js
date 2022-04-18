app.controller("orderStatus", function ($scope, socket) {
  var messarea = document.querySelector(".chat");
  var textarea = document.querySelector(".type");

  // $scope.init = function () {
  //   do {
  //     $scope.number = prompt("please enter your number");
  //     console.log($scope.number);
  //   } while (!$scope.number);
  // };
  socket.on("orderStatus", function (data) {
    console.log(data, "frontend");
    $scope.id = data._id;
    appendmess(data, "received");
  });
  socket.on("newOrder", function (user) {
    appendmess(user, "received");
  });
  function appendmess(msg, type) {
    var maindiv = document.createElement("div");
    var classname = type;
    maindiv.classList.add(classname);
    var data = ` <p>order status</p>
    <div class="mess-${type}">
          <p>name:${msg.name}</p>
          <p>number:${msg.number}</p>
          <p>status:${msg.status}</p>
          <p>tableno:${msg.tableno}</p>
          <p>Total Tax:${msg.totalTax}</p>
          
          <p>Total Amount:${msg.amount}</p>
          
        </div>`;
    maindiv.innerHTML = data;
    messarea.appendChild(maindiv);
  }
});
// <p ng-repeat="items in msg.items ">{{items.name}}:name</p>
