//navController: controlls the navbar.html page. 
var app=angular.module('pakit');

app.controller('navController', ['$state', '$scope', 'APIService', 'UserService', '$firebaseAuth', '$firebaseObject', function($state,$scope,APIService,UserService, $firebaseAuth, $firebaseObject) {

  //get the current User Name
  $scope.currUser = UserService.getCurrentUser();

  $scope.image_url="../image/account.svg";
  if($state.current.name == 'navbar'){
    $state.go('navbar.home');      //by default load the main page 
  }



  $scope.isActive = function (viewLocation) { 
   // //console.log($state.includes(viewLocation))
    return $state.includes(viewLocation);

  };
  $scope.isActiveOpt = function (viewLocation) { 
    return $state.is(viewLocation);
  };



  $scope.getRequest= function(){
    APIService.call_get('user/requests')
    .then(function(response){
      if(response.status==200){
        //console.log(response.data);
        $scope.Requests=response.data.requests;
      }
      else{
      //error handling
    }

  });

  };

  $scope.Requests=[];

  // function to faciliate state changes
  $scope.goTo = function(o,$eve) {
    $eve.preventDefault();
    $state.go('navbar.' + o);
  };

  var entries="empty";

  $scope.showPostings=function(){
    if(entries=="empty"){
      APIService.call_get('user/trips/')
      .then(function(response) {
        if(response.status == 200){
          entries={};
         // //console.log("asdas");
         //console.log(response.data);
         entries.data=response.data;
         $state.go('navbar.my_posting',entries);
       }
       else{
                  //error handling
          }
        });
    }
    else
      $state.go('navbar.my_posting',entries);
  };



  $scope.account=function(){
 
      APIService.call_get('user/me/')
      .then(function(response) {
        if(response.status == 200){
          entries={};
         // //console.log("asdas");
         //console.log(response.data);
         entries.data=response.data;
         $state.go('navbar.account',entries,{reload:true});
       }
       else{
                  //error handling
          }
        });
   
  };


$scope.logout = function() {
  APIService.call_get('user/logout')
    .then(function(response) {
      if(response.status == 200)
      { 
        //console.log(response);  
        UserService.setCurrentUser(null)
        $firebaseAuth().$signOut()
        .then(function() {
          $state.go('login')          
        }) 
      }
        });
        
  }


  $scope.rejectReq=function(req){
    var user_id={};
    user_id.transactionID= req._id;
    var api;

    api="send_transaction/invite/rejected/";
    APIService.call_post(api,user_id)
    .then(function(response){
      if(response.status==200){
        //console.log(response.data);

        var index = $scope.Requests.indexOf(req);
        $scope.Requests.splice(index, 1);  
      }   
      else{
          //error handle
        }
      });
  }


  $scope.acceptReq=function(req){
    var user_id={};
    user_id.transactionID= req._id;
    var api;

    api="send_transaction/invite/accepted/";
    APIService.call_post(api,user_id)
    .then(function(response){
      if(response.status==200){
        //console.log(response.data);
        var index = $scope.Requests.indexOf(req);
        $scope.Requests.splice(index, 1);     
      }
      else{
          //error handle
        }
      });
  }



// the entries that will come under the Notification section
$scope.Notifs=[{
  name:'My Account',
  url: '#home'
},{
  name:'Past Trips',
  url: '#about'
},{
  name:'Contact Us',
  url: '#contact'
},{
  name:'FAQs',
  url: '#contact'
},
{
  name:'Terms of Service',
  url: '#home'
},{
  name:'Logout',
  url: '#about'
}
];


}]);



