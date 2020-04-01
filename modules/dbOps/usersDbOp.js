var connection = require('../dbOps/db.js')

function userExists(username, phoneNumber, emailAddress,callback){
    var sql  = "SELECT * from agorans WHERE username = '"+ username +"' OR phoneNumber = '"+ phoneNumber +"' " +
        "OR emailAddress ='"+ emailAddress +"'"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length===0){
            return callback({exists: false})
        }else {
            return callback({exists: true})
        }
    })
}
function authLogin(identifier,password, callback) {
    var sql  = "SELECT * from agorans WHERE username = '"+ identifier +"' OR phoneNumber = '"+ identifier +"' " +
        "OR emailAddress ='"+ identifier +"' AND password = '"+ password +"'"
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
function authJoin(username, emailAddress, phoneNumber,password,fullName,countryCode, callback) {
    userExists(username, phoneNumber,emailAddress, function (exists) {
            if(exists){
                //furher specifiy which params are bad
                return {success:false, code:403}
            }else {
            //    join
                var sql = "INSERT into agorans (username, emailAddress, phoneNumber, password,fullName, " +
                    "" +
                    "countryCode) VALUES (?)"
                var values = [username, emailAddress,phoneNumber,password,fullName,countryCode]
                connection.query(sql,values,function (err, result) {
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
function getCart(username, callback) {
    var sql = "SELECT * FROM orders WHERE ownerId = '"+ username +"'";
    connection.query(sql, function (err, result) {
        if(err){
            return callback({success:false, code:500, response:err})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}
function store_picture() {
//cdn
}
module.exports = {
    authLogin:authLogin,authJoin:authJoin
}

