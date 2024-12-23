var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var config = require('../CONFIG')
var parameterize = require('../dbOps/parameterize')

function getBusiness(vendorId,callback) {
    genericQueries.select("*",config.STNs.vendors,"businessId",JSON.stringify(vendorId),function (msg) {
        return callback(msg)
    })
}

function getBusinessV2 (vendorId,callback) {
    let sql = "SELECT * from businesses JOIN locations ON locations.vendorId = businesses.businessId where businessId = '"+ vendorId +"'";
    connection.query(sql, function (err, result) {
        if(err){throw err};

        return callback({success:true, response:result})
    })
}

function getDigitalTransactions(vendorId, callback) {
    let sql = `SELECT * FROM mobile_money_transactions WHERE payee = '${vendorId}'`
    connection.query(sql, function (err, result) {
        if(err) {throw err}
        return callback({success:true, response:result})
    })
}
// this functionwas used wjhen building the app for testing to assign all vendors random coordinates



function random_coordinates(id,center_lat, center_lng, radius_in_km) {


    // Convert radius from kilometers to degrees
    const radius_in_degrees = (radius_in_km * 111.132) / 6371;

    // Generate random offsets within the circle
    const delta_lat = Math.random() * 2 * radius_in_degrees - radius_in_degrees;
    const delta_lng = Math.random() * 2 * radius_in_degrees - radius_in_degrees;

    // Add offsets to center coordinates
    const new_lat = center_lat + delta_lat;
    const new_lng = center_lng + delta_lng;

    return [id,JSON.stringify(new_lat), JSON.stringify(new_lng)];
}

function location_assign(callback) {
    let sql = "SELECT businessId FROM businesses"
    connection.query(sql, function(err, results) {
        const center = { lat: -15.420750700000001, lng: 28.339605499999998 };
        const radius_in_km = 0.4;
        var finalList = []


        for (let i = 0; i < results.length; i++) {
            const random_point = random_coordinates(results[i].businessId,center.lat, center.lng, radius_in_km);
            finalList.push(random_point);

        }
        let sql = "INSERT INTO locations (vendorId, lat, lng) VALUES ?";
        console.log(finalList)
        connection.query(sql,[finalList], function(err, results) {
            if (err) {
                throw err;
            }else {
                return callback("good");
            }
        })
    })
}

function allBusinesses(callback) {
    let sql = "SELECT * FROM businesses"
    connection.query(sql, function(err, results) {
        return callback(results.length+"")
    })
}
function getBalance(vendorId,callback) {
//     sql
    let sqlQuery = `SELECT * FROM liabilities WHERE vendorId = '${vendorId}'`
    connection.query(sqlQuery, function (err, res) {
        if (err) {throw err}
        else{
            console.log(res.length)
            if(res.length===0){
               return callback({"total_balance":0})
            }else {
                console.log(res[0]["amount"])
                return callback({"total_balance":res[0]["amount"]})
            }


        }
    })
}
function authLogin(businessId,password,fcm_token, callback) {

    var sql  = "SELECT * from businesses WHERE businessId ='"+ businessId +"' AND password ='"+ password +"'"
    connection.query(sql, function (err, result) {
        if (err){
            console.log(err)
            return callback({success:false,response:err, code:500})
        }else {
            if(result.length===0){
                return callback({success:false, code: 403})
            }else {
                // success...setFCM token
                console.log(fcm_token)
                var ret_value = {token_set: false,success: true, code: 100, response: result[0]};
                if(fcm_token===undefined) {

                    // keep track of whether the token was set in order to avoid failing the login for the token
                    return callback(ret_value)
                }else{
                    var sql = "Update businesses set fcm_token = '"+fcm_token+"' where businessId = "+JSON.stringify(businessId);
                    connection.query(sql, function (err, result) {
                        if (err){
                            console.log(err)
                            return callback(ret_value)
                        }else{
                            ret_value.token_set=true
                            return callback(ret_value)
                        }
                    })
                }
            }
        }
    })
}
function updateFCMtoken(token, userId, callback){
//
    var sql = "Update businesses set fcm_token = "+token+" where businessId = "+userId
    connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback({success: true})
    })
}
function getFCMtoken(businessId, callback){
    let sql = "Select fcm_token from businesses where businessId = '" +businessId+"'";
    connection.query(sql, function (err, res) {
        if (err){
            return callback({success:false})
        }else   {
            return callback({success:true, response:res[0]})
        }
    })
}
function authJoin(businessId, businessName, description, mainCategory, password,email,fcm_token, callback){
    var sql = "INSERT into businesses (businessId, businessName, description, mainCategory, password, email, fcm_token) VALUES (?)"
    var values = [[businessId,businessName,description,mainCategory,password,email,fcm_token]]
    connection.query(sql, values,function (err, result) {
        if(err){

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
    getNotifications:getNotifications,
    updateFCMtoken:updateFCMtoken,
    getFCMtoken:getFCMtoken,
    getBalance:getBalance,
    allBusinesses:allBusinesses,
    location_assign:location_assign,
    getDigitalTransactions:getDigitalTransactions,
    getBusinessV2:getBusinessV2
}