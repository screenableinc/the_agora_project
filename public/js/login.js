const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

var input = document.querySelector("#telephone");
var cc_instance = window.intlTelInput(input);

$("#telephone").on('countrychange',function (e) {
    cc_instance.getSelectedCountryData().dialCode;


})


$("#signUpForm").on("submit",function (e) {
    e.preventDefault();
    $("#cc").val(cc_instance.getSelectedCountryData().dialCode)
    console.log()

    $.ajax({
        type:"POST",
        url:"/users/join",
        data: $("#signUpForm").serializeArray(),
        success:function (msg) {
            if(msg.code===100){
            //    continue to home
                window.location.replace("/")

            }else {
                // err which field

                alert("Something went wrong, Try again")
            }
        }

    })

})
$("#loginForm").on("submit",function (e) {
    //    validate string
    e.preventDefault()
    var emailorusername = $("#identifier").val()
    var password  =$("#password").val()
    if(emailorusername.length < 5 || emailorusername===""){
    //    fix user name
    }else if(password === ""){

    }else{
        $.ajax({
            url:'/users/login',
            type:"POST",
            data:{identifier:emailorusername,password:password},
            success: function (msg) {
                if (msg.code===100){
                //    redirect to login
                }else if(msg.code===403){
                //    user not found
                    $("#wrong").css("display","block")
                }else {
                    // server error
                }
            },
            error: function(){
            //    alert to error
            }

        })
    }

})