// noinspection JSVoidFunctionReturnValueUsed

var express = require('express');
var router = express.Router();
var fs = require("fs")
var multer = require("multer")
var config = require("../modules/CONFIG")
var jwt  = require('jsonwebtoken');
var notify = require('../modules/notify')


//authentication
function validateBusiness(req, res, next){


    var token = (req.headers.token == null) ?  req.signedCookies['businessAuth'] : req.headers.token
    jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {
        if (err) {

            if(req.url==='/login' || req.url==='/join'){
                next()
            }else {
                if (req.headers["user-agent"]==="mobile"){
                    res.status(211).send()
                }else {

                    res.redirect("/business/login")
                }
            }
        }else{
            // add user id to request

            if(req.url==='/login' || req.url==='/join'){
                next()
            }else {

                req.body.businessId = decoded.id;
                req.body.type = decoded.category;
                next();

            }
        }
    });
}
//

let itempicstorage = multer.diskStorage({
    destination:"./images/products/",
    filename:function (req, file, cb) {




        var productId = req.body.productId;
        var businessId = req.headers['businessId'];


        var identifier = Date.now()+productId
        productId=productId+"_"+businessId;

        _filename = file.originalname;
        cb(null,_filename)
        // productsDb.addProductImageIdentifier(identifier,productId,function (msg) {
        //     if(msg.code===200){
        //         cb(null, _filename)
        //     }else {
        //
        //         cb(null,"")
        //     }
        // })




    }
})

// any code that relies on this function is flawed and needs to be fixed
function externalAuth(req,callback){
    // console.log(req.headers.token)
    var token = req.headers.token==null ? req.signedCookies["businessAuth"]:req.headers.token

    jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {

        return callback(decoded.id)
    });

}
function store(req, callback){
    var productId = req.body.productId;
    var businessId = req.body.businessId

    var identifier = Date.now()+productId
    productId=productId+"_"+businessId;

    var _filename = identifier+".jpg";
    productsDb.addProductImageIdentifier(identifier,productId,function (msg) {
        if(msg.code===200){
            //    store file
            var data=Buffer.from(req.body.image.split('base64,')[1],'base64')

            fs.writeFileSync(__dirname.replace("routes","images/products/"+_filename),data)
            return callback({success: true})
        }else {
            console.log(msg.response+"error")
            return callback({success:false})
        }
    })

}
var storage = multer.diskStorage({
    destination:"./images",
    filename:function (req, file, cb) {
        var path = req._parsedUrl.path
        var prefix=""
        if (path.trim()=="/logo"){
            prefix="/logos/"
        }else if (path.trim()=="/banner"){
            prefix="/banners/"
        }
        var businessId = req.body.businessId

        _filename =prefix + businessId+".jpg";

        cb(null, _filename)


    }
})
var upload = multer({storage:storage})
var uploadItemImage = multer({storage:itempicstorage})
var businessDb = require('../modules/dbOps/businessDbOps')
var productsDb = require('../modules/dbOps/productDbObs')
var genericDb = require('../modules/dbOps/genericQueries')
var cookieMgr = require('../modules/cookieManager.js')
var auth = require('../modules/auth/auth')
const ordersDb = require("../modules/dbOps/ordersDbOp");

router.get("/",function (req, res, next) {
    var businessId = req.query.vendorId
    businessDb.getBusiness(businessId,function (msg) {

        if(msg.code===200 && msg.response.length > 0) {
            res.render('store', {businessName:msg.response[0].businessName,businessId:businessId})
        }else {
            // res.send("okay")
            res.redirect("/")
        }
    })

})


router.get('/orders/all',validateBusiness,function (req, res, next) {
    try {
        var businessId = req.body.businessId;

        ordersDb.getOrders(businessId,function (msg) {

            res.send(msg)

        })
    }catch (e) {
        throw e
    }
})
router.get('/settings',validateBusiness, function (req, res,next) {
    res.render('settings')
})
router.get("/products",validateBusiness,function (req, res,next) {
    var businessId = req.query.businessId
    productsDb.getProducts(businessId,function (msg) {
        res.send(msg)
    })
})
router.get('/login', validateBusiness,function (req, res, next) {

    res.render('businessLogin',{})
})

router.post("/phoneverify", function (req, res, next){
    var code = req.body.code;
    var phone = "+"+req.body.msisdn;

    notify.sendCode(phone,code,function (msg){
        res.send(msg)
    })

})

router.post("/join", validateBusiness,function (req, res, next) {
    var businessId = req.body.businessId;
    var businessName = req.body.businessName;
    var category = req.body.category;
    var password = req.body.password;
    var email = req.body.email;
    var description = req.body.description

    businessDb.authJoin(businessId,businessName,description,category,password,email,function (msg) {

        if(msg.code===100){
            let token = jwt.sign({id:businessId,category:"vendor"},req.app.get('secretKey'), {expiresIn:'7d'})
            cookieMgr.set(res,"businessAuth",token,600000000,function () {
                //message should contain token for jwt auth
                msg["token"]=token;
                res.send(msg)
            })
        }else {
            res.send(msg)
        }
    })

})
router.get('/products/all',validateBusiness,function (req, res, next) {

    console.log("called")

    productsDb.getProducts(req.body.businessId, function (msg) {

        res.send(msg)
    })

});
router.get('/promos',validateBusiness, function (req, res, next) {
    res.render('promos',{title:"Promos"})
})

