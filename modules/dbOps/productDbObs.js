var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var config = require('../CONFIG')

function getCategories(callback) {
    var sql  = "SELECT * FROM "+config.STNs.categories
    connection.query(sql,function (err, result) {
        if(err){
            return callback({code:500, response:err, success:false})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}

function addProduct(businessId, productId,description, price, deliverable,quantity, barcode,categoryId,productName,callback){
    var sql = "INSERT INTO products (vendorId, productId, description, price, deliverable," +
        "quantity, barcode, categoryId, productName, timestamp) VALUES (?)"
    var values = [[businessId,productId, description,price,deliverable, quantity,barcode, categoryId,productName, new Date().getTime()]]

    connection.query(sql, values, function (err, result) {
        if(err){
            return callback({success:false, code:500,response:err})
        }else {
            return callback({success:true, code:200})
        }
    })
}
function addToCart(username,productId,callback) {
    var sql = "INSERT INTO cart (productId, username) VALUES (?)"
    var values = [[productId,username,quantity]]
    connection.query(sql,values,function (err, result) {
        if(err){
            return callback({success:false,code:200})
        }else {
            return callback({success:true,code:200})
        }
    })
}

function orderItems(ownerId,items,callback){

}
function addProductImageIdentifier(identifier,productId,callback) {
    var sql = "INSERT INTO product_images (productId, identifier) VALUES (?)"
    connection.query(sql, [[productId,identifier]],function (err,result) {
        if(err){
            return callback({success:false,response:err})
        }else {
            return callback({success:true,code:200})
        }
    })
}
function getImageIdentifier(productId, callback) {
    var sql = "SELECT identifier FROM product_images WHERE productId = '"+ productId +"'"
    genericQueries.select("identifier",config.STNs.product_images,"productId",JSON.stringify(productId),function (msg) {
        return callback(msg)
    })
    connection.query(sql)
}

function getProduct(productId, callback) {
    genericQueries.select("*",config.STNs.products,"productId",JSON.stringify(productId),function (msg) {
        return callback(msg)
    })
}

//from vendor
function getProducts(vendorId,callback){


    genericQueries.select("*", config.STNs.products,"vendorId",JSON.stringify(vendorId),function (msg) {
        return callback(msg)
    })
}
function getTopProducts(callback){
    var sql  =  "SELECT * FROM orders GROUP BY productId ORDER BY SUM (quantity) DESC LIMIT 6"
    connection.query(sql, function (err, result) {
        if(err){
            console.log(err)
            return callback({success:false,code:500})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}
function getLatestProducts(callback){
    var sql  =  "SELECT * FROM products GROUP BY productId ORDER BY timestamp DESC LIMIT 6"
    connection.query(sql, function (err, result) {
        if(err){
            console.log(err)
            return callback({success:false,code:500})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}
module.exports = {
    getCategories:getCategories,
    addProduct:addProduct,
    getProducts:getProducts,
    addProductImageIdentifier:addProductImageIdentifier,
    getTopProducts:getTopProducts,
    getLatestProducts:getLatestProducts,
    getImageIdentifier:getImageIdentifier,
    getProduct:getProduct,
    addToCart:addToCart
}