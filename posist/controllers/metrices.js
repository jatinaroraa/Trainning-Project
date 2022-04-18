app.controller(
  "metrices",
  function ($http, $scope, $location, authenticate, order, socket) {
    $scope.mat = 2;
    // data.details();
    $scope.init = function () {
      authenticate.auth();
      order.aggregate.then(function (res) {
        console.log(res.data, "metrices agrregation");
        $scope.top = res.data;
        $scope.timeItem = $scope.top.timeItem.map(function (item) {
          if (item._id == 0) {
            item._id = 12;
            return item;
          }
          return item;
        });

        // old
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
          var temp = [
            {
              _id: "Time",
              total: "customers",
            },
          ];
          var filterdata = $scope.top.timeData.filter(function (item) {
            if (item._id == null) return;
            var a = [`${item._id}`, item.total];
            return a;
          });
          var concat = temp.concat(filterdata);
          var timeData = concat.map(function (item) {
            if (item._id == null) return;
            var a = [`${item._id}:00 PM`, item.total];
            return a;
          });
          console.log(timeData, "time data");

          var data = google.visualization.arrayToDataTable(timeData);

          var options = { title: "My Average Day", width: 550, height: 400 };

          var chart = new google.visualization.PieChart(
            document.getElementById("piechart")
          );
          chart.draw(data, options);
        }

        console.log($scope.top.timeData, "aggregate");
      });
    };
  }
);
