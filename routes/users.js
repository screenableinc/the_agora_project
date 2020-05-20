var express = require('express');
var router = express.Router();
var userDb = require('../modules/dbOps/usersDbOp.js')
var cookieMgr = require('../modules/cookieManager.js')
var config = require("../modules/CONFIG")

/* GET users listing. */
router.get('/login', function(req, res, next) {

  res.render("login",{});
});



router.post('/login', function(req, res, next) {
  var identifier = req.body.identifier;

  var password = req.body.password;
  userDb.authLogin(identifier, password,function (msg) {
      if (msg.code===100){
        // sign cookie
        cookieMgr.set(res,"userAuth",{username:msg.response.username},60048000000,function () {
          res.send(msg)
        })

      }else {
        res.send(msg)
      }

  })


});
router.post('/join', function(req, res, next) {
  var username = req.body.username;
  var fullName = req.body.fullName;
  var phoneNumber = req.body.phoneNumber;var emailAddress = req.body.emailAddress;
  var cc = req.body.countryCode
  var password = req.body.password;
  userDb.authJoin(username,emailAddress,phoneNumber,password,fullName,cc,function (msg) {
    if(msg.code===100){
      cookieMgr.set(res,"userAuth",{username:username},6004800000,function () {
        console.log("cookie set")
        console.log(msg)
        res.send(msg)
      })
    }else {
      console.log(msg)
      res.send(msg)
    }
  })



});
router.get('/cart/view', function(req, res, next) {
  var cookies = req.signedCookies

  if(cookies===undefined){
    res.redirect("login")
  }else {
    if(cookies[config.gvs.userAuthTokenName].username===undefined){

    }else {
      res.render("cart",{username:cookies[config.gvs.userAuthTokenName].username});
    }
  }

});
router.get('/cart/items',function (req, res, next) {
  var cookies = req.signedCookies
  if(cookies===undefined){
    res.send({success:false,code:403})
  }else {
    var username = cookies[config.gvs.userAuthTokenName]
    if(username===undefined){
      res.send({success:false,code:403})
    }else {
      userDb.getCart(username.username,function (msg) {
        res.send(msg)
      })
    }
  }
})
router.post('/cart/add',function (req, res, n) {
  var cookies = req.signedCookies
  var productId = req.body.productId
  if(cookies===undefined){
    res.send({success:false,code:403})
  }else {
    var username = cookies[config.gvs.userAuthTokenName]
    if(username===undefined){
      res.send({success:false})
    }else {
      username=username.username
      userDb.addToCart(username,productId,function (msg) {
        console.log(msg)
        res.send(msg)
      })
    }
  }
})
router.get('/activity', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/profile_photo', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/vendor', function(req, res, next) {
  res.render('vendorDashboard',{});
});


module.exports = router;
