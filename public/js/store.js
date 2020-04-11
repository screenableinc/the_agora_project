import * as templating from './templateBuilders/template.js'

$(document).ready(function () {
    var businessId = $("#businessId").text()
    // $.ajax({
    //     url:"/business?vendorId="
    // })

    function getStoreProducts() {
        $.ajax({
            url:"/business/products?businessId="+businessId,
            type:"GET",
            success:function (msg) {
                if(msg.code===200){
                    for (var i = 0; i < msg.response.length; i++) {
                        $("#products").append(templating.storeProductTemplate(msg.response[i]))
                    }

                }else {
                //    TODO::handle error
                    alert("err")
                }
            },
            error:function (msg) {
            //    TODO:::hand;e error
                console.log(msg)
                alert("err")
            }
        })
    }
    getStoreProducts()
})