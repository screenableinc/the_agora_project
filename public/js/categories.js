import * as templating from './templateBuilders/template.js'
$(document).ready(function () {
    var query =$("#query").text()
    function initSlider() {
        $('.slick-responsive').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            lazyLoad:'ondemand'
        });
    }
    function populateView(selector,data) {
        for (var i = 0; i < data.length; i++) {
            var parent = $("<div class='item card' style='height: 100%;width: 200px'></div>")
            parent.append(templating.genProductTemplate(data[i]))
            $(selector).append(parent)
        }
        initSlider()
    }
    function load(){
        // alert("okay")
        console.log($.param(query))

        $.ajax({
            type:"GET",
            url:"get?"+query,
            success:function (msg) {
                if(msg.success){
                    populateView("#top",msg.response)
                }else {
                //    todo remove from view
                }
            },
            error:function () {

            }
        })
    }
    load()
})