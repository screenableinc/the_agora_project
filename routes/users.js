var express = require('express');
var router = express.Router();
var userDb = require('../modules/dbOps/usersDbOp.js')
var cookieMgr = require('../modules/cookieManager.js')

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
      cookieMgr.set(res,"userAuth",{username:msg.response.username},60048000000,function () {
        res.send(msg)
      })
    }else {
      res.send(msg)
    }
  })
  res.send("okay")


});
router.get('/cart', function(req, res, next) {

  res.render("cart",{});
});
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
