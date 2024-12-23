var express = require('express');
var router = express.Router();
var productsDb = require('../modules/dbOps/productDbObs.js')
var fs = require("fs")
var multer = require("multer")





router.get('/variations', function (req, res, next) {
    var productId = req.query.productId;
    // console.log('Wise', productId);
    productsDb.getVariations(productId, function (msg) {
        msg['code']=200;

        res.send(msg)
    })
})
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

router.get ('/reviews', function (req, res, next){
    var id = req.query.productId
    productsDb.getReviews(id, function (msg){
        res.send(msg)
    })

})
router.get('/latest',function (req, res, next) {
    productsDb.getLatestProducts(function (msg) {

        res.send(msg)
    })
})



router.get("/discover", function (req, res, next){

    var last_timestamp = req.query.last_timestamp

    productsDb.discover(last_timestamp, function (msg){
        console.log("called")
        res.send(msg)
    })
})

router.get('/variants',function (req, res, next) {
    productsDb.variants(function (msg) {
        res.send(msg)
    })
})

router.get('/ordervariations', function (req, res, next) {
    var variationId = req.query.variationId;
    productsDb.getOrderVariations(variationId, function (msg) {

        res.send(msg)
    })
})



router.get("/images", function (req, res, next) {
    // TODO:: for proof of concept, i'll use a different fetching protocal for
    //     products with multiple images

    var productId = req.query.productId;
    var image_count = req.query.image_count;

    //products added from mobile have a longer productId consisting of 27 characters
    //let the logic of figuring out how many images are there and which one to query be done client-side

    function returnfile(path) {
        if (fs.existsSync(path)) {
            const stat = fs.statSync(path)
            const fileSize = stat.size
            const range = req.headers.range
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize - 1
                const chunksize = (end - start) + 1
                const file = fs.createReadStream(path, {start, end})
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'image/jpeg',
                }
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'image/jpeg',
                }
                res.writeHead(200, head)
                fs.createReadStream(path).pipe(res)
            }
            // res.sendFile(path)
        } else {
            const path = __dirname.replace("routes", "images/products/default.jpg");
            res.sendFile(path)
        }
    }

    if(productId.length>20){console.log("called")
    //    check image count length
    //    for now, I am only hardcoding as jpg
        if(image_count===undefined){
            //if no image count is specified, let the default be image '0'
            image_count=0
        }
        console.log("wise "+image_count);
        const path = __dirname.replace("routes", "images/products/" + image_count+productId+".jpg");
        console.log(path)
        returnfile(path)
    }else {
        console.log("now we're cooking")
        productsDb.getImageIdentifier(productId, function (msg) {


            if (!msg.success) {
                //    send generic pic
                const path = __dirname.replace("routes", "images/products/default.jpg");
                res.sendFile(path)
            } else {

                var imagename;
                try {
                    imagename = msg.response[0].identifier + ".jpg"
                } catch (e) {
                    imagename = "default.jpg"
                }


                const path = __dirname.replace("routes", "images/products/" + imagename);
                returnfile(path)

            }
        })
    }
    })





module.exports = router;