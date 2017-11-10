var app = angular.module('pakit', [
  'ui.router',
  'google.places',
  'angular-storage',
  'ngMap',
  'firebase',
  'ngFileUpload',
  'cloudinary'
]);

app.constant('ENDPOINT_URI', 'https://api.justpakit.com/api/')

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
 $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'partials/landing.html'
    })
    //register page
    .state('signup', {
      url: '/signup',
      templateUrl: 'partials/signup.html',
      controller:'signupController'
    }).
    //login page
    state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller:'loginController'
    }).
    state('mobile-otp', {
      url: '/otp-verification',
      templateUrl: 'partials/mobile-otp.html',
      controller: 'mobileOtpController'
    }).

    //the navbar: this is the central page. Its children has all the data
    state('navbar', {
      url: '/dashboard',
      templateUrl: 'partials/navbar.html',
      controller: 'navController'
    }).
    //the home page listing the various options available to the user
    state('navbar.home', {
      url: '/home',
      templateUrl: 'partials/home.html'

    }).
    // like the user dashboard. It lists all the entries made by the user 
    state('navbar.my_posting', {
      url: '/my_posting',
      templateUrl: 'partials/my_posting.html',
      controller:'myPostingController',
      params:{
        data: '' 
      }
    }).



    //this now loads all the entries made by the current user
    // this state and its children handle all the request entries/trips
    state('navbar.card_navbar', {
      url: '/card_nav',
      templateUrl: 'partials/card_navbar.html',
      controller: 'cardNavController',
      params: {
        post:'',
        data: '',
        goto:'',
        connected:''
      }
    }).


    //the possible views : this represent the various ways of 
    // presenting the status of the entries
    // 1. Shows the current status of invites accepted
    state('navbar.card_navbar.connected_users', {
      url: '/connected',
      templateUrl: 'partials/connected_users.html'
    }).

    // 2. Shows all users available to be invited
    state('navbar.card_navbar.allusers_grid', {
      url: '/allusers_grid',
      templateUrl: 'partials/allusers_grid.html'
    }).

    //3. Shows more details about the user in question
    state('navbar.card_navbar.allusers_details', {
      url: '/allusers_details',
      templateUrl: 'partials/allusers_details.html'
    }).
    

    // this houses the forms that the user can fill to request for services
    state('navbar.main', {
      url: '/main',
      templateUrl: 'partials/main.html',
      controller: ['$scope', '$state', function($scope, $state) {
         $scope.goTo = function(o,$eve) {
          $eve.preventDefault();
          $state.transitionTo('navbar.main.' + o);
        };
      }]
    }).


    //Form 1. the Filght Baggage club request
    state('navbar.main.opt1', {
      url: '/opt1',
      templateUrl: 'partials/opt1.html',
      controller: 'opt1Controller'
      
    }).

    //Form 2. Deliver a Pakit
    state('navbar.main.opt2', {
      url: '/opt2',
      templateUrl: 'partials/opt2.html',
      controller: 'opt2Controller'
    }).


    //Form 3. Send a Pakit
    state('navbar.main.opt3', {
      url: '/opt3',
      templateUrl: 'partials/opt3.html',
      controller: 'opt3Controller'
    }).


    //Form 4. Request a Pakit
    state('navbar.main.opt4', {
      url: '/opt4',
      templateUrl: 'partials/opt4.html'
    }).



    // a dummy page to view the data sent from the server
    state('navbar.view1', {
      url: '/view1',
      templateUrl: 'partials/view1.html',
      controller: 'view1Controller',
      params: {
        data: ''
      }
    }).



    // the default page for pages not found
    state('404', {
      url: '/404',
      template: '<h1>Page not found!</h1>'
    }).


   state('navbar.card_navbar.checkout', {
      url: '/checkout',
      templateUrl: 'partials/checkout.html',
      controller: 'checkoutController',
    }).

    state('navbar.account', {
      url: '/account',
      templateUrl: 'partials/account.html',
      resolve: {
        formData: ['APIService', function(APIService) {
          return APIService.call_get('user/me')
        }]
      },
      controller: 'accountController',
      params: {
        data: ''
      }
    }).

      state('navbar.account.account_form', {
      url: '/account_form',
      templateUrl: 'partials/account_form.html',
      controller: 'formController',
    }).


      state('navbar.account.account_profile', {
      url: '/account_profile', 
      templateUrl: 'partials/account_profile.html',
      controller: 'accountProfileController'
    }).

      state('navbar.account.past_trips', {
      url: '/past_trips',
      templateUrl: 'partials/past_trips.html'
    }).


      state('navbar.account.contact', {
      url: '/contact',
      templateUrl: 'partials/contact.html'
    }).

      state('navbar.account.terms', {
      url: '/terms',
      templateUrl: 'partials/terms.html'
    }).

      state('navbar.account.faq', {
      url: '/faq',
      templateUrl: 'partials/faq.html'
    })

    //redirect unknown links to the 404 page
    $urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true);

    //this Intercepts the HTTP POST requests and injects a token
    $httpProvider.interceptors.push('APIInterceptor');

 
}])

