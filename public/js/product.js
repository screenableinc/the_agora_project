import * as templating from './templateBuilders/template.js'
$(document).ready(function () {

    var details = JSON.parse($("#productDetails").text())
    let hasVariations = false;
    // 	/*-------------------
// 		Quantity change
// 	--------------------- */
    var proQty = $('.pro-qty');
    $("#q_input").on("keyup",e=>{
        if(e.which !== 8 && isNaN(String.fromCharCode(e.which))){
            e.preventDefault(); //stop character from entering input
        }
        console.log($("#q_input").val(),"look")

            if($("#q_input").val()>parseFloat($("#stock").text())){

                $("#q_input").val($("#stock").text())
            }

    })
	proQty.prepend('<span class="dec qtybtn">-</span>');
	proQty.append('<span class="inc qtybtn">+</span>');
	proQty.on('click', '.qtybtn', function () {
		var $button = $(this);
		var oldValue = $button.parent().find('input').val();
		if ($button.hasClass('inc')) {
		    if(parseFloat(oldValue)<parseFloat($("#stock").text())){
                var newVal = parseFloat(oldValue) + 1;
            }else {
		        newVal=oldValue
            }

		} else {
			// Don't allow decrementing below zero
			if (oldValue > 0) {
				var newVal = parseFloat(oldValue) - 1;
			} else {
				newVal = 0;
			}
		}
		$button.parent().find('input').val(newVal);
	});




    function fillDetails() {
        $("#currency").text(details.symbol)
        $("#price").text(templating.price(details.price))
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
    function add(){
        //for npw////we wonnt use the quanity
        let data = {productId:details.productId, variationId:(hasVariations)? $("#variationId").val():null, vendorId:details.vendorId }
        console.log($("#variationId").val(),"wise",hasVariations)
        if(hasVariations && $("#variationId").val()!=="") {
            $.ajax({
                url: "/users/cart/add",
                type: "POST",
                data: data,
                success: function (msg) {
                    console.log(typeof msg)
                    if (msg.code === 200) {

                        var count = parseInt($("#cartItemCount").text())
                        $("#cartItemCount").text(count + 1)
                    } else {
                        window.location.href='/users/login'
                        alert("something went wrong")
                    }

                },
                error:function (e) {
                    console.log(e)
                }
            })
        }
    }
    function attributes(){
        $.ajax({
            url:"/products/variations?productId="+details.productId,
            type:"GET",
            success:function (msg) {
                if(msg.response.length!==0) {
                    hasVariations=true
                    new templating.sort_attributes(msg.response)
                }
            //    success call on addtocart listener
                $("#addtocart").on("click", e=>{
                    e.preventDefault()
                    add()
                })
            },
            error: function (msg) {
                console.log(msg)
            }
        })


    }

    fillDetails()
    attributes()
    review()
})