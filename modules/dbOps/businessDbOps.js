var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var config = require('../CONFIG')

function authLogin(businessId,password, callback) {
    var sql  = "SELECT * from businesses WHERE businessId ='"+ businessId +"' AND password ='"+ password +"'"
    connection.query(sql, function (err, result) {
        if (err){
            return callback({success:false,response:err, code:500})
        }else {
            if(result.length===0){
                return callback({success:false, code: 403})
            }else {
                return callback({success:true, code:100, response:result[0]})
            }
        }
    })
}
function authJoin(businessId, businessName, description, mainCategory, password,email, callback){
    var sql = "INSERT into businesses (businessId, businessName, description, mainCategory, password, email) VALUES (?)"
    var values = [[businessId,businessName,description,mainCategory,password,email]]
    connection.query(sql, values,function (err, result) {
        if(err){
            console.log(err)
            return callback({success:false,code:500})
        }else {
            return callback({success:true,code:100})
        }

    })
}
function getTopBrands(callback){
    var sql  =  "SELECT * FROM orders GROUP BY vendorId ORDER BY SUM (quantity) DESC LIMIT 6"
    connection.query(sql, function (err, result) {
        if(err){
            console.log(err)
            return callback({success:false,code:500})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}

module.exports={
    authLogin:authLogin,
    authJoin:authJoin,
    getTopBrands:getTopBrands
}