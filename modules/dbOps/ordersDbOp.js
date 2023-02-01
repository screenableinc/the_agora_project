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

//for vendor
function getOrders(vendorId, callback) {
    // genericQueries.select("*",config.STNs.vendors,"vendorId",vendorId,function (msg) {
    //     return callback(msg)
    // })
    // var sql = "SELECT orders.orderId, agorans."
    var sql = "SELECT agorans.username,phoneNumber, products.price, productName, orders.* FROM orders JOIN products ON products.productId = orders.productId JOIN agorans ON agorans.username" +
        " = orders.userId WHERE orders.vendorId = "+JSON.stringify(vendorId)
    connection.query(sql,function (err, result) {
        if(err){

            return callback({code:500,success:false})

        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}

function approveOrder(orderId,vendorName,productName, variation,username, callback) {
    let sql = "UPDATE orders SET status = 1 WHERE orderId = "+orderId
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        // notify user
        connection.query(`SELECT username, phoneNumber, fullName, emailAddress FROM agorans WHERE username = '${username.toString()}'`, function (err, res) {
            if (err) throw err;
            //pass phone number of agoran or email, order total, productname,variation, vendor name
            notify.orderAccept(email='',phone=res[0]['phoneNumber'], vendorName, 1000, res[0]['fullName'],productName,variation,1, 2)
        })




        return callback({success:true, code:200})
    })
}
function rejectOrder(orderId, callback) {
    let sql = "UPDATE orders SET status = 2 WHERE orderId = "+orderId
    connection.query(sql, function (err, res) {
        if (err) throw err;
        return callback({success:true, code:200})
    })
}

function makeOrder(username, paymentOption,variationId,productId,callback) {
    let sql = "call move_to_orders(?,?,?,?,?)"
    //username timestamp paymentOption

    let params = [username, new Date().getTime(), paymentOption, variationId, productId]
    connection.query(sql, params, function (err, result) {
        if(err){
            throw err;
        }else {
            console.log(username,result)


            return callback({success:true,code:200})
        }
    })
}

module.exports={
    makeOrder:makeOrder,
    getOrders:getOrders,
    approveOrder:approveOrder,
    rejectOrder:rejectOrder
}