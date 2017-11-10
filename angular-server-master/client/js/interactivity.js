//Image upload -- Shubham
function file(){
    document.getElementById("detailsform_hiddenfile").click();
}

$(document).ready(function(){
    $("#name").focus(function(){
        if(($("#name").val()) == ""){
        $("#name_label").removeClass("signup_movelabeltodefault");	
        $("#name_label").addClass("signup_movelabelup");
        $("#name").removeClass("signup_underlinedefault");    
        $("#name").addClass("signup_underlineinput");    
            }
        if($("#password").val() == ""){
        $("#password_label").addClass("signup_movelabeltodefault");
        $("#password").removeClass("signup_underlineinput");
        $("#password").addClass("signup_underlinedefault");    
            }
        if($("#email").val() == ""){
        $("#email_label").addClass("signup_movelabeltodefault");
        $("#email").removeClass("signup_underlineinput");
        $("#email").addClass("signup_underlinedefault");    
            }
        });
 });
$(document).ready(function(){
    $("#email").focus(function(){
        if(($("#email").val()) == ""){
        $("#email_label").removeClass("signup_movelabeltodefault");	
        $("#email_label").addClass("signup_movelabelup");
        $("#email").removeClass("signup_underlinedefault");    
        $("#email").addClass("signup_underlineinput");    
            }
        if($("#password").val() == ""){
        $("#password_label").addClass("signup_movelabeltodefault");
        $("#password").removeClass("signup_underlineinput");
        $("#password").addClass("signup_underlinedefault");    
            }
        if($("#name").val() == ""){
        $("#name_label").addClass("signup_movelabeltodefault");
        $("#name").removeClass("signup_underlineinput");
        $("#name").addClass("signup_underlinedefault");    
            }
        });
 });
$(document).ready(function(){
    $("#password").focus(function(){
        if(($("#password").val()) == ""){
        $("#password_label").removeClass("signup_movelabeltodefault");	
        $("#password_label").addClass("signup_movelabelup");
        $("#password").removeClass("signup_underlinedefault");    
        $("#password").addClass("signup_underlineinput");    
            }
        if($("#email").val() == ""){
        $("#email_label").addClass("signup_movelabeltodefault");
        $("#email").removeClass("signup_underlineinput");
        $("#email").addClass("signup_underlinedefault");    
            }
        if($("#name").val() == ""){
        $("#name_label").addClass("signup_movelabeltodefault");
        $("#name").removeClass("signup_underlineinput");
        $("#name").addClass("signup_underlinedefault");    
            }
        });
 });
$(document).ready(function(){
    $("#from_input").focus(function(){
    if(($("#from_input").val()) == ""){
    $("#from_source_label").removeClass("new_pakit_movelabeltodefault");
    $("#from_source_label").removeClass("new_pakit_label");
    $("#from_source_label").addClass("new_pakit_movelabelup");
    $("#from_input").removeClass("new_pakit_underlinedefault"); 
    $("#from_input").addClass("new_pakit_blueunderline");    
        }
    if($("#destination_input").val() == ""){
    $("#to_destination_label").addClass("new_pakit_movelabeltodefault");
    $("#destination_input").addClass("new_pakit_underlinedefault");    
        }       
    if($("#flight_input").val() == ""){
    $("#flight_date_label").addClass("new_pakit_movelabeltodefault");       
    $("#flight_input").addClass("new_pakit_underlinedefault");    
        }
    if($("#weight_input").val() == ""){
    $("#weight_carry_label").addClass("new_pakit_movelabeltodefault");
    $("#weight_input").addClass("new_pakit_underlinedefault");    
        }
    });
});


$(document).ready(function(){
    $("#destination_input").focus(function(){
    if(($("#destination_input").val()) == ""){
    $("#to_destination_label").removeClass("new_pakit_label");    
    $("#to_destination_label").removeClass("new_pakit_movelabeltodefault");
    $("#to_destination_label").addClass("new_pakit_movelabelup");
    $("#destination_input").removeClass("new_pakit_underlinedefault");  
    $("#destination_input").addClass("new_pakit_blueunderline");      
        }
    if($("#from_input").val() == ""){
    $("#from_source_label").addClass("new_pakit_movelabeltodefault");
    $("#from_input").addClass("new_pakit_underlinedefault");    
        }       
    if($("#flight_input").val() == ""){
    $("#flight_date_label").addClass("new_pakit_movelabeltodefault");
    $("#flight_input").addClass("new_pakit_underlinedefault");    
        }
    if($("#weight_input").val() == ""){
    $("#weight_carry_label").addClass("movelabeltodefault");
    $("#weight_input").addClass("underlinedefault");    
        }                   
    });
});

$(document).ready(function(){
    $("#flight_input").focus(function(){
    if($("#flight_input").val() == ""){
    $("#flight_date_label").removeClass("new_pakit_label");
    $("#flight_date_label").removeClass("new_pakit_movelabeltodefault");
    $("#flight_date_label").addClass("new_pakit_movelabelup");
    $("#flight_input").removeClass("new_pakit_underlinedefault");   
    $("#flight_input").addClass("new_pakit_blueunderline"); 
        }
    if($("#destination_input").val() == ""){
    $("#to_destination_label").addClass("new_pakit_movelabeltodefault");
    $("#destination_input").addClass("new_pakit_underlinedefault");    
        }       
    if($("#from_input").val() == ""){
    $("#from_source_label").addClass("new_pakit_movelabeltodefault");
    $("#from_input").addClass("new_pakit_underlinedefault");    
        }
    if($("#weight_input").val() == ""){
    $("#weight_carry_label").addClass("new_pakit_movelabeltodefault");
    $("#weight_input").addClass("new_pakit_underlinedefault");    
        }                   
    });
});

$(document).ready(function(){
    $("#weight_input").focus(function(){
    if($("#weight_input").val() == ""){
    $("#weight_carry_label").removeClass("new_pakit_label");    
    $("#weight_carry_label").removeClass("new_pakit_movelabeltodefault");   
    $("#weight_carry_label").addClass("new_pakit_movelabelup");
    $("#weight_input").removeClass("new_pakit_underlinedefault");   
    $("#weight_input").addClass("new_pakit_blueunderline");    
        }
    if($("#destination_input").val() == ""){
    $("#to_destination_label").addClass("new_pakit_movelabeltodefault");
    $("#destination_input").addClass("new_pakit_underlinedefault");    
        }       
    if($("#flight_input").val() == ""){
    $("#flight_date_label").addClass("new_pakit_movelabeltodefault");
    $("#flight_input").addClass("new_pakit_underlinedefault");    
        }
    if($("#from_input").val() == ""){
    $("#from_source_label").addClass("new_pakit_movelabeltodefault");
    $("#from_input").addClass("new_pakit_underlinedefault");    
        }               
    });
});
$('.rating input').change(function () {
  var $radio = $(this);
  $('.rating .selected').removeClass('selected');
  $radio.closest('label').addClass('selected');
});