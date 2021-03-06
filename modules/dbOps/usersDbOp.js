var connection = require('../dbOps/db.js')
var config = require('../CONFIG')
var genericQueries = require('../dbOps/genericQueries.js');
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
var parameterizedQueries = require('../dbOps/parameterize.js');
function userExists(username, phoneNumber, emailAddress,callback){
    var sql  = "SELECT * from agorans WHERE username = '"+ username +"' OR phoneNumber = '"+ phoneNumber +"' " +
        "OR emailAddress ='"+ emailAddress +"'"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length===0){
            return callback(false)
        }else {
            return callback(true)
        }
    })
}
function authLogin(identifier,password, callback) {
    var sql  = "SELECT * from agorans WHERE username = '"+ identifier +"' OR phoneNumber = '"+ identifier +"' " +
        "OR emailAddress ='"+ identifier+"'"
    connection.query(sql, function (err, result) {

        if (err){
            return callback({success:false,response:err, code:500})
        }else {
            if(result.length===0){
                //403 means username issue
                return callback({success:false, code: 403})
            }else {

                if(bcrypt.compareSync(password, result[0].password)){
                    return callback({success:true, code:100, response:result[0]})
                }else {
                    return callback({success:false, code:402})
                }


            }
        }
    })
}

function followVendor(username, vendorId, callback){
    var sql = "Insert into user_fav_vendors (vendorId, userId) values ?"
    connection.query(sql, [vendorId, username], function (err, result){
        if(err) throw err;
        return callback({success:true, message:null, code:200})

    })
}
function getVendorsFollowing(username,vendorId,callback){
    parameterizedQueries.alpha_select(["vendorId"], "user_fav_vendors", null, {userId: username}, null,null,null, function(sql){
        connection.query(sql, function (err, result){
            if (err)throw err;
            return callback({code:200, response: result})
        })
    })
}

function authJoin(username, emailAddress, phoneNumber,password,fullName,countryCode, callback) {

    userExists(username, phoneNumber,emailAddress, function (exists) {
            if(exists){
                //furher specifiy which params are bad
                return callback({success:false, code:403})
            }else {
            //    join
                var sql = "INSERT into agorans (username, emailAddress, phoneNumber, password,fullName, " +
                    "" +
                    "countryCode) VALUES (?)"
                var values = [username, emailAddress,phoneNumber,bcrypt.hashSync(password,10),fullName,countryCode]
                connection.query(sql,[values],function (err, result) {
                    if(err){
                     return callback({success:false, code:500, response:err})
                    }
                    else {


                        return callback({success: true, code:100,response:result})
                    }
                })
            }
        }
    )
}

function addToCart(username,productId,variationId,callback) {
    var sql = "INSERT INTO cart (productId,username,variationId) VALUES (?)"
    var values =[[productId,username,variationId]]


    connection.query(sql,values,function (err,result) {
        if(err){

            return callback({success:false,response:err,code:500,err:err.errno})
        }else {


                return callback({success:true,code:200})




        }
    })
}
function cartCount(username, callback){
    var sql = "SELECT COUNT(*) as total FROM cart WHERE username ='"+ username +"'"
    connection.query(sql,(err,result) =>{
        if (err){
            return callback ({success:false,code:500})
        }else {
            console.log(result, sql)
            return callback({success:true, response:result[0].total, code:200})
        }
    })
}
function getCart(username, callback) {
    // var sql = "SELECT * FROM cart JOIN products ON products.productId = cart.productId WHERE username = "+ JSON.stringify(username) +" ";

    parameterizedQueries.alpha_select(["cart.*","products.*","currencies.*","businesses.businessName, variations.*"],"cart", " JOIN variations ON cart.variationId = variations.variationId OR cart.variationId IS NULL JOIN products ON products.productId = cart.productId JOIN currencies ON currencies.id = products.currency JOIN businesses ON businesses.businessId = products.vendorId ",
        {username:username},null,null,null,function (sql) {
        console.log(sql,"ddddd")
        connection.query(sql + "GROUP BY cart.variationId",function (err, result) {
                if(err){
                    console.log(err)
                    return callback({success:false,code:500})
                }else {
                    //getting username piggy backed off of this function
                    return callback({success:true, response:result,code:200,username:username})
                }
            })
        })


    // genericQueries.select("*",config.STNs.cart,"username",JSON.stringify(username),function (msg) {
    //     return callback(msg)
    // })

}
function store_picture() {
//cdn
}
module.exports = {
    authLogin:authLogin,authJoin:authJoin,
    addToCart:addToCart,getCart:getCart, followVendor:followVendor, getVendorsFollowing:getVendorsFollowing, cartCount:cartCount

}

