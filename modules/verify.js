
var axios = require('axios')
var api_key = "2eeca676d357a7313a58fbb075d41431"
var senderId = "VENDnBUY"
var skeleton_link = "https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/"+api_key

//request to verify
//create verification code and store in server
//send code via text
//user checks if matches
function createCode(){

    return Math.floor(Math.random()*90000) + 10000;
}
function sendCode(number, callback) {
    var code=createCode();
    var message = "Welcome to vendnbuy, your verification code is:\n "+code
    var link = skeleton_link+"/contacts/"+number+"/senderId/"+senderId+"/message/"+message
    axios
        .get(link)
        .then(res => {
            if(res.data.success===true){
                return callback({success: true, code:200, vcode:code})
            }else{
                return callback({success:false, code: 400})
            }
        })
        .catch(error => {
            return callback({success:false, code:500})
        })
    
}

module.exports={
    sendCode:sendCode
}