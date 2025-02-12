var connection = require('../dbOps/db.js')
var config = require('../CONFIG')
var genericQueries = require('../dbOps/genericQueries.js');
var bcrypt = require('bcryptjs')
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

function rateProduct(vendorId,productId, userId, rating, review, callback){
    let sql = `INSERT INTO product_reviews (vendorId,productId, userId, rating,review_text,created_at, updated_at) VALUES (?)`
    let values = [[vendorId,productId, userId, rating,  review, Date.now(), Date.now()]];

    connection.query(sql, values,function (err, result) {
        if (err) throw err;
        return callback(true)
    })
}

function userExists2(username, callback){
    var sql  = "SELECT * from agorans WHERE username = '"+ username +"'"

    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length===0){
            console.log(username,result)
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
    var sql = "Insert into user_fav_vendors (vendorId, userId) values (?)"
    connection.query(sql, [[vendorId, username]], function (err, result){
        if(err) throw err;
        return callback({success:true, message:null, code:200})

    })
}
function isFollowing(userId, vendorId, callback){
    let sql = `SELECT * FROM user_fav_vendors WHERE vendorId = '${vendorId}' and userId = '${userId}'`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result, vendorId, userId)
        return callback({isFollowing:(result.length !== 0), message:null, code:200})
    })

}
function unfollowVendor(userId,vendorId, callback){
    let sql = `DELETE FROM user_fav_vendors WHERE vendorId = '${vendorId}' AND userId = '${userId}'`;
    connection.query(sql, function (err, result) {
        if(err) throw err;
        return callback({success:true, message:null, code:200})
    })
}
function getVendorsFollowing(username,callback){

        let sql = `SELECT *, businesses.businessName, businesses.description FROM user_fav_vendors JOIN businesses on businesses.businessId = user_fav_vendors.vendorId where userId = '${username}'`
        connection.query(sql, function (err, result){
            if (err)throw err;
            return callback({code:200, response: result})
        })

}

function registerUser(userId, countryCode, callback) {
    // for now...userid and phone number are the same
    let sql = "INSERT into agorans (username, phoneNumber, countryCode) VALUES (?)"
    let values = [userId, userId, countryCode];
    connection.query(sql, [values], function (err, result) {
        if(err){
            throw err;
        }else{
            return callback({success:true, code:100})
        }
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
function updateFCMtoken(token, userId, callback){
//
    var sql = "Update "
}
function addToCart(username,productId,variationId,vendorId,qty,callback) {
    var sql = "INSERT INTO cart (productId,username,variationId, vendorId,qty) VALUES (?)"
    var values =[[productId,username,variationId, vendorId,qty]]


    connection.query(sql,values,function (err,result) {
        if(err){
            console.log(err);

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

            return callback({success:true, response:result[0].total, code:200})
        }
    })
}


function billing_address(info, callback) {
    const sql = `
    INSERT INTO user_billing_addresses 
    (user_id, country, province, city, phone, area, address, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?,?)
  `;
    console.log(info)

    connection.query(sql,[info["userId"],info["country"],info['state'],info['city'],info['phone_number'],info['area'],info['street_address'],info['email']], function (err, result) {
        if (err) throw err;
        return callback({success:true, code:200})
    })
}
function get_billing_addresses(userId, callback){
    let sql  = `SELECT * FROM user_billing_addresses WHERE user_id = '${userId}'`;
    console.log(sql)
    connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback({success:true, code:200, response:result})

    })
}

function deleteItemFromCart(username, productId, variationId, callback) {
    let sql = "DELETE FROM cart WHERE username="+username+" AND productId ='"+productId+"' AND variationId='"+variationId+"'"
    connection.query(sql, function (err, res){
        if (err) throw err;
        return callback({success:true})
    })
}

async function getVariations(results){
    return new Promise(async function (resolve, reject) {
        let ret_arr = []
        //loop through array of product ids
        // console.log(results[2])
        for (let i = 0; i < results.length; i++) {

            let result = results[i]
            console.log(result["variationId"],i)

            if(result.variationId==='00'){
                //variation id is null, return row as is
                ret_arr.push(result)
            }else {
                //    get from data



                await new Promise(function (reso, rej) {
                    connection.query("SELECT variantName, value FROM variations WHERE productId='"+result.productId+"' AND variationId='"+result.variationId+"'", function (err, res) {

                        if(err){rej(err)
                        }else {
                            var arr = []

                            for (let j = 0; j < res.length; j++) {
                                arr.push({name:res[j].variantName,value:res[j].value})
                            }
                            reso(arr)

                        }


                    })

                }).then(r=>{
                    result.variations=r
                    ret_arr.push(result)
                    console.log("no err", r)
                }).catch(err=>{
                    console.log("err")
                    ret_arr.push(result)
                })



            console.log("worked")


        }
    }
        resolve(ret_arr)
})
}
function getCart(username, callback) {
    // var sql = "SELECT * FROM cart JOIN products ON products.productId = cart.productId WHERE username = "+ JSON.stringify(username) +" ";
    //todo:: Warning callback hell ahead
    parameterizedQueries.alpha_select(["cart.*","products.*","currencies.*","businesses.businessName","(SELECT GROUP_CONCAT(v.variantName,': ',v.value) from variations v WHERE v.variationId = cart.variationId) as v_descr"],"cart", " JOIN products ON products.productId = cart.productId JOIN currencies ON currencies.id = products.currency JOIN businesses ON businesses.businessId = products.vendorId ",
        {username:username},null,null,null,function (sql) {
        
        connection.query(sql ,function (err, result) {
                if(err){


                    return callback({success:false,code:500})
                }else {
                    console.log(result)

                    

                    return callback({success:true, response:result,code:200,username:username})


                }
            })
        })


    // genericQueries.select("*",config.STNs.cart,"username",JSON.stringify(username),function (msg) {
    //     return callback(msg)
    // })

}
function setName(userId, name, callback) {
    let sql = "UPDATE agorans SET fullName = '" + name +"' where username = '"+userId+"'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback({code: 100, success:true})
    })
}

function store_picture() {
//cdn
}
module.exports = {
    authLogin:authLogin,authJoin:authJoin,deleteItemFromCart:deleteItemFromCart,
    addToCart:addToCart,getCart:getCart, followVendor:followVendor, getVendorsFollowing:getVendorsFollowing, cartCount:cartCount,
    userExists2:userExists2, register:registerUser, setName:setName,billing_address:billing_address, get_billing_addresses:get_billing_addresses,
    rateProduct:rateProduct,isFollowing:isFollowing, unfollowVendor:unfollowVendor
}

