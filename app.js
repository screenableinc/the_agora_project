var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser')
var favicon= require('serve-favicon')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products')
var categoriesRouter = require('./routes/categories')
var ordersRouter = require('./routes/orders')
var businessHubRouter = require('./routes/businessHub')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("pkiohkgjgy1123sgfgh"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({extended:true}))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products',productsRouter);
app.use('/orders',ordersRouter);
app.use('/business', businessHubRouter);
app.use('/categories', categoriesRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
