let nodemailer = require('nodemailer')
let hbs = require('handlebars')
let emailT = require('../modules/emailTemplates')
let https = require('https');
let axios = require('axios');
let deployed = require('../modules/CONFIG');
const querystring = require("node:querystring");
const senderAddress = "vendnbuy@vendnbuy.com"
const host='business158.web-hosting.com'
const port=465
const password = 'pvDRuHT{Z7%2'
let bulkSMSkey = "2eeca676d357a7313a58fbb075d41431"
let bulkSMSlink = "https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key/:api_key/contacts/:contacts/"
//pass phone number of agoran or email, order total, productname,variation, vendor name
function sendCode(phone,code, callback){
    //todo::make this code less repetitive
    let message = `Hi! Your vendNbuy verification code is ${code.toString()} `;
    message=encodeURIComponent(message)
    console.log(message)
    let link = `/api/v2.1/action/send/api_key/${bulkSMSkey}/contacts/${phone}/senderId/VENDNBUY/message/${message}`
    console.log(link)
    const options = {
        hostname: 'bulksms.zamtel.co.zm',
        port: 443,
        path: link,
        method: 'GET',
        headers: {
            'Accept': 'plain/html',
            'Accept-Encoding': '*',
        }
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log('headers:', res.headers);

        res.on('data', d => {
            process.stdout.write(d)
        })
    })


    let errorOccurred = false;

    req.on('error', error => {
        console.log(error);
        errorOccurred = true;
        // callback({"code":500});
        // alert developer
    });

    req.end();

    if (!errorOccurred) {
        return callback({"code":69});
    }
}

function payToMobile(orderId, number, callback){
//     call plutus
    const data = {
        MSISDN: number,
        transactionId: orderId
    }
    axios.post("http://127.0.0.1:5000/api/pay/mtn", data).then((res)=>{
        return callback(res.data)

    }).catch((err)=>{
        // log err
        return callback({"success":false, code: 501})
    })



}
function cardPay(data, callback) {
    //     call plutus

    axios.post("http://127.0.0.1:5000/api/pay/card", data).then((res)=>{
        return callback(res.data)

    }).catch((err)=>{
        // log err
        return callback({"success":false, code: 501})
    })
}

function orderRespond(email, phone,vendorName, total, fullname,productName,variation,quantity, type, response) {

    //    type should be 1 for email, 2 for text, 0 for both
    //get phone number of user and vendor

    function text(){
        console.log('called '+phone)
        let message = (response==="1") ? `Order approved for ${productName}. variation: ${variation}. qty: 1. Order total is ${total} Thank you for shopping at ${vendorName} via VENDnBUY`: `Order rejected for ${productName}. If you paid online, you should receive a refund soon`;
        message=encodeURIComponent(message)
        let link = `/api/v2.1/action/send/api_key/${bulkSMSkey}/contacts/${phone}/senderId/VENDNBUY/message/${message}`

        const options = {
            hostname: 'bulksms.zamtel.co.zm',
            port: 443,
            path: link,
            method: 'GET',
            headers: {
                'Accept': 'plain/html',
                'Accept-Encoding': '*',
            }
        }

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
            console.log('headers:', res.headers);

            res.on('data', d => {
                process.stdout.write(d)
            })
        })


        req.on('error', error => {
            console.error(`Error on Get Request --> ${error}`)
            // alert developer
        })

        req.end()
    }
    function email(){
        let json = {
            price:price,qty:quantity,subTotal:price*quantity, userName: fullname, orderId:"1",vlink: "/vendorlink",imageUrl:"/picurl",productName:productName, variations:variations
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
    orderRespond:orderRespond,
    sendCode:sendCode,
    pay:payToMobile,
    cardPay:cardPay

}