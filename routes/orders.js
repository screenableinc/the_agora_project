var express = require('express');
var router = express.Router();
var ordersDb = require('../modules/dbOps/ordersDbOp')
var parameterize = require('../modules/dbOps/parameterize')
var notify = require('../modules/notify')
var pay = require('../modules/pay')
var config = require("../modules/CONFIG")
router.get('/',function (req, res, next) {

});
router.get('/order',function (req, res, next) {
    // handle payment stuff here
    pay.makePayment({orderId:req.query.orderId, amount:req.query.amount.toString(), currency:req.query.currency,reference:"0970519299"})
    res.send("done")



    //variationID username
    // var details = JSON.parse(req.body.details);

    // console.log(req.body)
    // try {
    //     let username = req.body.username;
    //     let paymentOption = req.body.paymentOption
    //     let variationId = req.body.variationId
    //     let productId = req.body.productId;
    //     ordersDb.makeOrder("iamwise_offici55al",paymentOption,variationId, productId, function (msg) {
    //
    //         res.send(msg)
    //     })
    // }catch (e) {
    //     throw e;
    // }


})
router.get('/checkout', function (req, res, next) {
    res.render('checkout')
})

//TODO technically anyone can approve orders, fix this!
router.post('/approve',function (req, res, next) {
//    send message that order has been seen and accepted
//    todo:remember to alter quantities
    let vendorName = req.body.vendorName;
    let productName = req.body.productName;
    let variation = req.body.variation;
    let username = req.body.username;
    //get the order id approve order and notify user
    ordersDb.approveOrder(req.body.orderId,vendorName,productName,variation, username,function (msg) {
        //notify user

        res.send(msg)
    })

    


})
router.post('/reject', function (req, res, next) {
    ordersDb.rejectOrder(req.body.id, function (msg) {
        res.send(msg)
    })
})




module.exports = router;