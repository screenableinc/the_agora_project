var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var cookies = res.signedCookies;
  res.render('home', {title: 'Express'});
  // if (cookies===undefined){
  //   res.redirect('/users/login')
  // }else {
  //   res.render('home', {title: 'Express'});
  // }
});


module.exports = router;
