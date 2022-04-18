app.factory("socket", function ($rootScope) {
  var url = "http://localhost:3000/";
  var socket = io.connect(url);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      console.log("function call in factory socket");
      socket.emit(eventName, data, function () {
        console.log(data, "data in socket factory");
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
});
