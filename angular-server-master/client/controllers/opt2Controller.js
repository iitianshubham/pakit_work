//CONTROLS FORM 2: DELIVER A PAKIT
var app = angular.module('pakit');


app.controller('opt2Controller', function($scope, $filter,$state, formService,APIService,UserService) {

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

})


