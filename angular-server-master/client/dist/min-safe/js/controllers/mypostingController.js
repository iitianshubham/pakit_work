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


