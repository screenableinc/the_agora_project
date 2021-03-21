var express = require('express');
var router = express.Router();
var config = require("../modules/CONFIG")
var querystring = require('querystring')
var genericDb = require('../modules/dbOps/genericQueries')
var parameterize = require('../modules/dbOps/parameterize');

router.get('/',  (req, res, next)=> {


    res.render('checkout')
})








module.exports = router