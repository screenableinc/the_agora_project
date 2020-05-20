var express = require('express');
var router = express.Router();
var config = require("../modules/CONFIG")
var cloud = require("../modules/cloudWorks")
var querystring = require('querystring')
var genericDb = require('../modules/dbOps/genericQueries')
var categoryDb = require('../modules/dbOps/categoriesDbOp')
var productsDb = require('../modules/dbOps/productDbObs')
router.get('/',function (req, res, next) {
    var which = req.query.which
    categoryDb.getCategories(which, function (msg) {
        res.send(msg)
    })
})
router.get('/view',function (req, res, next) {
    if(Object.keys(req.query).length===0){
        res.redirect('/')
    }else {
        console.log(req._parsedUrl.query)


        res.render('categoryView', {query: req._parsedUrl.query})
    }
    })
router.get('/get',function (req, res, next) {








    // get category images
    // categoryDb.getCategories(cat_id, function (msg) {
    //     res.send(msg)
    // })
    productsDb.getLatestProductsForCategory(req.query,function (msg) {
        res.send(msg)
    })

});
router.get('/image',function (req, res, next) {
    var categoryId = req.query.id

    var imageUrl = cloud.cloudinary.url('categories/'+categoryId+".jpg",{width: 480, crop: "scale"})


    res.send(imageUrl)
})


module.exports=router;