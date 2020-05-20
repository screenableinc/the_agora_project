$(document).ready(function () {
    var home = "<div class=\"header-top\">\n" +
        "\t\t\t<div class=\"container\">\n" +
        "\t\t\t\t<div class=\"row\">\n" +
        "\t\t\t\t\t<div class=\"col-lg-2 text-center text-lg-left\">\n" +
        "\t\t\t\t\t\t<!-- logo -->\n" +
        "\t\t\t\t\t\t<a href=\"/\" class=\"site-logo\">\n" +
        "\t\t\t\t\t\t\t<img src=\"/img/logo_s.png\" alt=\"\">\n" +
        "\t\t\t\t\t\t</a>\n" +
        "\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t<div class=\"col-xl-6 col-lg-5\">\n" +
        "\t\t\t\t\t\t<form id=\"search\" class=\"header-search-form\" method=\"GET\" action=\"/search\">\n" +
        "\t\t\t\t\t\t\t<input type=\"text\" placeholder=\"Search....\" id=\"searchInput\" name=\"qs\">\n" +
        "\t\t\t\t\t\t\t<button><i class=\"material-icons\">search</i></button>\n" +
        "\t\t\t\t\t\t</form>\n" +
        "\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t<div class=\"col-xl-4 col-lg-5\">\n" +
        "\t\t\t\t\t\t<div class=\"user-panel\">\n" +
        "\t\t\t\t\t\t\t<div class=\"up-item\">\n" +
        "\t\t\t\t\t\t\t\t<i class=\"material-icons\">person</i>\n" +
        "                                <span><a href=\"#\" id=\"username\"></a></span>\n" +
        "\t\t\t\t\t\t\t\t<a id=\"signInOption\" href=\"/users/login\">Sign In</a>\n" +
        "\t\t\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t\t\t<div class=\"up-item\">\n" +
        "\t\t\t\t\t\t\t\t<div class=\"shopping-card\">\n" +
        "\t\t\t\t\t\t\t\t\t<i class=\"material-icons\">shopping_cart</i>\n" +
        "\t\t\t\t\t\t\t\t\t<span id=\"cartItemCount\">0</span>\n" +
        "\t\t\t\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t\t\t\t<a href=\"#\">Shopping Cart</a>\n" +
        "\t\t\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t\t</div>\n" +
        "\t\t\t\t\t</div>\n" +
        "\t\t\t\t</div>\n" +
        "\t\t\t</div>\n" +
        "\t\t</div>\n" +
        "\n" +
        "        <nav class=\"main-navbar\">\n" +
        "            <div class=\"container\">\n" +
        "                <!-- menu -->\n" +
        "                <ul id=\"navbar\" class=\"main-menu\">\n" +
        "\n" +
        "                </ul>\n" +
        "            </div>\n" +
        "        </nav>"

    function attachHeader() {
        $("#header").append($(home))
    }
    function appendToHTML(categories) {
        console.log(categories)
        for (var i = 0; i < categories.length; i++) {
            var element = $("<li><a href=''>" + categories[i].name + "</a></li>")
            element.find('a').attr('href','/categories/view?categoryId='+categories[i].categoryId)
            $("#navbar").append(element)
        }
    }
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
        req("/categories?which=categories","GET",function (msg) {
            if(msg.code===200){
                appendToHTML(msg.response)
            }
        })

    }
    function getCart() {
        req("/users/cart/items","GET",function (msg) {
            if(msg.code===200){
                $("#cartItemCount").text(msg.response.length)
                $("#username").text(msg.username)
                $("#signInOption").css("display","none")
            }
        })
    }
    function search(){
        // $("#searchInput").on('keypress',function(e){
        //     if(e.which===13){
        //         $("#search").attr('action','/search?qs=asdasd')
        //        $("#search").trigger("submit")
        //     }
        // })
        // $("#search").on('submit', function (e) {
        //     $("#search").attr('action','/search?qs=asdasd')
        // })
    }
    attachHeader()
    search()
    getCart()
    loadCategories()
})