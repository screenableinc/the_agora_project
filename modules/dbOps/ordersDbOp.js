var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var config = require('../CONFIG')

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
            console.log(err)
            return callback({code:500,success:false})

        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}

function makeOrder(details,username,callback) {

    var sql="INSERT INTO orders (productId, variationId,vendorId, timestamp, quantity,status, userId) VALUES ?"
    connection.query(sql, [details], function (err, result) {
        if(err){
            throw err;
        }else {
            //function delete from table...place order despite failure to delete and remind admin to delete
            genericQueries.del("cart",{productId:details[0][0],username:username},function (msg) {
                console.log(msg)
            })

            return callback({success:true,code:200})
        }
    })
}

module.exports={
    makeOrder:makeOrder,
    getOrders:getOrders
}