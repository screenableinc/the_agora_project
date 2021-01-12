var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var config = require('../CONFIG')
var parameterize = require('../dbOps/parameterize')

function getBusiness(vendorId,callback) {
    genericQueries.select("*",config.STNs.vendors,"businessId",JSON.stringify(vendorId),function (msg) {
        return callback(msg)
    })
}

function authLogin(businessId,password, callback) {
    console.log(businessId,password)
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
    var sql  =  "SELECT vendorId,businessName FROM orders JOIN businesses ON businesses.businessId = orders.vendorId GROUP BY vendorId ORDER BY SUM (quantity) ASC LIMIT 6"
    connection.query(sql, function (err, result) {
        if(err){
            console.log(err)
            return callback({success:false,code:500})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}
function getNotifications(vendorId,read,callback){
    // var where = (read) ?
    // TODO fix this...read or unread messages
    parameterize.alpha_select("*","vendor_notifications",null,{"vendorId":JSON.stringify(vendorId)},null,
        null,null, function (sql) {

        console.log(sql,"kkkkkk")
        connection.query(sql, function (err, result) {
                if(err){
                    //notify admin
                    console.log(err)
                    return callback({code:500})
                }else {
                    return callback({code:200,response:result})
                }
            })
        })
}

module.exports={
    authLogin:authLogin,
    authJoin:authJoin,
    getTopBrands:getTopBrands,
    getBusiness:getBusiness,
    getNotifications:getNotifications
}