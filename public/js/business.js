$(document).ready(function () {
    var g_var_categories=[]

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
                }else {
                //    todo::show error
                }
            },
            error:function () {

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
    $('#ordersTable').DataTable();
    $('.dataTables_length').addClass('bs-select');
    $("#addItems").on("click", function (e) {
        $("#addItemModal").modal()
    })

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {


                $('#triggerUpload').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
            //    start upload

            // $("#upload").on("submit",function (e) {
            //     e.preventDefault()
            //     console.log($("#electionId").text())
            //     $("#filename").val($("#electionId").text())
            //     var data = new FormData(this)
            //     $.ajax({
            //         type:"POST",
            //         contentType:false,
            //         processData:false,
            //         url:"/candidates/imageUpload",
            //         data:data,
            //         success:function (err) {
            //             console.log("sdd")
            //         },
            //         error:function (err) {
            //             console.log(err)
            //         }
            //     })
            // })


        }
    }
    $("#uploadImage").change(function () {
        readURL(this)
    })
    $("#triggerUpload").on("click",function () {
        $("#uploadImage").trigger("click")
    })
    $("#addItemForm").on("submit",function (e) {
        e.preventDefault();
        var productId = genRandToken(10,function (token) {
            return token
        })

        $("#productId").val(productId)
        if($("#uploadImage").val()!=='') {
            var fd = new FormData($("#addItemForm").get(0))

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
    loadCategories()
});