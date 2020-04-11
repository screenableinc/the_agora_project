
function getCategories() {
    $("#categories").empty()
    $.ajax({
        url:"/products/categories/all",
        type:"GET",
        success: function (categories) {
            categories=categories.response
            for (var i = 0; i < categories.length; i++) {
                var option = $("<option value="+ categories[i].categoryId +">"+ categories[i].name +"</option>")
                $("#categories").append(option)
            }
        },
        error:function (err) {
            alert("something went wrong, please reload")
        }
    })
}
function attachListeners() {
    //todo :: change to get these only when required
    console.log("clicked")

    $("#signUpForm").on("submit", function (e) {
        e.preventDefault();
        function genRandToken(range, callback) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

            for (var i = 0; i < range; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return callback(text);
        }
        console.log("okay")
        var token = genRandToken(15,function (token) {
            return token
        })
        $("#businessId").val(token)
        $.ajax({
            url: "/business/join",
            type: "POST",
            data: $("#signUpForm").serializeArray(),
            success: function (msg) {
                console.log(msg)
                if (msg.code === 100) {
                    window.location.replace("/business/dashboard");
                } else {
                    alert("error")
                }

            }
        })
    })
    $("#actualLoginForm").on("submit", function (e) {

        e.preventDefault()
        $.ajax({
            url: "/business/login",
            type: "POST",
            data: {businessId: $("#loginBId").val(), password: $("#loginBpassword").val()},
            success: function (msg) {
                if (msg.code === 100) {
                    window.location.replace("/business/dashboard");
                } else {
                    alert("error")
                }

            }
        })
        return false
    })
}
getCategories()

attachListeners()