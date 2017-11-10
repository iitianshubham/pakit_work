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