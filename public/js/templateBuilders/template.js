
var cartItem = "<tr rel=''>\n" +
    "<td class='product-col'>\n" +
    "    <img src='img/cart/1.jpg' alt=''>\n" +
    "    <div class='pc-title'>\n" +
    "    <h4 id='title'>title</h4>\n" +
    "<p id='price'>price</p>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td class='quy-col'>\n" +
    "    <div class='quantity'>\n" +
    "    <div class='pro-qty'>\n" +
    "    <input type='text' value='1'>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "    </td>\n" +
    
    "<td class='total-col'><h4>$45.90</h4></td>\n" +
    "</tr>"


var brandtemplate = "<div class=\"product-item\">\n" +
    "                    <div class=\"pi-pic\">\n" +
    "                        \n" +
    "                        <img src=\"\" alt=\"\">\n" +
    "                        <div class=\"pi-links\">\n" +
    "                            <a id='goToVendor'  href='' class=\"add-ard\"><i class=\"flaticon-bag\"></i><span></span></a>\n" +
    "                            <a id='' href=\"{{{vendor-link}}}\" class=\"wishlist-btn\"><i class=\"flaticon-heart\"></i></a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +

    "                    <div style='text-align: center' class=\"pi-text\">\n" +

    "                        <p id=\"name\">{{{productname}}}</p>\n" +
    "                    </div>\n" +
    "                </div>"
export function genBrandTemplate(details) {
    var template = $(brandtemplate)
    template.find('img').attr('src','/business/logo?businessId='+details.businessId)
    template.find('#goToVendor').attr('href','/business?vendorId='+details.businessId)
    template.find('#name').text(details.businessName)
    return template
}
var product_template = "<div class=\"product-item\">\n" +
    "                    <div class=\"pi-pic\">\n" +
    "                        \n" +
    "                        <img src=\"{{{img-src}}}\" alt=\"\">\n" +
    "                        <div class=\"pi-links\">\n" +
    "                            <a id='addToCart' \"#\" class=\"add-card\"><i class=\"flaticon-bag\"></i><span>Add to card</span></a>\n" +
    "                            <a id='goToVendor' href=\"{{{vendor-link}}}\" class=\"wishlist-btn\"><i class=\"flaticon-heart\"></i></a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +

    "                    <div class=\"pi-text\">\n" +
    "<h6 id='price'>{{{price}}}</h6>"+
    "                        <p id=\"name\">{{{productname}}}</p>\n" +
    "                    </div>\n" +
    "                </div>"
var store_product="<div class=\"col-lg-3 col-sm-6\">\n" +
    "                                <div class=\"product-item\">\n" +
    "                                    <div class=\"pi-pic\">\n" +
    "                                        <img src=\"{{imageUrl}}\" alt=\"\">\n" +
    "                                        <div class=\"pi-links\">\n" +
    "                                            <a id='addToCart' href=\"#\" class=\"add-card\"><i class=\"flaticon-bag\"></i><span>CART</span></a>\n" +
    "                                            <a href=\"#\" class=\"wishlist-btn\"><i class=\"flaticon-heart\"></i></a>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"pi-text\">\n" +
    "                                        <h6 id='price'>price</h6>\n" +
    "                                        <p id='name'>price </p>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>"

function addToCart(productId) {
    $.ajax({
        url:"/users/cart/add",
        type:"POST",
        data:{productId:productId},
        success:function (msg) {
            if(msg.success){
            //    add
                var count = parseInt($("#cartItemCount").text())
                $("#cartItemCount").text(count+1)
            }else {
                alert("Error")
            }
        },error:function (msg) {
            console.log(msg)
        }
    })
}


export function genProductTemplate(details) {
    var template = $(product_template)
    template.find("#addToCart").on('click',function () {
        alert("clicked")
        addToCart(details.productId)
    })
    template.find("img").attr('src',"/products/images?productId="+details.productId)
    template.find("#name").text(details.productName)
    template.find("#goToVendor").attr('href',"/business?vendorId="+details.vendorId)
    template.find("img").on("click",function (e) {
        window.location.replace("/products/product/?productId="+details.productId);
    })
    template.find("#price").text("ZMK "+details.price)
    return template
}
export function storeProductTemplate(details) {
    var template = $(store_product)
    template.find("img").attr('src',"/products/images?productId="+details.productId)
    template.find("#name").text(details.productName)
    template.find("img").on("click",function (e) {
        window.location.replace("/products/product/?productId="+details.productId);
    })
    template.find("#price").text("ZMK "+details.price)
    return template
}

var cartItem = "<tr class='cartItem'>\n" +
    "<td class='product-col'>\n" +
    "    <img src='img/cart/1.jpg' alt=''>\n" +
    "    <div class='pc-title'>\n" +
    "    <h4 id='title'>title</h4>\n" +
    " <p id='price'>price</p>\n" +
    "</div>\n" +
    "</td>\n" +
    "<td class='quy-col'>\n" +
    "    <div class='quantity'>\n" +
    "    <div class='pro-qty'>\n" +

    "    <input id='quantity' type='text' value='1'>\n" +

    "    </div>\n" +
    "    </div>\n" +
    "    </td>\n" +

    "<td class='total-col'><h4 class='totalItemCost'></h4></td>\n" +
    "</tr>"
export function cartItemTemplate(details) {
    var template = $(cartItem)
    template.attr("data-productId",details.productId)
    template.attr("data-businessId",details.vendorId)
    template.find("img").attr('src',"/products/images?productId="+details.productId)
    template.find("#title").text(details.productName)
    template.find("#price").text(details.price)
    template.find(".totalItemCost").text(details.price)

    return template
}