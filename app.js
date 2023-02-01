var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser')
var favicon= require('serve-favicon')
var indexRouter = require(path.join(__dirname,'routes/index'));
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products')
var categoriesRouter = require('./routes/categories')
var ordersRouter = require('./routes/orders')
var businessHubRouter = require('./routes/businessHub')
var checkoutRouter = require('./routes/checkout')
var useragent = require('express-useragent');
var jwt = require('jsonwebtoken')
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
app.use('/users',usersRouter);
app.use('/products',productsRouter);
app.use('/orders',ordersRouter);
app.use('/business',businessHubRouter);
app.use('/categories', categoriesRouter);
app.use('/checkout',validateUser,checkoutRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // console./log(req)
  // res.send(req.headers)

  next(createError(404));
});

//validation

function validateBusiness(req, res, next){


  var token = (req.token == null) ?  req.signedCookies['businessAuth'] : req.token
  jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {
    if (err) {

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
  var token = req.headers.accesstoken;
  function authURLIncoming(url){
      return url === "/join" || url === "/login";
  }
  jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {


              if (err) {

                  if (req.url === '/login' || req.url === '/join') {
                      next()
                  } else {
                      if (req.headers["user-agent"] === "mobile") {
                          //  auth error
                      res.send({success:false, code:500})
                      } else {
                          res.redirect("/users/login")
                      }
                  }
              } else {
                  // add user id to request

                  if (authURLIncoming(req.url)) {
                      next()
                  } else {
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
