$(document).ready(function () {
    var g_var_categories=[]
    function reverseGeoCode(lat,lng) {
        var latlng;
        latlng = new google.maps.LatLng(lat, lng); // New York, US


        new google.maps.Geocoder().geocode({'latLng' : latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    var country = null, countryCode = null, city = null, cityAlt = null;
                    var c, lc, component;
                    for (var r = 0, rl = results.length; r < rl; r += 1) {
                        var result = results[r];

                        if (!city && result.types[0] === 'locality') {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];

                                if (component.types[0] === 'locality') {
                                    city = component.long_name;
                                    break;
                                }
                            }
                        }
                        else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];

                                if (component.types[0] === 'administrative_area_level_1') {
                                    cityAlt = component.long_name;
                                    break;
                                }
                            }
                        } else if (!country && result.types[0] === 'country') {
                            country = result.address_components[0].long_name;
                            countryCode = result.address_components[0].short_name;
                        }

                        if (city && country) {
                            break;
                        }
                    }

                    console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
                }
            }
        });
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
        console.log(g_var_categories)
        var row = $("<tr></tr>")
        var tds = [$("<td>"+ object.productId +"</td>"),
        $("<td>"+ object.productName +"</td>"),
        $("<td>"+ g_var_categories[object.categoryId] +"</td>"),
       $("<td>"+ object.barcode +"</td>"),
        $("<td>"+ object.price +"</td>"),
        $("<td>"+ object.description +"</td>"),
        $("<td>"+ object.deliverable +"</td>")]
        $(tds).each(function () {

            row.append(this)
        })


        $("#itemsTableBody").append(row)
        console.log("called")

    }
    function addToOrdersTable(object) {

        var row = $("<tr></tr>")
        var tds = [$("<td>"+ object.productName +"</td>"),
            $("<td>"+ object.username +"</td>"),
            $("<td>"+ object.quantity  +"</td>"),
            $("<td>"+ object.price +"</td>"),
            $("<td>"+ object.phoneNumber +"</td>"),
            $("<td>"+new Date(object.timestamp)  +"</td>")]
        $(tds).each(function () {

            row.append(this)
        })


        $("#ordersTableBody").append(row)


    }
    function getItemsForSale() {
        $.ajax({
            url:"/products/all",
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
                console.log(msg)
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
                console.log()
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

    $('.dataTables_length').addClass('bs-select');
    $("#locationModal").on('show.bs.modal',function () {

        //remember to move into function
        map = new google.maps.Map(document.getElementById('map'), {
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
    })
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
    $("#uploadImage").change(function () {
        readURL(this,"#triggerUpload")
    })
    $("#triggerUpload").on("click",function () {
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
        e.preventDefault();
        var productId = genRandToken(10,function (token) {
            return token
        })

        $("#productId").val(productId)
        if($("#uploadImage").val()!=='') {
            var fd = new FormData($("#addItemForm").get(0))
            var dataForTable = $("#addItemForm").serializeArray()
            prepareForTable(dataForTable)

            $.ajax({
                url: "/products/additem",
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

            })
        }else {
            alert("Please upload an image")
        }
    })
    getItemsForSale()
    getAllOrders()
    loadCategories()
});