var connection = require('../dbOps/db.js')
var config = require('../CONFIG')
var genericQueries = require('../dbOps/genericQueries')

function getCategories(which,callback) {
    var sql = "SELECT * FROM "+which
    connection.query(sql, function (err, result) {
        if(err){
            throw err
        }else {
            return callback({success:true,code:200,response:result})
        }


    })
}

module.exports = {
    getCategories:getCategories
}