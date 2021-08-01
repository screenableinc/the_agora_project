var express = require('express');
var router = express.Router();
var ordersDb = require('../modules/dbOps/ordersDbOp')
var parameterize = require('../modules/dbOps/parameterize')
var config = require("../modules/CONFIG")
router.get('/',function (req, res, next) {

});
router.post('/order',function (req, res, next) {
    var details = JSON.parse(req.body.details);

    try {
        let username = req.body.username;
        ordersDb.makeOrder(details,username,function (msg) {

            res.send(msg)
        })
    }catch (e) {
        throw e;
    }


})
router.get('/checkout', function (req, res, next) {
    res.render('checkout')
})


router.post('/accept',function () {
//    send message that order has been seen and accepted


})
router.get('/all',function (req, res, next) {
    try {
        var businessId = req.body.businessId;
        ordersDb.getOrders(businessId,function (msg) {
            res.send(msg)
        })
    }catch (e) {
        throw e
    }
})



module.exports = router;