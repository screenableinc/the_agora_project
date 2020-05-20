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

function store(req, callback){
    var productId = req.body.productId;
    var businessId = req.signedCookies.businessAuth.businessId

    var identifier = Date.now()+productId
    productId=productId+"_"+businessId;

    var _filename = identifier+".jpg";
    productsDb.addProductImageIdentifier(identifier,productId,function (msg) {
        if(msg.code===200){
        //    store file
            console.log(req.body.image)
            var data=Buffer.from(req.body.image.split('base64,')[1],'base64')

            fs.writeFileSync(__dirname.replace("routes","images/products/"+_filename),data)
            return callback({success: true})
        }else {
            console.log(msg.response+"error")
            return callback({success:false})
        }
    })

}
var upload = multer({storage:storage})

router.get('/product', function (req, res, next) {
    var productId = req.query.productId;
    productsDb.getProduct(productId,function (msg) {
        if(msg.code===200){
            var product = msg.response[0]
            res.render("product",{product:JSON.stringify(product)})

        }else {
            res.redirect("/")
        }
    })
})
router.get('/categories/all',function (req, res, next) {
    productsDb.getCategories(function (msg) {

        res.send(msg)
    })
});

router.get('/latest',function (req, res, next) {
    productsDb.getLatestProducts(function (msg) {
        res.send(msg)
    })
})

router.get('/all',function (req, res, next) {
    var cookie = req.signedCookies
    if(cookie===undefined){
        res.redirect("login")
    }else {

        productsDb.getProducts(cookie.businessAuth.businessId, function (msg) {

            res.send(msg)
        })
    }
});

router.post('/additem', upload.single("image"),async function (req, res, next) {

    var cookie = req.signedCookies
    var productId = req.body.productId;var descr = req.body.description;var categoryId = req.body.category;
    var price = req.body.price;
    var quantity = req.body.quantity;var barcode = req.body.barcode;
    var productName = req.body.productName
    var genericName = req.body.genericName
    var currency = req.body.currency

    var deliverable = parseInt(req.body.deliverable);



    if(cookie===undefined){
        res.redirect("login")
    }else {
        var businessId = cookie.businessAuth.businessId
        productId = productId+"_"+businessId
        productsDb.addProduct(businessId,productId,descr,price,deliverable,quantity,barcode, categoryId,productName,genericName,currency,function (msg) {

            if(msg.success) {
                store(req, function (good) {
                    (good.success)? res.send(msg):res.send(good)
                })
            }else {
                res.send(msg)
            }
        })
    }
})

router.post("/delete",function (req, res, next) {
    var productId = req.body.productId
//    TODO secure this to only user and make sure no one has order before deleting
    productsDb.deleteProduct({productId:JSON.stringify(req.body.productId)},function (msg) {
        res.send(msg)
    })
})
router.get("/images", function (req, res, next) {
    var productId = req.query.productId;

    productsDb.getImageIdentifier(productId, function (msg) {

        if(!msg.success){
        //    send generic pic
            const path = __dirname.replace("routes","images/products/default.jpg");
            res.sendFile(path)
        }else {
            var imagename =  msg.response[0].identifier+".jpg"


            const path = __dirname.replace("routes","images/products/"+imagename);

            if (fs.existsSync(path)){
                //    send file
                res.sendFile(path)
            }else {
                const path = __dirname.replace("routes","images/products/default.jpg");
                res.sendFile(path)
            }
        }
    })
})



module.exports = router;