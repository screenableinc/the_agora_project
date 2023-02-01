var connection = require('../dbOps/db.js')
var config = require('../CONFIG')
var genericQueries = require('../dbOps/genericQueries')

function getCategories(which,callback) {
    //dont remember why i included the parameter 'which'
    var sql = "SELECT * FROM categories"
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