// TODO:: validate business
router.post('/editItem',function(req, res, next){
    var field=req.body.field;
    var value = req.body.value;
    var productId = req.body.productId;
    productsDb.editProduct(productId,field, value, function (msg){
        res.send(msg)
    })

})
router.post('/additem',uploadItemImage.any("file"),validateBusiness,function (req, res, next) {
    //temporary
    console.log(req.files.length)
    var productId = req.body.productId;var descr = req.body.description;var categoryId = req.body.category;
    var price = req.body.price;

    var quantity = req.body.quantity;var barcode = req.body.barcode;
    var productName = req.body.productName
    var genericName = req.body.type /*generic name is the tag */
    var currency = req.body.currency
    console.log(req.body)
    var variations = (req.body.attrs!==undefined) ? JSON.parse(req.body.attrs.toString()):req.body.attrs


    //add product image count to db to keep track of count

    var deliverable = parseInt(req.body.deliverable);

    var image_count = req.files.length;


    var businessId = req.body.businessId

    //here
    productId = productId+"_"+businessId
    productsDb.addProduct(image_count,businessId,productId,descr,price,deliverable,quantity,barcode, categoryId,productName,genericName,currency,variations,function (msg) {
            // TODO::figure out what the fuck this does
        // if(msg.success) {
        //
        //     store(req,  (good) => {
        //         (good.success)? res.send(msg):res.send(good)
        //     })
        // }else {
        //     res.send(msg)
        // }
        res.send(msg)
    })

})

router.post('/login', validateBusiness,function (req, res, next) {
    var businessId = req.body.businessId
    var password = req.body.password


    businessDb.authLogin(businessId,password,function (msg) {
        if(msg.success){
            let token = jwt.sign({id:businessId,category:"vendor"},req.app.get('secretKey'), {expiresIn:'7d'})
            cookieMgr.set(res,"businessAuth",token,600000000,function () {
                msg['token']=token;
                res.send(msg)
            })
        }else {
            res.send(msg)
        }
    })


})

router.get('/dashboard',validateBusiness, function (req, res, next) {
    var token = req.signedCookies

    if (token===undefined){
        res.redirect("login")
    }else {
        //finish up here
        try {


            var businessId = req.body.businessId

            businessDb.getBusiness(businessId, function (msg) {
                if (msg.code === 200) {


                   (msg.response.length === 0) ? res.redirect('login'):res.render("dashboard", {businessName: msg.response[0].businessName, businessId: businessId})


                } else {
                    res.redirect("login")
                }
            })

        }catch (e) {
            res.redirect("login")
        }
    }

})

router.get('/notifications', validateBusiness,function (req, res, next){
    var token = new auth.auth_check(req,0).auth

    token.then(function (val){
        console.log(val,"hha")
        if(val!==undefined) {
            businessDb.getNotifications(val.username, null, function (msg) {
                res.send(msg)
            })
        }else {
            res.send({code:403})
        }
    })

})
router.get('/top',function (req, res, n) {
    businessDb.getTopBrands(function (msg) {

        res.send(msg)
    })
})
router.get('/logo', function (req, res, next) {
    var businessId = req.query.businessId+".jpg"
    const path = __dirname.replace("routes","images/logos/"+businessId);

    if (fs.existsSync(path)){
        //    send file
        res.sendFile(path)
    }else {
        const path = __dirname.replace("routes","public/images/business_logo_default.png");
        res.sendFile(path)
    }
})
router.post('/logo', upload.single('logo'),function (req, res, next) {
    var businessId = req.body.businessId+".jpg"
    const path = __dirname.replace("routes","pictures/"+businessId);

    if (fs.existsSync(path)){
        //    send file
        res.sendFile(path)
    }else {
        const path = __dirname.replace("routes","public/images/business_logo_default.png");
        res.sendFile(path)
    }
})

let handle = function(req, res, next){
    req.body.ok="done"
    return next()
}
router.post('/banner', upload.single('banner'),validateBusiness,function (req, res, next) {
    console.log(req.body.businessId,"ssssssssss")
    var businessId = req.body.businessId+".jpg"
    const path = __dirname.replace("routes","images/"+businessId);

    if (fs.existsSync(path)){
        //    send file
        res.sendFile(path)
    }else {
        const path = __dirname.replace("routes","public/images/business_logo_default.png");
        res.sendFile(path)
    }
})
router.get('/banner',function (req, res, next) {

    var businessId = req.body.businessId+".jpg"
    const path = __dirname.replace("routes","images/banners/"+businessId);

    if (fs.existsSync(path)){
        //    send file

        res.sendFile(path)
    }else {

        const path = __dirname.replace("routes","public/images/banner_ex2.jpg");
        res.sendFile(path)
    }
})



module.exports = router;