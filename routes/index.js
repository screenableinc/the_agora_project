var express = require('express');
var router = express.Router();
var config = require("../modules/CONFIG")
var querystring = require('querystring')
var genericDb = require('../modules/dbOps/genericQueries')
var parameterize = require('../modules/dbOps/parameterize')



/* GET home page. */
router.get('/' ,function(req, res, next) {
  // res.render('birthday')
  var cookies = req.signedCookies;


  res.render('index',{})

    // res.send(require('./emailTemplates').candidateJoinEmail)
  // if(cookies===undefined){
  //   res.render('home', {title: 'Home'});
  // }else {
  //
  //   if(cookies[config.gvs.userAuthTokenName]===undefined){
  //     res.render('home', {title: 'Home'});
  //   }else {
  //     var userId = cookies[config.gvs.userAuthTokenName].username
  //     if(userId===undefined){
  //       res.render('home', {title: 'Home'});
  //     }else {
  //       res.render('home',{title:"Home",displayNone:"none"})
  //     }
  //
  //   }
  // }

});
router.get('/currencies/all', function (req, res, next) {
   genericDb.currencySelect(function (msg) {
       res.send(msg)
   })
})

router.get('/barcode_search',function (req, res, next){

    var source = req.query.medium;
    var page = req.query.page
    var code = req.query.barcode;


    var where = {barcode:code}
    console.log(where)





    genericDb.search(null,where,function (msg) {
        if (source === 'mobile'){
            res.send(msg)
        }else{
            res.render('search',{results:JSON.stringify(msg.response)})

        }

    })




})
router.get('/search',function (req, res, next) {
    var q = req.query.qs
    var source = req.query.medium;
    var page = req.query.page
    q = querystring.escape(q)
    console.log(q)


    if(q.trim()===''){
      res.redirect('/')

    }else {
      genericDb.search(q,{},function (msg) {
          if (source === 'mobile'){
              console.log(msg)
              res.send(msg)
          }else{
              res.render('search',{results:JSON.stringify(msg.response)})

          }

         })

    }


})


router.post('/ads',function (req, res, next) {
    var vendorId = req.body.vendorId
    var adId = req.body.adId
    var description = req.body.description

    var banner;

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
