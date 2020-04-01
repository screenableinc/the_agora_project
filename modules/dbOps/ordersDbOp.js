var connection = require('modules/dbOps/db.js')
var genericQueries = require('modules/dbOps/genericQueries.js');
var config = require('modules/CONFIG')

//for customer
// TODO optimize queries to use one function



function getCart(username,callback) {
    genericQueries.select("*",config.STNs.users,"username",username,function (msg) {
        return callback(msg)
    })
}

//for vendor
function getClientOrders(vendorId, callback) {
    genericQueries.select("*",config.STNs.vendors,"vendorId",vendorId,function (msg) {
        return callback(msg)
    })
}