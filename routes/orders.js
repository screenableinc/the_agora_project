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



router.post('/reject', function (req, res, next) {
    ordersDb.rejectOrder(req.body.id, function (msg) {
        res.send(msg)
    })
})

// GET ALL ORDERS
router.get('/all', function (req, res, next) {

    ordersDb.getUserOrders(req.query.userId, function (msg) {
        res.send(msg);
    });

})




module.exports = router;