.config(['cloudinaryProvider', function(cloudinaryProvider) {
  cloudinaryProvider
    .set('cloud_name', 'pakitcloud')
    .set('upload_preset', 'rer5u8uy')
}])

// .config(function(DigitsProvider) {
//   DigitsProvider.setConsumerKey('9TKnRkK5fUTcyb9Wkt2y7Xwd7')
// })


// The APIInterceptor service: injects a JWT token to header of 
// every HTTP POST request
.service('APIInterceptor', ['$rootScope', 'UserService', function( $rootScope, UserService) {
  var service = this;
  service.request = function(config) {
    var currentUser = UserService.getCurrentUser(),
    access_token = currentUser ? currentUser.access_token : null;
    if (access_token && !$rootScope.isUpload) {
      config.headers.authorization = access_token;
    }
    if($rootScope.isUpload || $rootScope.isUpload === undefined)
      $rootScope.isUpload = false
    return config;
  };
  service.responseError = function(response) {
    if (response.status === 401) {
      $rootScope.$broadcast('unauthorized');
    }
    return response;
  };
}])



// the UserService: handles the local storage for the current logged-in user.
// the JWT tokens and user details stored here
.service('UserService', ['store', function(store) {
  var service = this,
  currentUser = null;

  service.setCurrentUser = function(user) {
    currentUser = user;
    store.set('user', user);
    return currentUser;
  };

  service.getCurrentUser = function() {
    if (!currentUser) {
      currentUser = store.get('user');
    }
    return currentUser;
  };
}])




// APIService: handles the API calls to the server
.service('APIService', ['$http', 'ENDPOINT_URI', function($http, ENDPOINT_URI) {
  var service = this;

  service.call_get = function(route){
    return $http.get(ENDPOINT_URI+route);
  };
   service.call_post = function(route,data){
    return $http.post(ENDPOINT_URI+route, data);
  };
}]);




app.factory('formService', ['$http', function($http) {
  var formData = {};
  return {
    getFormData: function getFormData() {
      return formData;
    },
    setFormData: function setFormData(form) {
      formData = form;
    }
  };
}]);

/**
 * TODO: Need to generate roomId, message when calling
 * the methods returned by this service, call initChat
 * from connected_users, getChatList from navbar controller
 */
app.factory('ChatService', (UserService, $firebaseObject) => {
  const chatlist = {}
  const ref = firebase.database().ref().child('chat_rooms')

  return {
    initChat(roomId) {
      if(!chatlist[roomId]) {
        ref.once('value', (snapshot) => {
          if(!snapshot.hasChild(roomId)) {
            ref.child(roomId).child('test').set({0:0})  
          }

          ref.child(roomId).on('value', function(snapshot) {
            chatlist[roomId] = snapshot.val()
          })
        })
      }
    },
    getChatList() {
      return chatlist
    },
    sendMessage(roomId, message) {
      ref.child(message.timestamp).update(message)
    }
  }
})

// app.factory('authService', (APIService) => {
//   function getUserStatus() {
//     return APIService.call_get('user/status')
//     .then((response) => {
//       return response.data.status
//     }, (err) => {
//       //console.log(err)
//       return false
//     })
//   }

//   return {
//     getUserStatus
//   }
// })

// app.run(function($location, $rootScope, $state, authService) {
//   $rootScope.$on('$stateChangeStart',
//     function(event, toState, toParams, fromState, fromParams) {
//       authService.getUserStatus()
//         .then(function(status) {
//           //console.log(status)
//           // if (!status) {
//           //   $state.go('login');
//           // }
//         });
//     });
// });


