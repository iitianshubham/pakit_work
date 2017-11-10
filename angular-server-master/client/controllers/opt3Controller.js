//CONTROLS FORM 2: DELIVER A PAKIT
var app = angular.module('pakit');


app.controller('opt3Controller', function($scope, $filter,$state, formService,APIService,UserService) {

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

})


