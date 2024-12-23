var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var config = require('../CONFIG')
var notify = require('../notify')



//for customer
// TODO optimize queries to use one function



function getCart(username,callback) {
    genericQueries.select("*",config.STNs.users,"username",username,function (msg) {
        return callback(msg)
    })
}
function getBusinessPendingOrders(vendorId, callback){
    let sql = "SELECT COUNT(CASE WHEN status = 0 THEN 1 END) AS pendingOrders, COUNT(CASE WHEN status = 1 THEN 1 END) AS successfulOrders FROM orders WHERE vendorId = ?";
    connection.query(sql,[vendorId],function (err, result) {
        if(err){
            throw err
        }
        return callback({success:true, code:200, response:result})
    })
}

//for vendor
function getOrders(vendorId, callback) {
    // genericQueries.select("*",config.STNs.vendors,"vendorId",vendorId,function (msg) {
    //     return callback(msg)
    // })
    // var sql = "SELECT orders.orderId, agorans."
    var sql = "SELECT agorans.username,phoneNumber, products.price, productName, orders.* FROM orders JOIN products ON products.productId = orders.productId JOIN agorans ON agorans.username" +
        " = orders.userId WHERE orders.vendorId = "+JSON.stringify(vendorId) +" ORDER BY orders.timestamp DESC"
    console.log(sql)
    connection.query(sql,function (err, result) {
        if(err){

            return callback({code:500,success:false})

        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}

function respondToOrder(orderId,vendorName,productName, variation,username, response, callback) {
    let sql = "UPDATE orders SET status = "+ response +" WHERE orderId = "+orderId
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        // notify user
        connection.query(`SELECT username, phoneNumber, fullName, emailAddress FROM agorans WHERE username = '${username.toString()}'`, function (err, res) {
            if (err) throw err;
            //pass phone number of agoran or email, order total, productname,variation, vendor name
            notify.orderRespond(email='',phone=res[0]['phoneNumber'], vendorName, 1000, res[0]['fullName'],productName,variation,1, 2,response)
        })




        return callback({success:true, code:200})
    })
}


function makeOrder(username, paymentOption,delivery,txid,lat,lng,string_address,callback) {
    let sql = "call MoveCartToOrders(?)"
    //username timestamp paymentOption

    console.log(delivery)


    let params = [[username,paymentOption,delivery,txid,lat,lng,string_address]]

    connection.query(sql, params, function (err, result) {
        if(err){
            throw err;
        }else {



            return callback({success:true,code:200})
        }
    })
}
function makeOrder2(username, paymentOption,variationId,productId,qty, vendorId, latitude, longitude,callback) {
    let sql = "INSERT INTO orders (productId, vendorId, timestamp, quantity, userId, variationId, transactionId, payment_option, latitude, longitude) VALUES (?)"
    //username timestamp paymentOption
    //


    let values = [productId, vendorId.toString(),new Date().getTime(), qty, username, variationId, "xdcc", paymentOption, latitude, longitude]
    console.log(values)
    connection.query(sql, [values], function (err, result) {
        if(err){
            console.log(err)
            throw err;
        }else {



            return callback({success:true,code:200, id: result["insertId"]})
        }
    })
}
function getUserOrders(userId, callback) {
    let sql = "SELECT orders.*,(SELECT GROUP_CONCAT(v.variantName,': ',v.value) from variations v WHERE v.variationId = orders.variationId) as v_descr, products.productName, products.price, businesses.businessName  from orders JOIN products ON products.productId = orders.productId JOIN businesses ON businesses.businessId = orders.vendorId where userId = "+userId + " ORDER BY timestamp DESC";
    console.log(sql)
    connection.query(sql, function (err, result) {

        if(err){
            throw err
        }else {

            return callback({code:200,response:result})
        }
    })
}

module.exports={
    makeOrder:makeOrder,
    getOrders:getOrders,
    respondToOrder: respondToOrder,
    getBusinessPendingOrders:getBusinessPendingOrders,
    getUserOrders:getUserOrders,
    makeOrder2:makeOrder2
}