var express = require('express');
var router = express.Router();
var config = require("../modules/CONFIG")
var querystring = require('querystring')
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
router.get('/search',function (req, res, next) {
    var q = req.query.qs
    var page = req.query.page
    q = querystring.escape(q)
    console.log(q==='')


    if(!q){
      res.redirect('/')

    }else {
      genericDb.search(q,function (msg) {

        res.render('search',{results:JSON.stringify(msg.response)})
      })

    }


})

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
