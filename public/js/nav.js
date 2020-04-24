$(document).ready(function () {
    function req(url,type,callback) {
        $.ajax({
            url:url,
            type:type,
            success:function (msg) {
                return callback(msg)
            },error:function () {
                throw this.error
            }
        })
    }
    function loadCategories() {
        req("/products/categories/all","GET",function (msg) {
            if(msg.code===200){

            }
        })

    }
    function getCart() {
        req("/users/cart/items","GET",function (msg) {
            if(msg.code===200){
                $("#cartItemCount").text(msg.response.length)
            }
        })
    }
    getCart()
})