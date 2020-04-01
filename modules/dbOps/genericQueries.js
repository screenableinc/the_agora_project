var connection = require('../dbOps/db.js')

function select(column, table, key, value,callback) {
    //this might not take format string
    var sql = "SELECT "+ column +" FROM "+ table +" WHERE "+ key +" = "+ value +"";
    console.log(sql)
    connection.query(sql, function(err, result){
        if (err){
            return callback({success:false, response:err, code:500})
        }else {
            return callback({success:true, response:result, code:200})
        }

    })
}

// function selectAll(table,callback) {
//     //this might not take format string
//     var sql = "SELECT * FROM "+table;
//     connection.query(sql, function(err, result){
//         if (err){
//             return {success:false, response:err, code:500}
//         }else {
//             return {success:true, response:result, code:200}
//         }
//
//     })
// }

// insert subroutine
function insert(){
    var sql = "INSERT INTO , WHERE -- = --"
}

module.exports={
    select:select
    // selectAll:selectAll
}