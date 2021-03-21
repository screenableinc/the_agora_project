import * as templating from './templateBuilders/template.js'
$(document).ready(function () {
    $.ajax({
        url:"users/cart/items",
        type:"GET",
        success:function (res) {
            if(res.success){
                templating.fillCart(res.response)
            }else{
            //    TODO::handle error
            }
        }
    })
})