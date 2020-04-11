import * as templating from './templateBuilders/template.js'
$(document).ready(function () {
    function initSlider(selector) {
        selector.owlCarousel({
            loop: false,
            nav: true,
            dots: false,
            margin : 30,
            autoplay: true,
            navText: ['<i class="flaticon-left-arrow-1"></i>', '<i class="flaticon-right-arrow-1"></i>'],
            responsive : {
                0 : {
                    items: 1,
                },
                480 : {
                    items: 2,
                },
                768 : {
                    items: 3,
                },
                1200 : {
                    items: 4,
                }
            }
        });
    }

    function loadLatestProducts() {
        $.ajax({
            url:"/products/latest",
            type:"GET",
            success:function (msg) {
                if(msg.code===200){
                    if(msg.response.length>0){
                        $("#latestProducts").empty()
                    }
                    for (var i = 0; i < msg.response.length; i++) {
                        $("#latestProducts").append(templating.genProductTemplate(msg.response[i]))

                    }
                    initSlider($('#latestProducts'))
                }
            },
            error:function () {
                //handle properly
                alert("error")
            }
        })
    }
    function loadTopBrands(){
        $.ajax({
            url:"/business/top",
            type:"GET",
            success:function (msg) {
                console.log(msg)
                if(msg.code===200){
                    if(msg.response.length>0){
                        $("#topBrands").empty()
                    }
                    for (var i = 0; i < msg.response.length; i++) {
                        $("#topBrands").append(templating.genBrandTemplate(msg.response[i]))

                    }
                    initSlider($("#topBrands"))
                }
            },
            error:function (msg) {
                //handle properly
                console.log(msg)
                alert("error")
            }
        })
    }
loadLatestProducts()
loadTopBrands()
})