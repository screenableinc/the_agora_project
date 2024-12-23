var express = require('express');
var router = express.Router();
var userDb = require('../modules/dbOps/usersDbOp.js')
var ordersDb = require('../modules/dbOps/ordersDbOp.js')
var businessDb = require('../modules/dbOps/businessDbOps.js')
var cookieMgr = require('../modules/cookieManager.js')
var notify = require('../modules/notify')
var config = require("../modules/CONFIG")
const {getMessaging}=require('firebase-admin/messaging')
const { v4: uuidv4 } = require('uuid');

var jwt  = require('jsonwebtoken');
const {makeOrder2} = require("../modules/dbOps/ordersDbOp");
const {pay} = require("../modules/notify");

/* GET users listing. */
router.get('/login', function(req, res, next) {

  res.render("login",{});
});

router.post('/billing_address',function (req, res, next) {
    const form_data = req.body;

    const {

        province,
        city,
        email,
        phone,
        area,
        address,
        amount
    } = form_data;
    form_data["user_id"] = req.body.username;

    userDb.billing_address(form_data, function (msg) {
        res.send(msg)
    })


})

router.get('/billing_address',function (req, res, next) {
    console.log(req.body)
    userDb.get_billing_addresses(req.body.userId, function (msg) {
        console.log(msg)
        res.send(msg)
    })
})

router.post('/login', function(req, res, next) {
  var identifier = req.body.identifier;

  var password = req.body.password;
  userDb.authLogin(identifier, password,function (msg) {
        console.log(req.headers)
      if (msg.code===100){
        // sign cookie
          const token = jwt.sign({id:identifier, category: "user"}, req.app.get('secretKey'),{expiresIn: '28 days'}   )

          cookieMgr.set(res,"x-access-token",token,60048000000,function () {

              msg["response"]["accessToken"]=token
              res.send(msg)
          })

      }else {

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
      const token = jwt.sign({id:username, category: "user"},req.app.get('secretKey'), {expiresIn:'28 days'})
      //    there is a mismatch with the auth expiration data

      cookieMgr.set(res,"x-access-token",token,2419200*1000,function () {
          //for mobile, send access token
          msg["accessToken"]=token
          res.send(msg)
      })

    }else {

      res.send(msg)
    }
  })



});

router.post("/phoneverify", function (req, res, next){
    var code = req.body.code;
    var phone = "+"+req.body.msisdn;

    notify.sendCode(phone,code,function (msg){
        // if successs (code =69) respond with an access token and the code
        if(msg["code"]===69){
        //     create token and attach it to whatever
            const token = jwt.sign({id:phone, category: "user"},req.app.get('secretKey'), {expiresIn:'28 days'})
            //    there is a mismatch with the auth expiration data

            cookieMgr.set(res,"x-access-token",token,2419200*1000,function () {
                //for mobile, send access token
                msg["access_token"]=token
                res.send(msg)
            })

        }else{
            console.log(msg)
            res.send(msg)
        }

    })

})
router.get('/delete', function (req, res, next){
    var nxt = encodeURIComponent('account remove request');
    res.redirect('/login?next='+nxt);
})


router.post('/name', function (req, res, next) {
    userDb.setName(req.body.userId, req.body.name, function (msg) {
        res.send(msg);
    })
})

router.get('/verify',function (req, res, next){
//     this route checks to see whether a username exists
    let id = req.body.userId;
    let cc = req.query.cc;
    if(req.body.userId===undefined){
    //     error here, ask user to log in again


    }else {
    //     check database
        userDb.userExists2(req.body.userId,function (exists) {
            console.log(exists)
            if(exists){
                // return user info
                res.send({code:100, success:true, type: "new"})
                console.log("here")
            }else{
            //     create user info and tell user to add stuff like name etc
                userDb.register(id,cc,function (msg) {
                    msg["type"]="existing"
                    res.send(msg)
                    console.log(msg)
                })


            }
        })

    }

})
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
    // req.body.userId="iamwise_offici55al"
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
//     get vendors user is following
    var username=req.query.username;
    userDb.getVendorsFollowing(username, function (msg) {
        res.send(msg)
    })

})

router.post('/cart/add',function (req, res, n) {
    var productId = req.body.productId
    var variantId =req.body.variationId
    var vendorId = req.body.vendorId
    let qty = req.body.qty


      userDb.addToCart(req.body.userId,productId,variantId,vendorId,qty,function (msg) {

        res.send(msg)
      })

})

router.post('/checkout',function(req, res, next) {
    let fromCart = req.body.fromCart;
    let userId = req.body.userId;
    let number = req.body.number;
    let paymentMethod = req.body.paymentMethod;
    let deliveryMethod=(req.body.deliveryOption==="Delivery") ? 1:0;
    let txid = uuidv4();
    console.log(req.body)


    let location = req.body.location;
    var lat = null;
    var lng = null;
    var string_address=null;

    if (location !=null){
        lat = location["lat"]
        lng = location["lng"]
        string_address = location["address"]
    }

    if(fromCart===true){
        // this calls a stored procedure that moves from the cartt to the order table
        ordersDb.makeOrder(userId,paymentMethod,deliveryMethod,txid,lat,lng,string_address, function (msg) {
            let paymethod=paymentMethod;
            switch (paymethod) {
                case 1:
                    // card
                    req.body["transactionId"]=txid;
                    console.log(req.body);

                    notify.cardPay(req.body, function(msg){
                        res.send(msg)
                    })
                    break;


                case 2:
                    res.send(msg)
                    break
                case 3:

                    notify.pay()
                    res.send(msg);
                    break
                case 4:
                    res.send(msg)
                    break


            }

        })
    }else {
    //     add to orders

        makeOrder2(userId, paymentMethod, req.body.variationId, req.body.productId, 1, req.body.vendorId, location.lat, location.lng,function (msg) {
            console.log(msg+"__2222");
            if(msg["success"]){
                // get device token
                // call plutus
                notify.pay(msg["id"], number, function (r) {

                    msg["payment"]=r
                    res.send(msg)
                    console.log(msg);
                })
                businessDb.getFCMtoken(req.body.vendorId, function (msg) {
                    if(msg["success"]){
                        let token = msg["response"]["fcm_token"];
                        const message = {
                            notification: {
                                title: 'Order Received',
                                body: 'Hello, someone just made an order. Open app to review'
                            },
                            android: {
                                notification: {
                                    icon: 'stock_ticker_update',
                                    color: '#7e55c3'
                                }
                            },
                            token: token,
                        }
                                getMessaging().send(message)
                                    .then((response) => {
                                        // Response is a message ID string.
                                        console.log('Successfully sent message:', response);
                                    })
                                    .catch((error) => {
                                        // let developer know
                                        console.log('Error sending message:', error);
                                    });


                    }else {
                        //     no token...just send message
                    }
                })





            }else {
                throw err
            }

        })


    }
})
router.get('/orders/all', function (req, res, next) {
    ordersDb.getUserOrders(req.body.userId, function (msg) {

        res.send(msg);
    });
})
router.post('/cart/delete', function (req, res, next) {

    userDb.deleteItemFromCart(req.body.userId,req.body.productId,req.body.variationId, function (response) {
        res.send(response)
    })
});
router.post('/updateFCM', function (req, res, next) {
    let FCMtoken = req.body.FCMtoken;
    let sql = "Update businesses"

})
router.post('/v2/verify', function (req,res, next) {
//     check if user exists and if not, create verification code, for number, store on users row and send back as response

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
