// controller responsible logging in the user
angular.module('pakit').controller('loginController',
  ['$rootScope', '$scope', '$state', 'formService', 'APIService', 'UserService', '$firebaseAuth', function($rootScope, $scope, $state, formService, APIService, UserService, $firebaseAuth){

    const FirebaseAuth = $firebaseAuth()

    $scope.fbLogin = function() {
      FB.login(function(response) {
        if(!response.authResponse) 
          return;

        //console.log(response)

        const token = response.authResponse.accessToken
        const credential = firebase.auth.FacebookAuthProvider.credential(token)

        //console.log(credential)

        FirebaseAuth.$signInWithCredential(credential)
        .then(function(User) {
          //console.log(User)

          const user = {
            email: User.email,
            name: User.displayName,
            firebaseToken: User.refreshToken,
            uid: User.uid,
            fbId: response.authResponse.userID
          }

          //console.log(user)

          APIService.call_post('user/register/facebook', user)
          .then(function(response) {
            if(response.status == 200 && response.data.success === true) {
              //console.log(response)
              user.access_token = response.data.token   //JWT token sent from the server
              UserService.setCurrentUser(user)
          
              var data = {}

              APIService.call_get('user/me')
              .then(function(response) {
                //console.log(response)
                if(response.status == 200) {
                  data.data = response.data;
                  user.name = response.data.name;
                  UserService.setCurrentUser(user);  
                  $state.go('navbar', data);
                }
              }).catch(function(err) {
                //console.log(err)
              })
            }

          }).catch(function(err) {
            //console.log(err)
          })
        }).catch(function(err) {
          //console.log(err)
        })
      }, {scope: 'email'})
    }

    // function to submit credentials to server for authentication
    $scope.error = false;
    $scope.submit = function(user) {

    //console.log("submitting");    
    //console.log(user);

    //call the APIService with the credentials
    //-------------NOT COMPLETE------------// 
    APIService.call_post('user/login/',user)
    .then(function(response) {
      if(response.status == 200)
      {


        // THIS NEEDS TO BE CLEANED. I THINK WE ARE STORING THE PASSWORD HERE TOO!!
        // store the current user details in local storage
        user.access_token = response.data.token;   //JWT token sent from the server
        $scope.error = false

        UserService.setCurrentUser(user);     //UserService stores the user
        $rootScope.$broadcast('authorized');
        //console.log(response.data);
      
        var data={};


        APIService.call_get('user/me')
          .then(function(response){
              if(response.status==200){
                 //console.log(response.data);
                 data.data=response.data;
                 user.name = response.data.name;
                  UserService.setCurrentUser(user);  
                 $state.go('navbar',data);
              }
              else{
                 //console.log(response)
              }

          });
        // go to home page
      // $state.go('navbar');
      }
      else{
            //error handling
            //console.log(response)
            if(response.status == 401) 
              $scope.error = true
          }
        })
    .catch(function(err) {
      //console.log(err);
    });

    };


}]);