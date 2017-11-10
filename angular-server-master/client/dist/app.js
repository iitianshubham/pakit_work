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







//this controls how the data for a selected entry is shown to the user

var app=angular.module('pakit');

app.controller('cardNavController',
	['$state', '$scope', '$stateParams', 'APIService', 'UserService', 'ChatService', function($state ,$scope, $stateParams, APIService, UserService, ChatService) {


	//console.log($stateParams);
	//the current entry whose results are shown
	$scope.currCard={};

	$scope.initChat = function(cuserUid) {
		ChatService.initChat(cuserUid)
	}

	//store the details of the current card
	var cardData=$stateParams.post || "empty";
	if(cardData!="empty"){
		if(cardData.success){
			$scope.currCard.date=cardData.date;
			$scope.currCard.from=cardData.src_airport.airport_code;
			$scope.currCard.to 	=cardData.des_airport.airport_code;
			$scope.currCard.weight=cardData.weight;
			$scope.currCard.mode=cardData.type;	
			$scope.currCard.id=cardData.id;
			$scope.avatar = ''

			 var img = '../image/'
			if($scope.currCard.mode == 'flight') {
				$scope.avatar = img + 'flight.png'	
			} else if ($scope.currCard == 'travel') {
				$scope.avatar = img + 'travel.png'	
			} else {
				$scope.avatar = img + 'send.png'	
			}

			if($state.current.name == 'navbar.card_navbar' && cardData.success)
				$state.go('navbar.card_navbar' + $stateParams.goto);
		}
	}


	var connected=$stateParams.connected.transactions || "empty";
	//console.log(UserService.getCurrentUser())
	if(connected!="empty"){
		$scope.connected_users=connected[0].concat(connected[1]);
		var me = UserService.getCurrentUser()
		//console.log(me)
		for(var i=0; i<$scope.connected_users.length;i++){
			
			if($scope.connected_users[i].initiated_by.email == me.email) {
				$scope.connected_users[i].name = $scope.connected_users[i].initiated_for.name
			} else {
				$scope.connected_users[i].name = $scope.connected_users[i].initiated_by.name
			}

			if($scope.currCard.mode == 'send') {
				$scope.connected_users[i].entry = $scope.connected_users[i].traveller_entry
				$scope.connected_users[i].entry.name = 'Carrying'
				
			}

			else if($scope.currCard.mode == 'travel') {
				$scope.connected_users[i].entry = $scope.connected_users[i].sender_entry
				$scope.connected_users[i].entry.name = 'Send'
			}
			
			else if ($scope.currCard.mode == 'flight') {
				$scope.connected_users[i].entry = $scope.connected_users[i].flight_entry
				$scope.connected_users[i].entry.name = 'Flight'
			}
			
			//console.log($scope.connected_users[i].name)
		}

	}

	//console.log($scope.connected_users);
	// the corresponding results that are to be shown
	$scope.usersToShow=$stateParams.data  || [];
	
	$scope.currUser=$scope.usersToShow[0];
	//the waypoints for the google map 
	$scope.wayPoints = [
	{location: {lat:26.1911546, lng:  91.6902631,}, stopover: true}, 
	];   


    // function to change between views
    $scope.changeViews= function(view){
    	$state.go(view);
    };


    $scope.checkout = function() {
  	$state.go('navbar.card_navbar.checkout')
  };


    // this will change view to All Users and show the results for the selected entry
    $scope.showCurrUser= function(user){
	$state.go('navbar.card_navbar.allusers_details');
	$scope.currUser=user;
	};



	//this will show the user details of the selected user entry
	$scope.showUserDetail =function(user){
		$scope.currUser=user;
	};   



	//to invite an user 
	$scope.inviteUser = function(){
		//console.log("user invited");
		var api,req={};
		if($scope.currCard.mode=="send"){
			api="send_transaction/invite/pending/";
			req.send_id=$scope.currCard.id;
			req.initiated_for=$scope.currUser.id;
			req.travel_id=  $scope.currUser.travelling_id;
		}
		else if($scope.currCard.mode=="travel"){
			api="travel_transaction/invite/pending/";
			req.send_id=  $scope.currUser.sending_id; 
			req.initiated_for=  $scope.currUser.id;
			req.travel_id= $scope.currCard.id;
		}
		else if($scope.currCard.mode=="flight"){
			api="flight_transaction/invite/pending/";
			req.flight_posted_id=$scope.currCard.id;
			req.initiated_for=$scope.currUser.id;
		}

		
		//console.log(req);

		APIService.call_post(api,req)
		.then(function(response) {
			if(response.status == 200)
			{ 

				//console.log("ho gywa!");
				//console.log(response.data);
				var index = $scope.usersToShow.indexOf($scope.currUser);
				$scope.usersToShow.splice(index, 1);
				$scope.currUser=$scope.usersToShow[index+1] || {};     

			}
			else{
		            //error handling
		
		        }
		    });
	};

}]);
//navController: controlls the navbar.html page. 
var app=angular.module('pakit');

