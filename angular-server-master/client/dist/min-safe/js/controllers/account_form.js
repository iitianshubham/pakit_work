//navController: controlls the navbar.html page. 
var app=angular.module('pakit');

app.controller('formController', 
	['$state', '$scope', 'APIService', 'UserService', '$stateParams', 'formData', function($state,$scope,APIService,UserService,$stateParams, formData) {

		var acc_object = formData.data
		$scope.acc = formData.data

		$scope.accUpdate = function(){

			acc_object.education = $scope.acc.education || '';
			acc_object.workplace = $scope.acc.workplace || '';
			acc_object.hometown = $scope.acc.hometown || '';
			acc_object.bank_num = $scope.acc.bank_num || '';

		APIService.call_post('user/me',acc_object)
			.then(function(response) {
				if(response.status == 200)
				{ 
					//console.log(response);  

				}
				
			    });

			    
		}

		
	 // $scope.User=$stateParams.data || {};
	 
	 // //console.log($scope.User);



}]);



