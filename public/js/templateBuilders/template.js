export function ajax(url, method, data,callback) {
    $.ajax({
        url:url,
        method:method,
        data:data,
        success:function (msg) {
            return callback(msg)
        },
        error: function (err) {
            throw err;
        }
    })
}
function price(price) {
    price=String(parseFloat(String(price)).toFixed(2))
    var decimals = price.substr(price.length-3)
    price=price.slice(0, -3);
    if(price.length >= 4){
        var textLeft = price
        var final=""
        while (textLeft.length>3){

            final = "," +textLeft.substr(textLeft.length-3)+final
            textLeft = textLeft.slice(0, -3);


        }
        return textLeft+final+decimals

    }else {
        return price+decimals
    }
}
var productImgPrefix="/products/images?productId="

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


var brandtemplate = "<div class=\"product-item card\" style='height: 200px;width: 200px'>\n" +
    "                    <div class=\"pi-pic card-body\" style='height: 80%'>\n" +
    "                        \n" +
    "                        <img style='height: inherit;width: auto;margin-top: 10px;margin-left: auto;margin-right: auto;display: block' src=\"\" alt=\"\">\n" +
    "                        <div class=\"pi-links\">\n"+
    "                        </div>\n" +
    "                    </div>\n" +

    "                    <div style='text-align: center' class=\"pi-text card-footer\">\n" +

    "                        <a id=\"name\" href='#'>{{{productname}}}</a>\n" +
    "                    </div>\n" +
    "                </div>"
export function genBrandTemplate(details) {
    var template = $(brandtemplate)
    template.find('img').attr('src','/business/logo?businessId='+details.businessId)
    template.find('#goToVendor').attr('href','/business?vendorId='+details.businessId)
    var name = template.find('#name').text(details.businessName)
    template.on('click',function () {
        name.trigger('click')
    })
    return template
}

export function genCategoryTemplate(details) {
var template = $("<div class=\"col-lg-3 col-sm-6\">\n" +
    "                    <div class=\"card\">\n" +
    "                        <div class=\"card-header\">\n" +
    "                            <h4 class='categoryName'></h4>\n" +
    "                        </div>\n" +
    "                        <div class=\"card-body\">\n" +
    "                            <img src=\"\" alt=\"\">\n" +
    "                        </div>\n" +
    "                        <div class=\"card-footer\">\n" +
    "                            <a href=\"#\">View More</a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>")

    function image(){
        $.ajax({
            type:"GET",
            url:"/categories/image?id="+details.categoryId,
            success: function (url) {
                template.find('img').attr('src',url)
            },
            error:function () {
                // todo serve generic category image
            }

        })
    }
    image()

    template.find('.categoryName').text(details.name)

    template.find('a').attr('href','')
    return template

}

var product_template = "<div style='height: 230px' class=\"product-item\">\n" +
    "                    <div class=\"pi-pic\" style='height: 75%'>\n" +
    "                        \n" +
    "                        <div style='height: 100%;width:100% ;text-align: center'><img  src=\"{{{img-src}}}\" alt=\"\" style='height: inherit;width: auto;margin-top: 10px;margin-left: auto;margin-right: auto;display: block'></div>\n" +
    "                        <div style='' class=\"pi-links\">\n" +
    "                            <a id='addToCart' class=\"add-card\"><i class=\"material-icons\">add_shopping_cart</i><span></span></a>\n" +
    "                            <a id='goToVendor' href=\"{{{vendor-link}}}\" class=\"wishlist-btn\"><i class=\"material-icons\">favorite_border</i></a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +

    "                    <div style='padding: 10px' class=\"pi-text\">\n" +
    "<h6 id='price'>{{{price}}}</h6>"+
    "                        <p id=\"name\">{{{productname}}}</p>\n" +
    "                    </div>\n" +
    "                </div>"
