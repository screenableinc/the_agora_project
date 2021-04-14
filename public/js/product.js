import * as templating from './templateBuilders/template.js'
$(document).ready(function () {

    var details = JSON.parse($("#productDetails").text())


    function fillDetails() {
        $("#price").text(details.symbol+"" +templating.price(details.price))
        $("#name").text(details.productName)
        $(".vendorname").text(details.businessName)
        $(".currency").text(details.symbol)
        $(".description").text(details.description)

        var deliverable = (details.deliverable === 1) ? "Yes" : "No"


        $("#deliverable").text(deliverable)
        $("#productImage").attr('src','/products/images?productId='+details.productId)
        var quantity = details.quantity
        if(quantity >= 0 ){
            $("#stock").text(quantity)
        }

    }
    function review(){
        $.ajax({
            url:"/products/reviews?productId="+details.productId,
            type:"GET",
            success: function (msg){

                $("#count").text(msg.response.length)
            }

        })
    }
    function attributes(){
        $.ajax({
            url:"/products/variations?productId="+details.productId,
            type:"GET",
            success:function (msg) {
                console.log(msg)
                new templating.sort_attributes(msg.response)
            },
            error: function (msg) {
                console.log(msg)
            }
        })
        console.log(details)

    }
    fillDetails()
    attributes()
    review()
})