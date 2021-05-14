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
export function price(price) {
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

var checkout_product = "<li>\n" +
    "                            <div class=\"pl-thumb\"><img id='thumb-img' src=\"img/cart/1.jpg\" alt=\"\"></div>\n" +
    "                            <h6 id='name'></h6>\n" +
    "                            <p id='price'></p>\n" +
    "                        </li>"
function checkoutPricing(items) {

}

export function fillCart(cartItems) {
    console.log(cartItems)
    //create list of all businesses bought from
    var stores_involved = {}
    var total=0;
    for (var i = 0; i <cartItems.length ; i++) {

        var html = $(checkout_product)

        if(stores_involved[cartItems[i].businessName]===undefined){
            //add an Li
            var li = $("<li rel=''><span style='margin-right: 0px'></span></li>")
            li.attr("rel",cartItems[i].businessName), li.text(cartItems[i].businessName)
            li.append("<span>"+cartItems[i].price+"</span>")
            $(".price-list").append(li)
            stores_involved[cartItems[i].businessName]=cartItems[i].price
        }else {
            var li = $('.price-list').find("[rel='" + cartItems[i].businessName + "']")

            li.find("span").text(parseInt(li.find("span").text())+parseInt(cartItems[i].price))
            li.find("span").text(price(li.find("span").text()))
            stores_involved[cartItems[i].businessName]=stores_involved[cartItems[i].businessName] + cartItems[i].price
        }

        html.find("#thumb-img").attr("src",productImgPrefix+cartItems[i].productId)
        html.find("#name").text(cartItems[i].productName)
        html.find("#price").text(cartItems[i].symbol+ price(cartItems[i].price))
        $(".product-list").append(html)
        total=total+parseInt(cartItems[i].price);
    }
    $('.grand-total').text(price(total))


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
    "                        <p id=\"name\"></p>\n" +
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
    "                <h6 class=\"price\">K 2,054</h6>\n" +
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
                //    todo:: fix this...it might not be an auth error causing it to fail
                window.location.href='/users/login'
            }
            }
        },error:function (msg) {
        //
        }
    })
}
function follow(vendorId){
    $.ajax({
        url:"/users/follow/vendor",
        type:"POST",
        data:{vendorId:vendorId},
        success:function (msg) {
            if(msg.code===200){
                //    add
                alert("success")
            }else if(msg.code===403){

                    window.location.href='/users/login'

            }
        },error:function (msg) {
            //
            alert ("error")
        }
    })
}