app.controller('account_formController', 
	['$state', '$scope', 'APIService', 'UserService', '$stateParams', function($state,$scope,APIService,UserService,$stateParams) {

 // $scope.User=$stateParams.data || {};
 
 // console.log($scope.User);

}]);




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
//myPostingController: responsible for showing the current entries of the 
//logged-in user

var app = angular.module('pakit');


app.controller('myPostingController', ['$scope', '$state', '$stateParams', 'APIService', function($scope, $state, $stateParams,APIService) {

	// the entries of the user
	$scope.postings=$stateParams.data;
	// var posts=$stateParams.data || [];
	// for(var i in posts.sendings){
	// 	posts.sendings[i].mode="sending";
	// 	$scope.postings.push(posts.sendings[i]);
	// }

	// for(var i in posts.travels){
	// 	posts.travels[i].mode="carrying";
	// 	$scope.postings.push(posts.travels[i]);
	// }
  $scope.imageType = function(type) {
    var img = '../image/'
    if(type == 'flight')
      img += 'flight.png'
    else if(type == 'travel')
      img += 'travel.png'
    else 
      img += 'send.png'

      // //console.log(img)
      return img
  }

	
  	//function to show the entries corresponding to the selected card 
  	//make an API call to fetch the data related to the card
  	// and send it to the next state
  	test={};
  	$scope.showPost=function(post){
  		test.post=post;   //the current post
  		//make API call to fetch data for this card
  		var entry={};
  		////console.log(post.id);
  		entry.entry_id=post.id;
  		
  		var api='';
  		if(post.type=="send")
  			api='search/travellers';
      else if(post.type=="travel")
       api="search/senders";
      else if(post.type=="flight")
      api="search/flights";

      APIService.call_post(api,entry)
      .then(function(response) {
        if(response.status == 200){
          test.post.success=true;
          test.data=response.data;
          test.goto=".allusers_details";

            //load the connected users
            APIService.call_post(api+'_connected',entry)
            .then(function(res) {
              if(response.status == 200){

                test.connected=res.data;
                //console.log(res.data);
                $state.go('navbar.card_navbar',test);
              }
              else{
                //error handling
              }
            });
          }
          else{
            //error handling
          }
        });
    	};




  }]);



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




//CONTROLS FORM 2: DELIVER A PAKIT
var app = angular.module('pakit');


app.controller('opt1Controller', ['$scope', '$filter', '$state', 'formService', 'APIService', 'UserService', function($scope, $filter,$state, formService,APIService,UserService) {

  $scope.form={};


  //submit the form and redirect the data as necessary
   $scope.submit = function() {

    //console.log("submitting");    
    //format the request data properly
    $scope.form.flight_number=$scope.flight_number;
    $scope.form.type=$scope.type;
    $scope.form.date=$filter('date')($scope.date, "yyyy-MM-dd"); 
    $scope.form.weight=$scope.weight;
    $scope.form.from=$scope.from.geometry.location.lat()+","+ $scope.from.geometry.location.lng();
    $scope.form.to=$scope.to.geometry.location.lat()+","+ $scope.to.geometry.location.lng();
    //console.log($scope.form);
    var user=$scope.form;



    APIService.call_post('flight/',user)
      .then(function(response) {
        if(response.status == 200)
        {
         //console.log(response.data);
         //I sent the correct sender data
         //now I want to request the api for corresponding travellers
         var sendr={};
         var daa={};
         sendr.entry_id=response.data.id; 
         //console.log(sendr.entry_id);
          //send a request with the ID
         APIService.call_get('flight/'+sendr.entry_id)
            .then(function(response) {
                if(response.status == 200)
                {
                 daa.post=response.data;
                 daa.post.mode="flight";
                 daa.post.success=true;
                 APIService.call_post('search/flights',sendr)
                     .then(function(response) {
                          if(response.status == 200)
                          { 
                           daa.data=response.data;
                           daa.goto=".allusers_grid";
                           //console.log(daa);
                           //I sent the correct sender data
                           //now I want to request the api for corresponding travellers 
                           $state.go('navbar.card_navbar',daa);
                         }
                         else{
                            //error handling
                          }
                  });
               }
               else{
                  //error handling
                }
        });
         
        }
        else{
          //error handling
        }
      })
       .catch(function(err) {
      //console.log(err);
      });

  };

}])