var store_product="<div class=\"col-lg-3 col-sm-6\">\n" +
    "                                <div class=\"product-item\">\n" +
    "                                    <div style='height: 80%' class=\"pi-pic\">\n" +
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
var search_product="<div class=\"result row\">\n" +

    "\n" +
    "            <div style='width: auto'>\n" +
    "            <div class='image-frame'><img src='' alt=\"\"></div>\n" +
    "                <ul class=\"details\">\n" +
    "                <li class=\"result-li\"><a href='' class='product'><h5 style=\"height: 100%\" class=\"name\"></h5></a>\n" +
    " <div><h5 class='description'></h5></div>\n"+
    " <div><i class=\"material-icons\">add_shopping_cart</i><i class=\"material-icons\">favorite_border</i>  </div>\n"+
    " <div><span>By</span> <span><a href='' class='vendor'>Company Name</a></span>  </div>\n"+
    "                    <div class=\"rating\">\n" +
    "                        <span class=\"fa fa-star checked\"></span>\n" +
    "                        <span class=\"fa fa-star checked\"></span>\n" +
    "                        <span class=\"fa fa-star checked\"></span>\n" +
    "                        <span class=\"fa fa-star\"></span>\n" +
    "                        <span class=\"fa fa-star\"></span>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"result-li right\">\n" +
    "                <h3 class=\"price\">K 2,054</h3>\n" +
    "\n" +
    "                    <h6 class='vendor'>Company</h6>\n" +
    "                    <h5>24 km away</h5>\n" +
    " <i class=\"material-icons deliverable\">local_shipping</i> <i class=\"material-icons location\">place</i> \n"+
    "                </li>\n" +
    "\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        </div>\n" +
    "        <hr>"

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
                if(msg.err===1062){

                }else {
                window.location.href='/users/login'
            }
            }
        },error:function (msg) {
        //
        }
    })
}

export function genSearchProductTemplate(details) {
    var template = $(search_product)
    console.log(details)
    template.find('img').attr('src',productImgPrefix+details.productId)
    template.find('.price').text(price(details.price))
    template.find('.name').text(details.productName)
    template.find('.description').text(details.description)
    template.find('.product').attr('href','/products/product?productId='+details.productId)
    template.find('.vendor').attr('href','/business?vendorId='+details.vendorId)
    template.find('.vendor').text(details.businessName)
    if(details.deliverable===0){
        template.find('.deliverable').text("store")
    }
    return template
}

export function genProductTemplate(details) {
    var template = $(product_template)
    template.find("#addToCart").on('click',function () {

        addToCart(details.productId)
    })
    template.find("img").attr('src',"/products/images?productId="+details.productId)
    template.find("#name").text(details.productName)
    template.find("#goToVendor").attr('href',"/business?vendorId="+details.vendorId)
    template.find("img").on("click",function (e) {
        window.location.replace("/products/product/?productId="+details.productId);
    })
    template.find("#price").text("ZMK "+price(details.price))
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

var tableTemplate = "";

function deleteItem(table,id,element) {
    table= (table==='products') ? 'products':'orders'
    var data = (table==='products') ? {productId:id}:{orderId:id}
    var url = (table==='products') ? '/products/delete':'/orders/delete'
    $.ajax({
        url:url,
        method: "POST",
        data:data,
        success:function (msg) {
            if(msg.code===200){
                element.remove()
            }else {
                alert("Could not delete")
            }
        },
        error:function () {
            alert("Something went wrong here, try refreshing the page")
        }

    })
}
export function genItemsTemplate(details){
    var row = $("<tr></tr>")
    for (var i = 0; i < $("#itemsTable th").length - 1 /* -one for the actions */; i++) {
        row.append($("<td>"+ details[i] +"</td>"))
    }
//    finally add actions
    var actiontd = $("<td></td>")
    var deleteIcon = $("<i class='material-icons'>delete</i>")
    deleteIcon.on('click',function () {
        deleteItem('products',details[0],row)
    })
    actiontd.append(deleteIcon)
    var editIcon = $("<i class='material-icons'>edit</i>")
    editIcon.on('click',function () {

    })
    actiontd.append(editIcon)
    row.append(actiontd)
    return row;

}