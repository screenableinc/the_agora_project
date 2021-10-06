import * as templating from './templateBuilders/template.js'
$(document).ready(function () {
    var username = $("#userId").text()
    function prepareItemsForOrder() {
        var trs = $(".cartItem")
        var arr = []
        for (var i = 0; i < trs.length; i++) {
            var item = $(trs[i]);
            var businessId  =  item.attr('data-businessId')
            var productId  =  item.attr('data-productId')
            var timestamp = new Date().getTime();
            var status = 0
            var quantity= parseInt(item.find("#quantity").val())
            var innerArr=[productId,businessId,timestamp,quantity,status,username]
            arr.push(innerArr)



        }
        return arr
    }
    function calcTotal() {
        var costs = $(".totalItemCost")
        var finalcost=0
        for (var i = 0; i < costs.length; i++) {
            // console.log(costs[i])
            finalcost=finalcost + parseFloat($(costs[i]).text())
        }
        $("#totalCost").text(finalcost)
    }
    function Qchange(){
        /*-------------------
		Quantity change
	--------------------- */
        function recalcFinal(tr,newval) {
            var init_price = parseFloat(tr.find("#price").text())

            var finalPrice = init_price*newval
            tr.find(".totalItemCost").text(finalPrice)
            calcTotal()

        }
        var proQty = $('.pro-qty');
        proQty.prepend('<span class="dec qtybtn">-</span>');
        proQty.append('<span class="inc qtybtn">+</span>');
        proQty.on('click', '.qtybtn', function () {
            var $button = $(this);
            var oldValue = $button.parent().find('input').val();
            if ($button.hasClass('inc')) {
                var newVal = parseFloat(oldValue) + 1;
                recalcFinal($button.closest("tr"),newVal)
            } else {
                // Don't allow decrementing below zero
                if (oldValue > 0) {
                    var newVal = parseFloat(oldValue) - 1;
                    recalcFinal($button.closest("tr"),newVal)
                } else {
                    newVal = 0;
                }
            }
            $button.parent().find('input').val(newVal);
        });


    }

    $.ajax({
        url:"/users/cart/items",
        type:"GET",
        success:function (msg) {
            if(msg.code===200){
                console.log(msg.response)
                for (var i = 0; i <msg.response.length ; i++) {


                    $("#cartItems").append(templating.cartItemTemplate(msg.response[i]))
                }
                calcTotal()
                Qchange()
            }
        },
        error:function (msg) {
            console.log(msg)
        }
    })
    $("#order").on('click', function (e) {
        e.preventDefault()
        $.ajax({
            url:'/users/checkout',
            type:'POST',
            success:function () {
                //    TODO::do something
            },
            error:function (err) {
                //    Todo:::something
            }
        })
    })

})