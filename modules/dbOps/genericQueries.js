var connection = require('../dbOps/db.js')
var config = require('../CONFIG')
var parameterize = require('../dbOps/parameterize.js')
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


//TODO deprecate
function entryExists(table,columnKey,columnValue, callback){
    var sql  = "SELECT * FROM "+table+ " WHERE "+columnKey+" = " +JSON.stringify(columnValue)
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length===0){
            return callback(false)
        }else {
            console.log(result)
            return callback(true)
        }
    })
}

function del(table,where,callback) {
    parameterize.deleteEntry(table,where,function (sql) {
        connection.query(sql,function (err, result) {
            if(err){
                console.log(err)
                return callback({success:false,code:500})
            }else {
                return callback({success:true,code:200})
            }
        })
    })
}
function search(value,where,callback) {
    parameterize.search_products(["products.*", "businesses.businessName","currencies.symbol","locations.*"],where,value,function (sql) {
        console.log(sql)
        var sql = "SELECT products.*, businesses.businessName FROM products JOIN businesses ON businesses.businessId = products.vendorId WHERE productName LIKE '%"+value+"%'"

        connection.query(sql, function (err, result) {
            if(err)throw err;
            return callback({success:true, code:200, response:result})
        })
    })

}

function barcode_search(code,callback){
    parameterize.alpha_select()
}

function addOrEditLocation(id,lat,lng,city,country,callback) {
    entryExists(config.STNs.locations,"vendorId",id,function (msg) {
        console.log(msg)
        if(!msg){
        //    insert
            var sql = "INSERT INTO locations (vendorId, lat, lng) VALUES(?)"
            var values=[[id,lat,lng]]
            connection.query(sql,values,function (err,result) {
                if(err){
                    console.log(err)
                    return callback({success:false,code:500})
                }else {
                    return callback({success:true,code:200})
                }
            })
        }else {
            // "update"
            var sql = "UPDATE locations SET lat = ? , lng = ? WHERE vendorId = ?"
            var values = [lat,lng,id]
            connection.query(sql,values,function (err,result) {
                if(err){
                    console.log(err)
                    return callback({success:false,code:500})
                }else {
                    return callback({success:true,code:200})
                }
            })
        }
    })
}

// insert subroutine
function insert(){
    var sql = "INSERT INTO , WHERE -- = --"
}
function currencies(callback){
    parameterize.alpha_select("*","currencies",null,null,null,null,null,function (sql) {
        connection.query(sql,function (err, result) {
            if(err){
                return callback({success:false})
            }else {
                return callback({success:true,code:200,response:result})
            }
        })
    })
}
function exists(table, where, callback){
    parameterize.alpha_select("*",table,null,where,null,null,null,function (sql) {
        connection.query(sql,function (err, result) {
            if(err){
                return callback({success:false, code:500})
            }else {
                var code = (result.length===0) ? 100:403
                return callback({success:true,code:code})
            }
        })
    })
}

module.exports={
    select:select,
    addOrEditLocation:addOrEditLocation,
    search:search,
    currencySelect:currencies,
    del:del,
    exists:exists
    // selectAll:selectAll
}