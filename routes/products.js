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
        console.log('Wise', msg);
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
        res.send(msg)
    })
})

router.get('/variants',function (req, res, next) {
    productsDb.variants(function (msg) {
        res.send(msg)
    })
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

            var imagename;
            try {
                imagename =  msg.response[0].identifier+".jpg"
            }catch (e) {
                imagename="default.jpg"
            }



            const path = __dirname.replace("routes","images/products/"+imagename);

            if (fs.existsSync(path)){
                const stat = fs.statSync(path)
                const fileSize = stat.size
                const range = req.headers.range
                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-")
                    const start = parseInt(parts[0], 10)
                    const end = parts[1]
                        ? parseInt(parts[1], 10)
                        : fileSize-1
                    const chunksize = (end-start)+1
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
            }else {
                const path = __dirname.replace("routes","images/products/default.jpg");
                res.sendFile(path)
            }
        }
    })
})





module.exports = router;