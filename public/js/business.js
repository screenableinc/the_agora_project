import * as manipulate from './clientmodules/mani.js'
import * as templating from './templateBuilders/template.js'
import * as tableToJSON from './clientmodules/product_attributes.js'
// import {orderDetails} from "../../modules/emailTemplates";
$(document).ready(function () {
    //function overlay height

    function dateformat(timestamp) {
        let date = new Date(timestamp)
        let month = date.getMonth()+1
        let day = date.getDate()
        let year = date.getFullYear();
        let hours = (date.getHours()===0)? 24:date.getHours()
        let minutes = (date.getMinutes() < 10) ? "0"+date.getMinutes():date.getMinutes()
        let seconds = (date.getSeconds() < 10) ? "0"+date.getSeconds():date.getSeconds()
        let time = hours +":"+ minutes+":"+seconds
        let fulldate = day+"-"+month+"-"+year + " " + time
        return fulldate
    }

    $("#overlay").css('height',$("#banner").height())
    // console.log($("#banner").height())



    var g_var_categories=[]

    function product_attribute_change(){

    }

    function geoLocate(map) {
        var infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position)
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };


                infoWindow.setPosition(pos);
                map.zoom=15
                infoWindow.setContent('Estimate');
                infoWindow.open(map);
                $("[name=lat]").val(pos.lat)
                $("[name=long]").val(pos.lng)
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }


    function addToItemsTable(object) {

        var row = templating.genItemsTemplate([object.productId, object.productName,object.categoryId,object.barcode,object.price, object.description,object.deliverable])




        $("#itemsTableBody").append(row)


    }
    function addToOrdersTable(object) {


        var row = $("<tr></tr>")
        let actioncol=$("<td></td>")
        let loader = $("<div style='display: none' class=\"loadingio-spinner-dual-ring-2hfni47dp4f\"><div class=\"ldio-0wpc099mxpr\">\n" +
            "<div></div><div><div></div></div>\n" +
            "</div></div>")
        let status_icon;
        switch (object.status){
            case 1:
                status_icon = $("<i style='color: #0fd03f' class=\"material-icons\">task</i>")
                break;
            case 2:
                status_icon = $("<i style='color: #d00f0f' class=\"material-icons\">free_cancellation</i>");
                break;
            default:
                status_icon = $("<i style='color: #ffbf00' class=\"material-icons\">warning_amber</i>")

        }

        actioncol.append(status_icon)
        console.log(object.timestamp)

        var tds = [$("<td>"+ object.productName +"</td>"),
            $("<td>"+ object.username +"</td>"),
            $("<td>"+ object.quantity  +"</td>"),
            $("<td>"+ object.price +"</td>"),
            $("<td>"+ object.phoneNumber +"</td>"),
            //come back to this
            $("<td>"+dateformat(object.timestamp)  +"</td>"), actioncol]
        $(tds).each(function () {

            row.append(this)
        })

        var dropDown = "<div class=\"dropdown\">\n" +
            "  <a style='background-color: #0ca2e2' class=\"btn btn-sm dropdown-toggle\" href=\"#\" role=\"button\" id=\"dropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
            "    Action\n" +
            "  </a>\n" +
            "\n" +
            "  <div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuLink\">\n" +

            "  </div>\n" +
            "</div>"
        dropDown = $(dropDown)
        //decide on which options to show depending on status
        //status is such that 0 is pending, 1 is accepted, and 2 is approved
        let approval = $("<a class='dropdown-item' href=''>Approve</a>")
        let rejection = $("<a class='dropdown-item' href=''>Reject</a>")
        let message = $("<a class='dropdown-item' href=''>Contact Buyer</a>")
        function toggleLoader() {


            if(dropDown.css("display")==="none"){

                loader.css("display","none")
                dropDown.css("display","block")
            }else {

                loader.css("display","block")
                dropDown.css("display","none")
            }
        }
        function approve() {
            approval.on('click', function (e) {
                e.preventDefault()
            //    load loader
                toggleLoader()
                $.ajax({
                    type:"POST",
                    url:"/orders/approve",
                    data:{orderId:object.orderId},
                    success:function () {
                        status_icon.css('color','#0fd03f').text("task")
                        toggleLoader()
                    },
                    error: function (err) {
                        toggleLoader()
                    }
                })


            })

        }
        function reject(){
            rejection.on('click', function (e) {
                e.preventDefault()
                //    load loader
                toggleLoader()
                $.ajax({
                    type:"POST",
                    url:"/orders/reject",
                    data:{id:object.orderId},
                    success:function () {
                        status_icon.css('color','#d00f0f').text("free_cancellation")
                        toggleLoader()
                    },
                    error: function (err) {
                        toggleLoader()
                    }
                })


            })
        }
        switch(object.status){
            case 0:
        //        load all actions
                approve();reject()
                break;
            case 1:
        //        load only messaging


        }
        dropDown.find('.dropdown-menu').append(approval).append(rejection).append(message)
        // dropDown.append(approval); dropDown.append(rejection); dropDown.append(message)

        row.append($("<td class='theactions'></td>").append(dropDown).append(loader))
        $("#ordersTableBody").append(row)


    }
    function getItemsForSale() {
        $.ajax({
            url:"products/all",
            type:"GET",
            success: function (msg) {
                if(msg.success){
                    if(msg.response.length!==0){
                        $("#itemsTableBody").empty()
                    }
                    for (var i = 0; i < msg.response.length; i++) {
                        addToItemsTable(msg.response[i])
                    }
                    $('#itemsTable').DataTable();
                    $("#itemsCount").text(msg.response.length)
                }else {
                //    todo::show error
                }
            },
            error:function () {

            }

        })
    }
    function getAllOrders() {

        $.ajax({
            url:"/orders/all",
            type:"GET",
            success: function (msg) {

                if(msg.success){
                    if(msg.response.length!==0){
                        $("#ordersTableBody").empty()
                    }
                    for (var i = 0; i < msg.response.length; i++) {
                        addToOrdersTable(msg.response[i])
                    }
                    $('#ordersTable').DataTable();
                }else {
                    //    todo::show error
                }
            },
            error:function (msg) {
                console.log(msg)
            }

        })
    }

    function genRandToken(range, callback) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

        for (var i = 0; i < range; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return callback(text);
    }

    function loadCategories(){
        $.ajax({

           url:"/products/categories/all",
           type:"GET",
           success: function (categories) {
               categories=categories.response

            for (var i = 0; i < categories.length; i++) {
                g_var_categories.push(categories[i].categoryId)

                // g_var_categories[categories[i].categoryId+" okay"]="okay"
                var option = $("<option value="+ categories[i].categoryId +">"+ categories[i].name +"</option>")
                $("#categories").append(option)
            }
        },
        error:function (err) {
            alert("something went wrong, please reload")
        }
        })
    }
    
    function loadCurrencies(){
        $.ajax({
            url:"/currencies/all",
            method:"GET",
            success:function (currencies) {
                currencies = currencies.response

                for (var i = 0; i < currencies.length; i++) {


                    // g_var_categories[categories[i].categoryId+" okay"]="okay"
                    var option = $("<option value="+ currencies[i].id +">"+ currencies[i].shorthand +"</option>")
                    $("#currencies").append(option)
                }
            },
            error:function () {
            //    TODO handle
            }
        })
    }

    $('.dataTables_length').addClass('bs-select');
    function loadMap() {

        //remember to move into function
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 34.397, lng: 150.644},
            zoom: 2
        });
        var marker="";
        google.maps.event.addListener(map,'click',function (event) {
            console.log(event)
            var lat = event.latLng.lat()
            var long = event.latLng.lng()
            $("[name=lat]").val(lat)
            $("[name=long]").val(long)
            if(marker===""){
               marker = new google.maps.Marker({position:{lat:lat,lng:long},map:map})
            }else {
                marker.setMap(null)
                marker = new google.maps.Marker({position:{lat:lat,lng:long},map:map})
            }

        })
        $("#geoLocate").on('click',function () {
            geoLocate(map)
        })
    }
    $("#locationSettings").on('click',function () {
        $("#locationModal").modal()
    })
    $("#saveLocation").on("click",function () {
        var lat = $("[name=lat]").val();
        var long = $("[name=long]").val()
        if(lat!=="" && long !==""){
        $.ajax({
            url:"/location/edit",
            type:"POST",
            data:{lat:lat,long:long},
            success:function (msg) {
                console.log(msg)
            },
            error:function (msg) {
                console.log(msg)
            }
        })
    }
    })
    $("#addItems").on("click", function (e) {
        $("#addItemModal").modal()
    })
    $("#runAd").on('click',function (e) {
        $("#adsModal").modal()
    })

    function prepareForTable(data) {
        var processed={}
        for (var i = 0; i < data.length; i++) {
            processed[data[i].name]=data[i].value
        }
        addToItemsTable(processed)
    }

    //TODO fix this repetitive code
    function readURLLogo(input,selector) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {


                $(selector).attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);

            ``

        }
    }
    function readURL(input,selector) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {


                $(selector).attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
            if(selector==="#logo"){

                var fd = new FormData($("#logoForm").get(0))
                $.ajax({
                    type:"POST",
                    contentType:false,
                    processData:false,
                    url:"/business/logo",
                    data:fd,
                    success:function (err) {
                        console.log("sdd")
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            }else if(selector===".banner"){
                var fd = new FormData($("#bannerForm").get(0))
                $.ajax({
                    type:"POST",
                    contentType:false,
                    processData:false,
                    url:"/business/banner",
                    data:fd,
                    success:function (err) {
                        console.log("sdd")
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            }

``

        }
    }
    manipulate.start("#uploadImage",document.getElementById('uploadImage'),document.getElementById('addItemForm'))
    $("#triggerUpload").on("click",function () {

        $("#imagefinal").remove()

        $("#uploadImage").trigger("click")
    })

    $("#bannerInput").change(function () {
        readURL(this,'.banner')
    })
    $(".banner").on('click', function(){
        $("#bannerInput").trigger('click')
    })

    $("#logoInput").change(function () {
        readURL(this,'#logo')
    })
    $("#logo").on('click', function(){
        $("#logoInput").trigger('click')
    })
    $("#addItemForm").on("submit",function (e) {
        //show loading gif
        // $(".loader").css('display','block');
        // $("#addItem").css("display","none");
        let attributes = tableToJSON.toJSON("#attrs_table_body")

        $("#attrs_input").val(JSON.stringify(attributes))
        e.preventDefault()


        var productId = genRandToken(10,function (token) {
            return token
        })

        $("#productId").val(productId)
        if($("#uploadImage").val()!=='') {
            var fd = new FormData($("#addItemForm").get(0))


            var dataForTable = $("#addItemForm").serializeArray()

            prepareForTable(dataForTable)

            $.ajax({
                url: "/business/additem",
                method: "POST",

                processData: false,
                contentType: false,
                data: fd,
                success: function (msg) {
                    if (msg.code === 200) {
                        $("form input, textarea").val("")
                        $('#triggerUpload').attr('src', "/images/add_photo.png");
                    }
                },
                error: function (err) {
                    console.log(err)
                    alert("err")
                }

            }).done(function (){
                // $(".loader").css('display','none');
                // $("#addItem").css("display","block");
                // $("#attrs_input").val("")
            })
        }else {
            alert("Please upload an image")
        }
    })
    function addNotifications(){

    }
    function getNotifications(){
        $.ajax({
            url:"/business/notifications?",
            method:"GET",
            success:function(res){
                if(res.response.code===200){
                    var count = res.response.result.length;
                    if(count>0) {
                        $("#notificationCount").text(count)
                        $("#notificationCount").css("display","block")
                    }
                }
            },
            error:function (res){
                console.log(res)
            }


        })
    }


    getItemsForSale()
    getAllOrders()
    loadCategories()
    loadCurrencies()
    getNotifications()
    loadMap()
});