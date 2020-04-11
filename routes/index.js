var express = require('express');
var router = express.Router();
var config = require("../modules/CONFIG")
var genericDb = require('../modules/dbOps/genericQueries')
/* GET home page. */
router.get('/', function(req, res, next) {
  var cookies = req.signedCookies;
  if(cookies===undefined){
    res.render('home', {title: 'Home'});
  }else {

    if(cookies[config.gvs.userAuthTokenName]===undefined){
      res.render('home', {title: 'Home'});
    }else {
      var userId = cookies[config.gvs.userAuthTokenName].username
      if(userId===undefined){
        res.render('home', {title: 'Home'});
      }else {
        res.render('home',{title:"Home",displayNone:"none",userId:userId})
      }

    }
  }

});

router.post("/location/edit", function (req, res, next) {
  //for now..only business in mind
  var cookies = req.signedCookies;
  var lat = req.body.lat;
  var long = req.body.long;
  try {
    var id = cookies[config.gvs.businessAuthTokenName].businessId
    genericDb.addOrEditLocation(id,lat,long,"","",function (msg) {
      res.send(msg)
    })
  }catch (e) {
    console.log(e)
    res.send({success:false,code:500})
  }
})


module.exports = router;
