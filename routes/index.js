var express = require('express');
var router = express.Router();
var config = require("../modules/CONFIG")
var querystring = require('querystring')
var genericDb = require('../modules/dbOps/genericQueries')
var parameterize = require('../modules/dbOps/parameterize')
var orders = require('../modules/dbOps/ordersDbOp')
const verify = require("../modules/verify");
const notify = require("../modules/notify");
const orderEmailTemplate = require("../modules/orderEmailTemplate");
const fs = require("fs");
const businessDb = require("../modules/dbOps/businessDbOps");
const {getBusinessPendingOrders} = require("../modules/dbOps/ordersDbOp");

router.get('/try', function (req, res, next) {
    // orders.makeOrder("+260970519299",1,0,"hkhjkh","-15.455","28.87776","thy thdsf", function (msg) {
    //     res.send(msg)
    // })
    const os = require('os');
    const dns = require('dns');

    const hostname = os.hostname();

    dns.lookup(hostname,{family:4}, (err, address) => {
        if (err) {
            res.send("failed getting IP")
        } else {
            res.send({OriginatingIP :address});
        }
    });
})

router.get('/reviews', function (req, res, next) {
    businessDb.reviewsandratings(req.query.vendorId, function (msg) {
        console.log("ssss",msg)
        res.send(msg)
    })
})

router.get('/payment_methods',function (req, res, next) {
    businessDb.getPaymentMethods(function (msg) {
        res.send(msg);
    })
})


router.post('/subscribe', function (req, res, next) {
    let email = req.body.email;
    let phone = req.body.phone;
    let name = req.body.name;
    let role = req.body.role;

    genericDb.subscribe(name,phone, email,role, function (msg) {
        res.send("Thank you for joining us!");
    })


})

// logo logic

router.get('/logo', function (req, res, next) {
    var businessId = req.query.businessId+".jpg"
    const path = __dirname.replace("routes","images/logos/"+businessId);
    console.log(path);
    if (fs.existsSync(path)){
        //    send file
        res.sendFile(path)
    }else {
        const path = __dirname.replace("routes","public/images/business_logo_default.png");
        res.sendFile(path)
    }
})

router.get('/banner',function (req, res, next) {

    var businessId = req.query.businessId+".jpg"
    const path = __dirname.replace("routes","images/banners/"+businessId);

    if (fs.existsSync(path)){
        //    send file

        res.sendFile(path)
    }else {

        const path = __dirname.replace("routes","public/images/banner_ex4.jpg");
        res.sendFile(path)
    }
})
// end logo logic
/* GET home page. */
router.get('/' ,function(req, res, next) {
  // res.render('birthday')
  var cookies = req.signedCookies;



  res.render('landing',{})


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
router.get('/tos', function (req, res, next) {
    var party = req.query.party;
    if(party==='vendor'){
        res.render('sellertos')
    }else if(party==='buyer'){
        res.render('buyertos')
    }

})
router.post('/plutus/mtn/callback',function (req, res, next) {
    let body = JSON.stringify(req.body);
    fs.writeFile('mtn.json', body, function (err) {
        notify.sendCode("260970519299",1111, function(err){
            res.send(body);
        })

    })
})
router.get('/userexists', function (req, res, next) {
    var username = req.query.username.trim();

    (username==="")? res.send({success:false, code:500}):proceed()
    function proceed() {
        genericDb.entryExists("agorans","username",username, function (msg) {
            //returns true or false
            res.send({exists:msg, code:200, success:true})
        })
    }

})
router.get('/currencies/all', function (req, res, next) {
   genericDb.currencySelect(function (msg) {
       res.send(msg)
   })
})

router.get('/.well-known/assetlinks.json', function (req, res, next) {
    // res.sendFile()
    res.sendFile(__dirname.replace("routes","assetlinks.json"));
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

// vulnerability
router.get('/search',function (req, res, next) {
    var q = req.query.qs
    var source = req.query.medium;
    var page = req.query.page
    q = querystring.escape(q)



    if(q.trim()===''){
      res.redirect('/')

    }else {
      genericDb.search(q,{

      },function (msg) {
          if (source === 'mobile'){
              console.log("retuning", msg)

              res.send(msg)
          }else{

              res.render('search',{results:JSON.stringify(msg.response)})

          }

         })

    }


})

// function to
router.get('/givelocations', function (req, res, next) {
    businessDb.location_assign(function (msg) {
        console.log(msg)
        res.send(msg);
    })
})

router.get('/verify', function (req, res, next) {

    verify.sendCode(req.query.number,function (msg) {
        res.send(msg)
    })
})
router.post('/ads',function (req, res, next) {
    var vendorId = req.body.vendorId
    var adId = req.body.adId
    var description = req.body.description

    var banner;

})
router.post("/location/edit", function (req, res, next) {
  //for now...only business in mind
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
