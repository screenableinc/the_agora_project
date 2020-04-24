import * as templating from './templateBuilders/template.js'
$(document).ready(function () {
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


    var incoming = JSON.parse($("#incomingResults").text())
    for (var i = 0; i < incoming.length; i++) {
        console.log(incoming[i])
        $("#products").append(templating.genSearchProductTemplate(incoming[i]))
    }

    // if(incoming===""){
    //     console.log(incoming)
    // }else{
    //     // window.location.href="/"
    // }
})