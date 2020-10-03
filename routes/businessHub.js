var express = require('express');
var router = express.Router();
var fs = require("fs")
var multer = require("multer")
var config = require("../modules/CONFIG")
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
        var businessId = req.signedCookies.businessAuth.businessId

        _filename =prefix + businessId+".jpg";
        console.log(_filename,"wise", path)
        cb(null, _filename)


    }
})
var upload = multer({storage:storage})
var businessDb = require('../modules/dbOps/businessDbOps')
var productsDb = require('../modules/dbOps/productDbObs')
var genericDb = require('../modules/dbOps/genericQueries')
var cookieMgr = require('../modules/cookieManager.js')
var auth = require('../modules/auth/auth')

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
router.get('/settings', function (req, res,next) {
    res.render('settings')
})
router.get("/products",function (req, res,next) {
    var businessId = req.query.businessId
    productsDb.getProducts(businessId,function (msg) {
        res.send(msg)
    })
})
router.get('/login', function (req, res, next) {

    res.render('businessLogin',{})
})
router.post("/join", function (req, res, next) {
    var businessId = req.body.businessId;
    var businessName = req.body.businessName;
    var category = req.body.category;
    var password = req.body.password;
    var email = req.body.email;
    var description = req.body.description
    businessDb.authJoin(businessId,businessName,description,category,password,email,function (msg) {
        if(msg.code===100){
            cookieMgr.set(res,"businessAuth",{businessId:businessId},600000000,function () {
                res.send(msg)
            })
        }else {
            res.send(msg)
        }
    })

})
router.post('/login', function (req, res, next) {
    var businessId = req.body.businessId
    var password = req.body.password


    businessDb.authLogin(businessId,password,function (msg) {
        if(msg.success){
            cookieMgr.set(res,"businessAuth",{businessId:businessId},600000000,function () {
                res.send(msg)
            })
        }else {
            console.log(msg)
            res.send(msg)
        }
    })


})

router.get('/dashboard', function (req, res, next) {
    var token = req.signedCookies

    if (token===undefined){
        res.redirect("login")
    }else {
        //finish up here
        try {


            var businessId = token[config.gvs.businessAuthTokenName].businessId;

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

router.get('/notifications', function (req, res, next){
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
        console.log(msg)
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
router.post('/banner', upload.single('banner'),function (req, res, next) {
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
    console.log("here")
    var businessId = req.query.businessId+".jpg"
    const path = __dirname.replace("routes","images/banners/"+businessId);

    if (fs.existsSync(path)){
        //    send file
        console.log("exists")
        res.sendFile(path)
    }else {
        console.log("doesnt")
        const path = __dirname.replace("routes","public/images/banner_ex2.jpg");
        res.sendFile(path)
    }
})



module.exports = router;