//CONTROLS FORM 2: DELIVER A PAKIT
var app = angular.module('pakit');


app.controller('opt2Controller', ['$scope', '$filter', '$state', 'formService', 'APIService', 'UserService', function($scope, $filter,$state, formService,APIService,UserService) {

  $scope.form={};


  //submit the form and redirect the data as necessary
   $scope.submit = function() {

    //console.log("submitting");    
    //format the request data properly
    $scope.form.travelling_from=$scope.travelling_from.geometry.location.lat()+","+ $scope.travelling_from.geometry.location.lng();
    $scope.form.travelling_to=$scope.travelling_to.geometry.location.lat()+","+ $scope.travelling_to.geometry.location.lng();
   	$scope.form.date=$filter('date')($scope.date, "yyyy-MM-dd"); 
    $scope.form.weight=$scope.weight;
    //console.log($scope.form);
    var user=$scope.form;



    APIService.call_post('travel/',user)
      .then(function(response) {
        if(response.status == 200)
        {
         //console.log(response.data);
         //I sent the correct sender data
         //now I want to request the api for corresponding travellers
         var sendr={};
         var daa={};
         sendr.entry_id=response.data.id; 
         //console.log(sendr.entry_id);
          //send a request with the ID
         APIService.call_get('travel/'+sendr.entry_id)
            .then(function(response) {
                if(response.status == 200)
                {
                 daa.post=response.data;
                 daa.post.mode="travel";
                 daa.post.success=true;
                 APIService.call_post('search/senders',sendr)
                     .then(function(response) {
                          if(response.status == 200)
                          { 
                           daa.data=response.data;
                           daa.goto=".allusers_grid";
                           //console.log(daa);
                           //I sent the correct sender data
                           //now I want to request the api for corresponding travellers 
                           $state.go('navbar.card_navbar',daa);
                         }
                         else{
                            //error handling
                          }
                  });
               }
               else{
                  //error handling
                }
        });
         
        }
        else{
          //error handling
        }
      })
       .catch(function(err) {
      //console.log(err);
      });

  };

}])



//CONTROLS FORM 2: DELIVER A PAKIT
var app = angular.module('pakit');


app.controller('opt3Controller', ['$scope', '$filter', '$state', 'formService', 'APIService', 'UserService', function($scope, $filter,$state, formService,APIService,UserService) {

  $scope.form={};


  //submit the form and redirect the data as necessary
   $scope.submit = function() {

    //console.log("submitting");    
    //format the request data properly
    $scope.form.delivery_location=$scope.delivery_loc.geometry.location.lat()+","+ $scope.delivery_loc.geometry.location.lng();
    $scope.form.pickup_location=$scope.pickup_loc.geometry.location.lat()+","+ $scope.pickup_loc.geometry.location.lng();
   	$scope.form.date=$filter('date')($scope.date, "yyyy-MM-dd"); 
    $scope.form.weight=$scope.weight;
    //console.log($scope.form);
    var user=$scope.form;

    APIService.call_post('send/',user)
      .then(function(response) {
        if(response.status == 200)
        {
         //console.log(response.data);
         //I sent the correct sender data
         //now I want to request the api for corresponding travellers
         var sendr={};
         var daa={};
         sendr.entry_id=response.data.id; 
          //send a request with the ID
         APIService.call_get('send/'+response.data.id)
            .then(function(response) {
                if(response.status == 200)
                {
                 daa.post=response.data;
                 //console.log(response.data);
                 daa.post.success=true;
                 daa.post.mode="send";
                 APIService.call_post('search/travellers',sendr)
                     .then(function(response) {
                          if(response.status == 200)
                          { 
                           daa.data=response.data;
                           daa.goto=".allusers_details";
                           //console.log("ghjk");
                           //I sent the correct sender data
                           //now I want to request the api for corresponding travellers 
                           $state.go('navbar.card_navbar',daa);
                         }
                         else{
                            //error handling
                          }
                  });
               }
               else{
                  //error handling
                }
        });
         
        }
        else{
          //error handling
        }
      })
       .catch(function(err) {
      //console.log(err);
      });

  };

}])



angular.module('pakit').controller('signupController',
  ['$scope', '$state', '$firebaseAuth', 'APIService', '$rootScope', 'UserService', function($scope, $state,  $firebaseAuth, APIService, $rootScope, UserService) {

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
}])

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