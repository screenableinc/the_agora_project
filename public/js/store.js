import * as templating from './templateBuilders/template.js'

$(document).ready(function () {
    var businessId = $("#businessId").text()
    var products=[]
    var categories=["All"]

    // $.ajax({
    //     url:"/business?vendorId="
    // })
    function refresh(category) {
        loadProducts(category)
    }
    function loadCategories(callback) {
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i]
            var li = $("<li>"+ category +"</li>")
            li.on('click',function () {

                refresh($(this).text())
            })
            $("#list-group-men").append(li)
        }

    }
    function loadProducts( filter) {
        $("#products").empty()
        console.log(products.length)
        if(filter==="All") {
            for (var i = 0; i < products.length; i++) {
                $("#products").append(templating.storeProductTemplate(products[i]))
            }

        }else {
            for (var i = 0; i < products.length; i++) {
                var product = products[i]
                if(product.name===filter) {
                    $("#products").append(templating.storeProductTemplate(products[i]))
                }
            }
        }

    }

    function getStoreProducts() {
        $.ajax({
            url:"/business/products?businessId="+businessId,
            type:"GET",
            success:function (msg) {
                if(msg.code===200){
                    products=msg.response
                    for (var i = 0; i < products.length; i++) {
                    //    add to category
                        console.log(products[i])
                        if(!categories.includes(products[i].name)){
                            categories.push(products[i].name)
                        }
                    }
                    loadCategories()
                    loadProducts("All")

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