var app=angular.module('pakit');

app.controller('view1Controller',['$scope', '$stateParams', function($scope, $stateParams) {
  $scope.currUser = {};
  //console.log("in view1controller");
  //console.log($stateParams);
  $scope.users=$stateParams.data; 
  
  $scope.currUser = $scope.users[0] || {};
  $scope.showUser = function(selectedUser) {
      $scope.currUser = selectedUser;

  };
}]);