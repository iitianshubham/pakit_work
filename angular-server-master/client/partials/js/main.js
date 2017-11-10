/* Navbar scroll animation */

$(document).scroll(function(){
    var top = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
    if(top>100)
        // $("nav").fadeIn("slow");
        $("nav").addClass("active");
    else
        // $("nav").fadeOut("slow");
        $("nav").removeClass("active");
});


/* User case section animation */

carousel_elements = 5;
carousel_index = 2;
item_margin = 50;
item_width_sm = 300;
item_width_lg = 400;
left_offset_sm = 300;
left_offset_lg = 200;

function carouselNext()
{
    var mq = window.matchMedia("(min-width: 768px)");
    if (mq.matches)
    {
        slide_val = (item_width_lg+item_margin).toString();
        left_val = ((item_width_lg+item_margin)*carousel_elements - left_offset_lg).toString()+"px";
    }
    else
    {
        slide_val = (item_width_sm+item_margin).toString();
        left_val = ((item_width_sm+item_margin)*carousel_elements - left_offset_sm).toString()+"px";
    }
    var left_most = ((carousel_index+carousel_elements-2)%carousel_elements)+1;
    $left = $(".usage-image-item[data-index='"+left_most.toString()+"']");
    carousel_index = carousel_index%carousel_elements + 1;
    $(".usage-text-item.active").removeClass("active");
    $(".usage-text-item[data-index='"+carousel_index.toString()+"']").addClass("active");
    $(".usage-image-item.active").removeClass("active");
    $(".usage-image-item[data-index='"+carousel_index.toString()+"']").addClass("active");
    $left.animate({
        left: "-="+slide_val
    }, 500, function() {
        $left.css("left",left_val);
    });
    $(".usage-image-item").animate({
        left: "-="+slide_val
    }, 500);
}

function carouselPrev()
{
    var mq = window.matchMedia("(min-width: 768px)");
    if (mq.matches)
    {
        slide_val = (item_width_lg+item_margin).toString();
        left_val = "-"+(item_width_lg+item_margin+left_offset_lg).toString()+"px";
    }
    else
    {
        slide_val = (item_width_sm+item_margin).toString();
        left_val = "-"+(item_width_sm+item_margin+left_offset_sm).toString()+"px";
    }
    var right_most = ((carousel_index+carousel_elements-3)%carousel_elements)+1;
    $right = $(".usage-image-item[data-index='"+right_most.toString()+"']");
    $right.css("left",left_val);
    carousel_index = (carousel_index+carousel_elements-2)%carousel_elements + 1;
    $(".usage-text-item.active").removeClass("active");
    $(".usage-text-item[data-index='"+carousel_index.toString()+"']").addClass("active");
    $(".usage-image-item.active").removeClass("active");
    $(".usage-image-item[data-index='"+carousel_index.toString()+"']").addClass("active");
    $(".usage-image-item").animate({
        left: "+="+slide_val
    }, 500 );
}

setInterval(carouselNext,3000);


/* How pakit works animation */

app_flow_ndex = 1;
$('#carouselAppFlow').on('slide.bs.carousel', function () {
    $("#appFlowPoints > div:nth-child("+app_flow_ndex+")").removeClass('highlighted-point');
    app_flow_ndex = (app_flow_ndex%4)+1;
    $("#appFlowPoints > div:nth-child("+app_flow_ndex+")").addClass('highlighted-point');
});
