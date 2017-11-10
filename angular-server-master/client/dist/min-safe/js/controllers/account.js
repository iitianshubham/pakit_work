//navController: controlls the navbar.html page. 
var app=angular.module('pakit');

app.controller('accountController', ['$state', '$scope', 'APIService', 'UserService', '$stateParams', 'formData', function($state,$scope,APIService,UserService,$stateParams, formData) {


  var acc_object = formData.data

 	if($state.current.name=='navbar.account') {
   $state.go('navbar.account.account_profile');
  }

  //console.log($stateParams);
  $scope.User=$stateParams.data || {};

  $scope.account_form = function() {
  	//console.log("goin to forms");
  	$state.go('navbar.account.account_form')
  }

  $scope.goProfile = function() {
    //console.log("goin to forms");
    $state.go('navbar.account.account_profile')
  }

  $scope.goPast = function() {
    //console.log("goin to forms");
    $state.go('navbar.account.past_trips')
  }



    $scope.goFaq = function() {
    //console.log("goin to forms");
    $state.go('navbar.account.faq')
  }



    $scope.goTerms = function() {
    //console.log("goin to forms");
    $state.go('navbar.account.terms')
  }



    $scope.goContact = function() {
    //console.log("goin to forms");
    $state.go('navbar.account.contact')
  }

}]);


app.controller('accountProfileController', 
  ['$scope', '$rootScope', 'Upload', 'cloudinary', 'APIService', function($scope, $rootScope, Upload, cloudinary, APIService) { 
    $scope.upload = function() {
        if ($scope.form.file.$valid && $scope.file) {
          $rootScope.isUpload = true
          
          const d = new Date()
          const title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")"       

          Upload.upload({
            url: 'https://api.cloudinary.com/v1_1/' + cloudinary.config().cloud_name + '/upload',
            data: {
                upload_preset: cloudinary.config().upload_preset,
                tags: 'pakit',
                context: 'photo=' + title,
                file: $scope.file
              }
          }).then(function(response) {
            APIService.call_post('user/pic', {
              picUrl: response.data.url
            }).then(function(response) {
              if(response.status == 200)
               $scope.picUrl = response.data.url
            })

          }, function(response) {
            //console.log(response)
          })
      }
    }
}]);






