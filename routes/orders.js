var express = require('express');
var router = express.Router();
var ordersDb = require('../modules/dbOps/ordersDbOp')
var parameterize = require('../modules/dbOps/parameterize')
var notify = require('../modules/notify')
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


router.post('/approve',function (req, res, next) {
//    send message that order has been seen and accepted
//    todo:remember to alter quantities
    let vendorName = req.body.vendorName;
    ordersDb.approveOrder(req.body.id, function (msg) {
        //notify user
        notify.orderAccept(vendorName,26, "sccj","Macbook Pro 2015","Cash","red",22,1)
        res.send(msg)
    })

    


})
router.post('/reject', function (req, res, next) {
    ordersDb.rejectOrder(req.body.id, function (msg) {
        res.send(msg)
    })
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