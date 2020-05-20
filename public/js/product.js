$(document).ready(function () {
    var details = JSON.parse($("#productDetails").text())


    function fillDetails() {
        $("#price").text(details.price)
        $("#name").text(details.name)
        var deliverable = details.deliverable
        if(deliverable===0){
            deliverable="Yes"
        }else {
            deliverable="No"
        }
        $("#deliverable").text(deliverable)
        $("#productImage").attr('src','/products/images?productId='+details.productId)
        var quantity = details.quantity
        if(quantity >= 0 ){
            $("#stock").text(quantity)
        }

    }
    fillDetails()

})