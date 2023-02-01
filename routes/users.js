var express = require('express');
var router = express.Router();
var userDb = require('../modules/dbOps/usersDbOp.js')
var ordersDb = require('../modules/dbOps/ordersDbOp.js')
var cookieMgr = require('../modules/cookieManager.js')
var notify = require('../modules/notify')
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
        console.log(req.headers)
      if (msg.code===100){
        // sign cookie
          const token = jwt.sign({id:identifier, category: "user"}, req.app.get('secretKey'),{expiresIn: '7d'}   )

          cookieMgr.set(res,"x-access-token",token,60048000000,function () {

              msg["response"]["accessToken"]=token
              res.send(msg)
          })

      }else {
          console.log(msg)
        res.send(msg)
      }

  })


});


//create if coming from mobile version of /join
function from_mobile(){
//gen otp
//    make otp password and pn username
    
}
router.post('/join/mobile/pn', function (req, res, next) {

})
router.post('/join', function(req, res, next) {
  var username = req.body.username;
  var fullName = req.body.fullName;
  var phoneNumber = req.body.phoneNumber;var emailAddress = req.body.emailAddress;
  var cc = req.body.countryCode
  var password = req.body.password;
  userDb.authJoin(username,emailAddress,phoneNumber,password,fullName,cc,function (msg) {
    if(msg.code===100){
      const token = jwt.sign({id:username, category: "user"},req.app.get('secretKey'), {expiresIn:'7d'})
      //    there is a mismatch with the auth expiration data

      cookieMgr.set(res,"x-access-token",token,60048000000,function () {
          //for mobile, send access token
          msg["accessToken"]=token
          res.send(msg)
      })

    }else {

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
    req.body.userId="iamwise_offici55al"
      userDb.getCart(req.body.userId,function (msg) {
        //  TODO::Fix payment options to optimize data selection

        res.send(msg)
      })

});
router.get('/cart', function (req, res, next) {
    userDb.cartCount(req.body.userId, function (msg) {
        msg["username"]=req.body.userId
        res.send(msg)
    })
})
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
    var productId = req.body.productId
    var variantId =req.body.variationId
    var vendorId = req.body.vendorId
    console.log(vendorId,"look")
    req.body.userId="iamwise_offici55al"

      userDb.addToCart(req.body.userId,productId,variantId,vendorId,function (msg) {

        res.send(msg)
      })

})
router.post('/checkout',function(req, res, next) {

    let userId = req.body.userId;
    ordersDb.makeOrder(userId, function (msg) {

        res.send(msg)
    })
})
router.post('/cart/delete', function (req, res, next) {

    userDb.deleteItemFromCart(req.body.userId,req.body.productId,req.body.variationId, function (response) {
        res.send(response)
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
