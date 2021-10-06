let nodemailer = require('nodemailer')
let hbs = require('handlebars')
let emailT = require('../modules/emailTemplates')
const senderAddress = "vendnbuy@vendnbuy.com"
const host='server51.web-hosting.com'
const port=465
const password = 'pvDRuHT{Z7%2'

function orderAccept(vendorName, price,username,productName, method,variation,quantity, type) {

    //    type should be 1 for email, 2 for text, 0 for both
    function text(){
        let message = "Order approved for product name: " + productName+". variation: "+ variation +". qty: 1. Thank you " +
            "for shopping at "+vendorName+" via vendnbuy"


    }
    function email(){
        let json = {
            price:price,qty:quantity,total:price*quantity, method:method,vlink: "/vendorlink",piurl:"/picurl",productName:productName, plink:"link"
        }
        let template = hbs.compile(emailT.orderDetails)
        let html = template(json)
        sendMail("wisesibindi@gmail.com", html, "order accepted",function (){
        //    deal with that
        })


    }
    switch (type){
        case 1: email()
            break;
        case 2:text()
            break;
        case 0:email();text();
    }


}
function sendMail(email,html, subject, callback) {
    var transporter = nodemailer.createTransport({
        host: host,
        port: port,

        auth: {
            user: senderAddress,
            pass: password
        }
    });

    var mailOptions = {
        from: {
            name:"vendnbuy",
            address:senderAddress
        }, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html};

    transporter.sendMail(mailOptions, function (err, info) {
        if(err){

            return callback({success:false,error:err})}
        else
            callback({success:true, msg:info});
    });
}

module.exports = {
    orderAccept:orderAccept
}