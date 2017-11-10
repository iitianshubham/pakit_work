angular.module('pakit').controller('signupController',
  function($scope, $state,  $firebaseAuth, APIService, $rootScope, UserService) {

   $scope.error = false
   $scope.errorMessage = ""
  
    const FirebaseAuth = $firebaseAuth()
    
    $scope.fbSignup = function() {
      FB.login(function(response) {
        if(!response.authResponse) 
          return;

        ////console.log(response)

        const token = response.authResponse.accessToken
        const credential = firebase.auth.FacebookAuthProvider.credential(token)

        ////console.log(credential)

        FirebaseAuth.$signInWithCredential(credential)
        .then(function(User) {
          ////console.log(User)
          firebase.database().ref('users/' + User.uid).set({
            email: User.email,
            firebaseToken: User.firebaseToken,
            uid: User.uid
          });
        
            const user = {
            email: User.email,
            name: User.displayName,
            firebaseToken: User.refreshToken,
            uid: User.uid,
            fbId: response.authResponse.userID
          }

          ////console.log(user)

          APIService.call_post('user/register/facebook', user)
          .then(function(response) {
            if(response.status == 200 && response.data.success === true) {
              user.access_token = response.data.token   //JWT token sent from the server
              UserService.setCurrentUser(user)
          
              var data = {}

              APIService.call_get('user/me')
              .then(function(response) {
                ////console.log(response)
                if(response.status == 200) {
                  data.data = response.data;
                  user.name = response.data.name;
                  UserService.setCurrentUser(user);  
                  $state.go('navbar', data);
                }
              }).catch(function(err) {
                ////console.log(err)
              })
            }

          }).catch(function(err) {
            ////console.log(err)
          })
        }).catch(function(err) {
          ////console.log(err)
        })
      }, {scope: 'email'})
    }

  $scope.submit = function() {

    ////console.log($scope.form)

    FirebaseAuth.$createUserWithEmailAndPassword(
      $scope.form.email, 
      $scope.form.password)
    .then(function(User) {
      ////console.log(User)
      
      firebase.database().ref('users/' + User.uid).set({
          email: $scope.form.email,
          firebaseToken: User.refreshToken,
          uid: User.uid
        });
      
      const user = {
        email: $scope.form.email,
        password: $scope.form.password,
        name: $scope.form.name,
        firebaseToken: User.refreshToken,
        uid: User.uid
      }

      ////console.log(user)

      APIService.call_post('user/register', user)
      .then(function(response) {
        ////console.log(response)
        if(response.status == 200 && response.data.success === true) {
          user.access_token = response.data.token   //JWT token sent from the server
          UserService.setCurrentUser(user)
      
          var data = {}

          APIService.call_get('user/me')
          .then(function(response) {
            ////console.log(response)
            if(response.status == 200) {
              data.data = response.data;
              user.name = response.data.name;
              UserService.setCurrentUser(user);  
              $state.go('navbar', data);
            }
          }).catch(function(err) {
            ////console.log(err)
          })
        }

      }).catch(function(err) {
        ////console.log(err)
      })

    }).catch(function(err) {
      ////console.log(err)
      $scope.error = true
      $scope.errorMessage = err.message
    })
  }
})

// angular.module('pakit').controller('mobileOtpController', 
//   function($scope, Digits, $http, UserService) {

//     $scope.verifyPhone = function() {
//       Digits.login()
//         .then((response) => {
//           ////console.log(response)
//         }).catch((err) => {
//           ////console.log(err)
//         })
//     }
//     // }
//     // var data = {}

//     // APIService.call_get('user/me')
//     // .then(function(response) {
//     //   if(response.status == 200) {
//     //     data.data = response.data;
//     //     user.name = response.data.name;
//     //     UserService.setCurrentUser(user);  
//     //     $state.go('navbar', data);
//     //   }
//     // }).catch(function(err) {
//     //   ////console.log(err)
//     // })
//   }
// )