export function genSearchProductTemplate(details) {
    var template = $(search_product)

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
        alert("/products/product/?productId="+details.productId)
        window.location.href = "/products/product/?productId="+details.productId;
    })
    template.find("#price").text("ZMK "+price(details.price))
    return template
}
export function storeProductTemplate(details) {
    var template = $(store_product)
    template.find("img").attr('src',"/products/images?productId="+details.productId)
    template.find("#name").text(details.productName)
    template.find("img").on("click",function (e) {
        window.location.href("/products/product/?productId="+details.productId);
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







var product = "<div class=\"attribute\">\n" +
    "                    <label>Select</label>\n" +
    "                    <span><select class=\"form-control\" name=\"\" rel=\"\"></span>\n" +
    "\n" +
    "                    </select>\n" +
    "                    </div>" +
    ""

export class sort_attributes{

    constructor(attrs) {

        this.attrs=attrs
        this.variantNames=[]
        this.attr_reorg={}
        let self=this
        this.other={}

        for (let i = 0; i < attrs.length; i++) {
            //create reorganised json of attrs
            console.log(attrs[i])
            var variantName = attrs[i].variantName
            var variantValue = attrs[i].value
            //horrible code but i'm tired
            this.other[attrs[i].variationId]={}
            this.other[attrs[i].variationId]["quantity"]= attrs[i]["quantity"]
            this.other[attrs[i].variationId]["price"]= attrs[i]["price"]
            var variationId = attrs[i].variationId
            if(this.attr_reorg[variantName]===undefined){
            //    add it to object
                this.attr_reorg[variantName]={}
            //    create selector for variant name
                let selectParent = $("<div class='col-sm-10'></div>")
                let select = $("<select class='customSelector'></select>")
                selectParent.append(select)
                let div = $("<div class='form-group row'></div>")

                let label =$("<label class='col-sm-2 col-form-label'></label>")
                select.attr("id", variantName);select.attr("name", variantName);
                label.attr("for", variantName);label.text(variantName+":")
                div.append(label);div.append(selectParent)
                let option = $("<option value='0'>Select</option>")
                select.append(option)

                select.on('focus', function (e){

                    self.clearDisabled(select)
                    self.filterOptions(select)


                })
                select.on('change', function (e) {
                    self.checkQuantity()
                })
                $(".attributes").append(div)
            }

            if(this.attr_reorg[variantName][variantValue]===undefined){
            //    create and add variation Id
                this.attr_reorg[variantName][variantValue]=[variationId]
            //    add option here
                let option = $("<option></option>")
                option.attr("value", variantValue);option.text(variantValue)

                $("#"+variantName).append(option)
            }else {
            //    just add variation Id
                this.attr_reorg[variantName][variantValue].push(variationId)
            }
            this.variantNames.indexOf(variantName)===-1 ? this.variantNames.push(variantName) :""

        }

    }
    checkQuantity(){

        var selectorArray = $.find("select");
        let comparisonArray = []
        let allFilled = true
        for (let i = 0; i < selectorArray.length; i++) {
            if($(selectorArray[i]).val()!=="0"){
                // get selector and selected option
                let attribute = $(selectorArray[i]).attr("id")
                let value = $(selectorArray[i]).val();
                comparisonArray.push(this.attr_reorg[attribute][value])



            }else {
                allFilled=false
            }
        }

        let quantity = 0

        let variationIds = comparisonArray.shift().filter(function(v) {
            return comparisonArray.every(function(a) {
                return a.indexOf(v) !== -1;
            });
        });

        for (let i = 0; i < variationIds.length; i++) {
            let varId = variationIds[i]
            let qty = this.other[varId]["quantity"]

            quantity = quantity+qty

        }
        $("#stock").text(quantity)

        if(allFilled===true){
            $("#variationId").val(variationIds[0])
        }else {
            $("#variationId").val("")
        }

        if(variationIds.length===1){
            if(this.other[variationIds[0]]["price"]!==undefined){
                $("#price").text(price(this.other[variationIds[0]]["price"]))
            }
        }


    }
    filterOptions(select){
        // loop through remaining selectors and get value
    //    if value is 0 then no options have been clicked



        var selectorArray = $.find("select").filter(e => e !== select[0])

        var chosen = {}

        for (let i = 0; i < selectorArray.length; i++) {
            if($(selectorArray[i]).val()!=="0"){
                // get selector and selected option
                let attribute = $(selectorArray[i]).attr("id")
                let value = $(selectorArray[i]).val();
                chosen[attribute]=this.attr_reorg[attribute][value]


            }
        }
        let options = $(select[0]).find("option")
        let selectedAttr = $(select[0]).attr("id")


        for (let i = 0; i < options.length; i++) {
            let option = $(options[i])
            if(option.attr("value")!=="0"){
               let value = option.val()

                // console.log("inner",)
                //of these options find one with an attr that has a variation id present in the selected ones
                let comparisonArray = []

                for (let j = 0; j < Object.keys(chosen).length; j++) {
                   
                    comparisonArray.push(chosen[Object.keys(chosen)[j]])
                }
                let shouldInclude =this.attr_reorg[selectedAttr][value]
                comparisonArray.push(shouldInclude)

                // shouldMatch.push(shouldInclude)
                let result = comparisonArray.shift().filter(function(v) {
                    return comparisonArray.every(function(a) {
                        return a.indexOf(v) !== -1;
                    });
                });
               if(result.length===0){
                   option.attr("disabled","true")
               }else {
                   option.removeAttr("disabled")
               }




            }
        }

    }
    addOptions(selector) {

    }
    clearDisabled(selected){
        let options = $(selected).find("option")

        // options.each(e=>{$(e).removeAttr("disabled")})
    }



}


export function organise_attributes(attrs, exc_attr, exc_val){
    var variantNames=[]
    for (let i = 0; i < attrs.length; i++) {

        var newItem = attrs[i].variantName

        variantNames.indexOf(newItem)===-1 ? variantNames.push(newItem) :""

    }


}
function filter(changed,attrs_json){
    organise_attributes(attrs_json,$(changed).attr('name'), $(changed).val())
}


