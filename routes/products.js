var express = require('express');
var router = express.Router();
var productsDb = require('../modules/dbOps/productDbObs.js')
var fs = require("fs")
var multer = require("multer")
var storage = multer.diskStorage({
    destination:"./images/products/",
    filename:function (req, file, cb) {
        console.log(JSON.stringify(file))


        var productId = req.body.productId;
        var businessId = req.signedCookies.businessAuth.businessId

        var identifier = Date.now()+productId
        productId=productId+"_"+businessId;
        console.log("ident "+identifier)
        _filename = identifier+".jpg";
        productsDb.addProductImageIdentifier(identifier,productId,function (msg) {
            if(msg.code===200){
                cb(null, _filename)
            }else {
                console.log(msg.response+"error")
                cb(null,"")
            }
        })




    }
})
var upload = multer({storage:storage})


router.get('/categories/all',function (req, res, next) {
    productsDb.getCategories(function (msg) {

        res.send(msg)
    })
});

router.get('/all',function (req, res, next) {
    var cookie = req.signedCookies
    if(cookie===undefined){
        res.redirect("login")
    }else {

        productsDb.getProducts(cookie.businessAuth.businessId, function (msg) {
            console.log("here")
            res.send(msg)
        })
    }
});

router.post('/additem', upload.single("image"),async function (req, res, next) {
    console.log("okay in fun")
    var cookie = req.signedCookies
    var productId = req.body.productId;var descr = req.body.description;var categoryId = req.body.category;
    var price = req.body.price;
    var quantity = req.body.quantity;var barcode = req.body.barcode;
    var productName = req.body.productName
    var deliverable = parseInt(req.body.deliverable);
    console.log(req.file)


    if(cookie===undefined){
        res.redirect("login")
    }else {
        var businessId = cookie.businessAuth.businessId
        productId = productId+"_"+businessId
        productsDb.addProduct(businessId,productId,descr,price,deliverable,quantity,barcode, categoryId,productName,function (msg) {
            console.log(msg)
            res.send(msg)
        })
    }
})



module.exports = router;