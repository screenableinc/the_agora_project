var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {initializeApp, applicationDefault, getApps} = require('firebase-admin/app');
var bodyparser = require('body-parser')
var favicon= require('serve-favicon')
var indexRouter = require(path.join(__dirname,'routes/index'));
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products')
var categoriesRouter = require('./routes/categories')
var serviceAccount = require('./modules/dbOps/server.json')
var messagingRouter = require('./routes/messaging')


if ( !getApps().length ) {

    initializeApp({
        credential: applicationDefault(),
        projectId: "vendnbuy",

        databaseURL: "https://vendnbuy-default-rtdb.europe-west1.firebasedatabase.app"
    })
}

var ordersRouter = require('./routes/orders')
var businessHubRouter = require('./routes/businessHub')
var checkoutRouter = require('./routes/checkout')
var useragent = require('express-useragent');
var jwt = require('jsonwebtoken')

const registrationToken = 'ctDN1t9GSMKBzjjeS6WQNX:APA91bHHWnZJ81Pl9xUHuywg-koyhhCZd5BoGmmOlhxEDsUJwiR9YPur2jN_uAXi3WD1slJwMOM_KBk3clSSf_HsmxGIUSfSk5f1xFdtJoMW3t4i2KQiiPnN0rdEbfdjbHq4Puc-_0At';

const message = {
    notification: {
        title: '`$FooCorp` up 1.43% on the day',
        body: 'FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
    },
    android: {
        notification: {
            icon: 'stock_ticker_update',
            color: '#7e55c3'
        }
    },
    token: registrationToken,
};

// Send a message to the device corresponding to the provided
// registration token.
// getMessaging().send(message)
//     .then((response) => {
//         // Response is a message ID string.
//         console.log('Successfully sent message:', response);
//     })
//     .catch((error) => {
//         console.log('Error sending message:', error);
//     });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.set('secretKey','ChenniMyLove')
app.use(logger('dev'));
app.use(useragent.express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("pkiohkgjgy1123sgfgh"));
// app.use(e_jwt)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({extended:true}))



app.use('/',indexRouter);
app.use('/users',validateUser,usersRouter);
app.use('/products',check,productsRouter);
app.use('/orders',ordersRouter);
app.use('/business',validateBusiness,businessHubRouter);
app.use('/categories', categoriesRouter);
app.use('/checkout',validateUser,checkoutRouter)
app.use('/messaging', messagingRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // console./log(req)
  // res.send(req.headers)

  next(createError(404));
});
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


// redirect to app store if needed
function check(req, res, next) {
    let plaform = res.locals.useragent.platform;
    if(plaform==="iPhone"){
    //     send to appstore
        res.redirect(req.url);
    }else if(plaform==="Android"){
        res.redirect("https://play.google.com/store/apps/details?id=com.vendnbuy.ent.vendnbuy")
    }else {
        next();
    }
}

//validation

function validateBusiness(req, res, next){


    var token = req.headers.token;
    console.log('token: ', token);

  jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {
    console.log(err, req.url)
      if (err) {
        if ((err.message==="jwt expired" || err.message==="jwt malformed") && (req.url==="/login" || req.url==="/join")) {

            // next();

        }else {
            return res.status(401).json({})
        }

      if(req.url==='/login' || req.url==='/join'){
        next()
      }else {
          if(req.useragent.isMobile){
                  res.send({success:false, code:4422})
          }else {
              res.redirect("/business/login")
          }

      }
    }else{
      // add user id to request
        console.log("yes", decoded.id)
      if(req.url==='/login' || req.url==='/join'){
        next()
      }else {
        req.body.businessId = decoded.id;

        req.body.type = decoded.category;
        next();

      }
    }
  });
}

function validateUser(req, res, next) {
  //what to do if coming from mobile


  // var token = (req.token == null) ?  req.signedCookies['x-access-token'] : req.token
  var token = req.headers.access_token;
  function authURLIncoming(url){
      return url === "/join" || url === "/login";
  }


  jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {


              if (err) {
                  console.log(err)

                  if (req.url === '/login' || req.url === '/join' || req.url === '/phoneverify') {
                      next()
                  } else {
                      if (req.headers["user-agent"] === "mobile") {
                          //  auth error
                      res.status(401).send()
                      } else {
                          res.redirect("/users/login");
                      }
                  }
              } else {
                  // add user id to request


                  if (authURLIncoming(req.url)) {
                      console.log("here")
                      next()
                  } else {
                      console.log("flag")
                      req.body.userId = decoded.id;
                      req.body.type = decoded.category;
                      next();
                  }
              }
          }

      );


}









    // error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});


module.exports = app;
