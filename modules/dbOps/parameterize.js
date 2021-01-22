function getwhere (where, operator) {
    if (where===null){
        return ""
    }

    var concat = "WHERE "
    var keys = Object.keys(where)
    if (keys.length===0){
        return ""

    }
    for (var i = 0; i < keys.length; i++) {
        concat = concat + keys[i]+" " + operator + " " +JSON.stringify(where[keys[i]])
        if (keys.length-1!==i){
            concat=concat +" AND "
        }
    }
    return concat
}

function search_products(ret_cols, where,qs, callback) {
    console.log(where,"kkkkk")

    var column_q = function () {
        if(ret_cols.length===1){
            return ret_cols[0]
        }else {
            var concated = ""
            for (var i = 0; i < ret_cols.length; i++) {
                if(i===0){
                    concated =ret_cols[i]
                }else {
                concated =concated+", "+ ret_cols[i]
            }
            }
            return concated
        }
    }
    //append wildcard on end
    var where_and_wildcard = function () {

        var concat = ""
        var keys = Object.keys(where)
        var suffix = " productName LIKE '"+ qs +"%'"
        if (keys.length===0){
            return suffix

        }
        for (var i = 0; i < keys.length; i++) {
            concat = concat + keys[i]+" = " +where[keys[i]]
            if (keys.length-1!==i){
                concat=concat +" AND "
            }
        }
        suffix = " AND" + suffix
        if (qs===null){
            suffix="";
        }
        return concat+suffix
    }
    return  callback("SELECT "+ column_q() +" FROM products JOIN businesses ON businesses.businessId = products.vendorId JOIN locations on locations.vendorId = products.vendorId JOIN currencies on currencies.id = products.currency WHERE "+ where_and_wildcard())
}

//todo...fix this horrible stupidly repetitive code later you lazy fool
function discover_products(ret_cols, table,join ,where, limit,aggregates, order, callback){



    var limit_q = function () {
        if (limit===null){
            return ""
        }else {
            return " LIMIT "+limit
        }
    }
    "businesses ON businesses.businessId = products.vendorId"
    var join_q = function () {
        if(join===null){

            return ""
        }
        console.log(join,"llllllllllsadsd")
        return join
    }
    var aggregates_q = function () {
        if (aggregates===null){
            return ""
        }
        else {
            var concat = ""
            var keys = Object.keys(aggregates)
            for (var i = 0; i < keys.length; i++) {
                concat = concat + keys[i] +" " +aggregates[keys[i]]+" "
            }
            return concat
        }
    }
    var column_q = function () {
        if(ret_cols.length===1){
            return ret_cols[0]
        }else {
            var concated = ""
            for (var i = 0; i < ret_cols.length; i++) {
                if(i===0){
                    concated =ret_cols[i]
                }else {
                    concated =concated+", "+ ret_cols[i]
                }
            }
            return concated
        }
    }


    var order_q = function (order) {
        if (order===null){
            return ""
        }else {
            return order
        }
    }
    return callback("SELECT "+ column_q() + " FROM " + table+" " + join_q() +" "+ getwhere(where, "<") + " " +aggregates_q()+ order_q(order) +limit_q())

}


//todo finish this ater and move parameterize sql queries
function alpha_select(ret_cols, table,join ,where, limit,aggregates, order, callback){



    var limit_q = function () {
        if (limit===null){
            return ""
        }else {
            return " LIMIT "+limit
        }
    }

    var join_q = function () {
        if(join===null){
            return ""
        }
        return join
    }
    var aggregates_q = function () {
        if (aggregates===null){
            return ""
        }
        else {
            var concat = ""
            var keys = Object.keys(aggregates)
            for (var i = 0; i < keys.length; i++) {
                concat = concat + keys[i] +" " +aggregates[keys[i]]+" "
            }
            return concat
        }
    }
    var column_q = function () {
        if(ret_cols.length===1){
            return ret_cols[0]
        }else {
            var concated = ""
            for (var i = 0; i < ret_cols.length; i++) {
                if(i===0){
                    concated =ret_cols[i]
                }else {
                    concated =concated+", "+ ret_cols[i]
                }
            }
            return concated
        }
    }


    var order_q = function (order) {
        if (order===null){
            return ""
        }else {
            return order
        }
    }
    return callback("SELECT "+ column_q() + " FROM " + table+" " + join_q() +" "+ getwhere(where, "=") + " " +aggregates_q()+ order_q(order) +limit_q())

}



function deleteEntry(table, where, callback){
    var sql = "DELETE FROM "+table+" " + getwhere(where,"=")
    return callback(sql)
}
function updateEntry(table, where, callback){
//    finish here
}
module.exports = {
    search_products:search_products,
    alpha_select:alpha_select,
    deleteEntry:deleteEntry,
    discover_products:discover_products

}