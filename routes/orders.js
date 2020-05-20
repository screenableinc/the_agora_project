var express = require('express');
var router = express.Router();
var ordersDb = require('../modules/dbOps/ordersDbOp')
var config = require("../modules/CONFIG")
router.get('/',function (req, res, next) {

});
router.post('/order',function (req, res, next) {
    var details = JSON.parse(req.body.details);

    try {
        var username = req.signedCookies[config.gvs.userAuthTokenName].username
        ordersDb.makeOrder(details,function (msg) {
            res.send(msg)
        })
    }catch (e) {
        throw e;
    }


})


router.post('/accept',function () {
//    send message that order has been seen and accepted


})
router.get('/all',function (req, res, next) {
    try {
        var businessId = req.signedCookies[config.gvs.businessAuthTokenName].businessId;
        ordersDb.getOrders(businessId,function (msg) {
            res.send(msg)
        })
    }catch (e) {
        throw e
    }
})



module.exports = router;