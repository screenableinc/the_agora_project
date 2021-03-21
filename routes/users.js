var express = require('express');
var router = express.Router();
var userDb = require('../modules/dbOps/usersDbOp.js')
var cookieMgr = require('../modules/cookieManager.js')
var config = require("../modules/CONFIG")
var jwt  = require('jsonwebtoken');
/* GET users listing. */
router.get('/login', function(req, res, next) {

  res.render("login",{});
});



router.post('/login', function(req, res, next) {
  var identifier = req.body.identifier;

  var password = req.body.password;
  userDb.authLogin(identifier, password,function (msg) {
        console.log(msg,password)
      if (msg.code===100){
        // sign cookie
          const token = jwt.sign({id:identifier, category: "user"},req.app.get('secretKey'), {expiresIn:'7d'})

          cookieMgr.set(res,"x-access-token",token,60048000000,function () {
              res.send(msg)
          })

      }else {
          console.log(msg)
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
      const token = jwt.sign({id:username, category: "user"},req.app.get('secretKey'), {expiresIn:'7d'})

      cookieMgr.set(res,"x-access-token",token,60048000000,function () {
        res.send(msg)
      })

    }else {
      console.log(msg)
      res.send(msg)
    }
  })



});
router.get('/cart/view', function(req, res, next) {

  // if(cookies===undefined){
  //   res.redirect("/users/login")
  // }else {
  //   if(cookies[config.gvs.userAuthTokenName]===undefined){
  //     res.redirect("/users/login")
  //   }else {
      res.render("cart",{username:req.body.id});
    // }
  // }

});
router.get('/cart/items',function (req, res, next) {

      userDb.getCart(req.body.userId,function (msg) {
        console.log(msg,"PPP")
        res.send(msg)
      })

});
router.post('/follow/vendor',function (req, res, next){
//  call db function
    userDb.followVendor(req.body.userId, req.body.vendorId, function (msg){
        res.send(msg)
    })
})

router.post('/follow/user',function (req, res, next){
//  call db function

})

router.get('/following/users',function (req, res, next){

})

router.get('/following/vendors',function(req, res, next){

})

router.post('/cart/add',function (req, res, n) {
  var cookies = req.signedCookies
  var productId = req.body.productId



      userDb.addToCart(req.body.userId,productId,function (msg) {
        console.log(msg)
        res.send(msg)
      })

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
