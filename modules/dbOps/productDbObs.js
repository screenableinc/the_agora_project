var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var parameterizedQueries = require('../dbOps/parameterize.js');
var config = require('../CONFIG')




let sql_business_join = "JOIN businesses ON businesses.businessId = products.vendorId "
function getCategories(callback) {
    var sql  = "SELECT * FROM "+config.STNs.categories
    connection.query(sql,function (err, result) {
        if(err){
            return callback({code:500, response:err, success:false})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })


}



async function insertInProductTable(sql, values){
    return await new Promise(function (resolve, reject) {
        connection.query(sql, values,function (err, result) {
            if (err) {
                console.log(err)
                reject( {success: false, code: 500, response: err})
            } else {
                resolve({success: true, code: 200})
            }

        })
    })

}
async function insertInVariationPriceAndQuantity(prices,quantities){
    return await new Promise(function(resolve, reject){
        connection.query("INSERT INTO variation_prices (variationId, price) VALUES ?", [prices],function (err, result) {
            if(err) reject(err);

            connection.query("INSERT INTO variation_quantities (variationId, quantity) VALUES ? ",[quantities], function (err, res) {
                if(err) reject(err);
                resolve()
            })

        })
    })
}

async function insertInVariationsTable(variations, productId, quantity,price){

    return new Promise(function (resolve, reject) {
        var sql = "INSERT INTO variations (variationId, productId, variantName, value) VALUES ?"

        let insert_q = "INSERT INTO variationtable (variationId) VALUES ?"
        var main_arr = []
        let variationIds = []
        //arrays to store price and quantity variations
        var p_var_arr=[];var q_var_arr=[]
        for (var i = 0; i < variations.length; i++) {
            //    create keys
            var variationId = genRandToken(6,function (token) {
                return token+"_"+productId
            })

            if (!variationIds.includes(variationId)){
                variationIds.push([variationId])
            }

            var keys = Object.keys(variations[i])

            var different_price=0.0; var different_qty=0;

            for (var j = 0; j < keys.length; j++) {
                var array = []
                if(keys[j].trim().toLowerCase() !== "price"){
                    if(keys[j].trim().toLowerCase() !== "qty") {
                        array[0] = variationId;
                        array[1] = productId;
                        array[2] = keys[j].toLowerCase();
                        array[3] = variations[i][keys[j]]
                    }
                    //THis is a fail safe...incase price and quantity are not provided
                }else if(keys[j].trim().toLowerCase() === "price"){
                    different_price = variations[i][keys[j]]
                }else if(keys[j].trim().toLowerCase() === "qty"){
                    different_qty = variations[i][keys[j]]
                }
                quantity = (variations[i]['qty'] === undefined || variations[i]['Qty'] ===undefined)? quantity:different_qty
                price = (variations[i]['price'] === undefined || variations[i]['Price'] ===undefined ) ? price:different_price

                // i really hope this works...Please God
                if(array.length===4) {
                    main_arr.push(array)
                }
            }
            p_var_arr.push([variationId,price]);q_var_arr.push([variationId,quantity]);



        //    i hope this works


        }

        connection.query(insert_q,[variationIds], function (err, res) {
            console.log(variationIds, "debug")
            if(err){
                reject(err)
            }else {
                connection.query(sql,[main_arr],function (err, res) {
                    if(err){

                        reject({success: false,code:500})
                    }else {
                        insertInVariationPriceAndQuantity(p_var_arr,q_var_arr).then(result=>{

                        }).catch(err=>{
                            console.log(err)
                        })

                        resolve({success:true, code:200})
                    }
                })
            }
        })



    })

}
//should consider moving this client side
function genRandToken(range, callback) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

    for (var i = 0; i < range; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return callback(text);
}

function addProduct(image_count,businessId, productId,description, price, deliverable,quantity, barcode,categoryId,productName,tag,currency,variations,callback){
    console.log("called")
    insertTags(tag).then((tag)=>{

        var sql = "INSERT INTO products (image_count ,vendorId, productId, description, price, deliverable," +
            "quantity, barcode, categoryId, productName, timestamp, tag,currency) VALUES (?)"
        var values = [[image_count,businessId,productId, description,price,deliverable, quantity,barcode, categoryId,productName, new Date().getTime(), tag,"1"]]
        console.log("this too")
        console.log(values);
        if(variations!==undefined){
            insertInProductTable(sql, values).then(result => {


                insertInVariationsTable(variations.variations, productId, quantity, price).then(result => {
                    return callback(result)
                }).catch(msg => {
                    console.log(msg)
                    return callback(msg)
                })


            })
        }

    }).catch((msg)=>{

        return callback({success:false, code:500, response: msg})
    })

}
function addToCart(username,productId,callback) {
    var sql = "INSERT INTO cart (productId, username) VALUES (?)"
    var values = [[productId,username,quantity]]
    connection.query(sql,values,function (err, result) {
        if(err){
            return callback({success:false,code:200})
        }else {
            return callback({success:true,code:200})
        }
    })
}

function orderItems(ownerId,items,callback){

}
function addProductImageIdentifier(identifier,productId, count,callback) {
    var sql = "INSERT INTO product_images (productId, identifier, count) VALUES (?)"
    console.log(sql)
    connection.query(sql, [[productId,identifier,count]],function (err,result) {
        if(err){
            return callback({success:false,response:err})
        }else {
            return callback({success:true,code:200})
        }
    })
}
function getReviews(productId, callback){
    var sql="SELECT * FROM product_reviews WHERE productId = '"+ productId +"'"
    connection.query(sql, function (err, result){
        if (err) throw err;
        return callback({success:true, response:result})
    })
}
function getImageIdentifier(productId, callback) {

    genericQueries.select("identifier",config.STNs.product_images,"productId",JSON.stringify(productId),function (msg) {
        return callback(msg)
    })

}
function getVariations(productId, callback){
    var sql = "SELECT * FROM variations JOIN variation_quantities ON variations.variationId = variation_quantities.variationId JOIN variation_prices ON variations.variationId = variation_prices.variationId WHERE productId = '"+ productId + "'"

    connection.query(sql, function (err, result) {
        if(err) {

            throw err};
        return callback({success:true, response:result})
    })
}
function getOrderVariations(variationId, callback) {
    var sql = "SELECT * FROM variations WHERE variationId = '"+ variationId +"'"
    connection.query(sql, function (err, result) {
        if (err) throw err;
        return callback({success:true, response:result})
    })
}
function getProduct(productId, callback) {
    parameterizedQueries.alpha_select(['products.*,currencies.*, businesses.businessId, businesses.businessName'],config.STNs.products, "JOIN businesses ON businesses.businessId = products.vendorId JOIN currencies ON currencies.id = products.currency ", {productId: productId},null,null,null,function (sql){
        connection.query(sql, function (err, result){
            if(err) throw err;
            return callback({success:true, response:result[0], code:200})
        })
    })
    // genericQueries.select("*",config.STNs.products,"productId",JSON.stringify(productId),function (msg) {
    //     return callback(msg)
    // })
}

//from vendor
function getProducts(vendorId,sortOption,callback){


    // genericQueries.select("*", config.STNs.products,"vendorId",JSON.stringify(vendorId),function (msg) {
    //     return callback(msg)
    // })
    // const sortOption = req.query.sortOption || "relevance";
    let orderByClause;

    // Determine the ORDER BY clause based on the selected sort option
    switch (sortOption) {
        case "mostRecent":
            orderByClause = "products.timestamp DESC";
            break;
        case "lowestPrice":
            orderByClause = "products.price ASC";
            break;
        case "highestPrice":
            orderByClause = "products.price DESC";
            break;
        case "relevance":
            orderByClause = "products.timestamp DESC";
        default:
            orderByClause = "products.timestamp DESC"; // Replace with your actual relevance logic
            break;
    }

    let sql = `
        SELECT products.*,businesses.businessName
        FROM products
                 JOIN categories ON categories.categoryId = products.categoryId JOIN businesses ON businesses.businessId = '${vendorId}'
        WHERE vendorId = ? AND deleted = 0
            ${orderByClause === 'relevance' ? '' : `ORDER BY ${orderByClause}`}
    `;


    connection.query(sql, vendorId,function (err, result) {
        if(err){
            throw err;
        }else {
            console.log(sql,result)
            return callback({success:true,code:200,response:result})
        }
    })

}

function editProduct(productId,field, value, callback){

    var sql = `UPDATE products SET ${field} = '${value.toString()}' WHERE productId = '${productId}'`;
    connection.query(sql, function (err, res) {
        if (err){
            console.log(err)
            throw err;
        }else {
            console.log(value)
            return callback({success:true, code:200, response:res})
        }
    })

}

async function insertTags(tag) {
    return await new Promise(function (resolve, reject) {
        console.log("has been called")
        var sql = "INSERT INTO tags (tagName) VALUES (?)";
        connection.query(sql, [tag],(err, result)=>{
            if(err){
                if(err.errno===1062) {
                    var sql =  "SELECT tagId FROM tags WHERE tagName = "+ JSON.stringify(tag)
                    connection.query(sql,(err, res)=>{
                        if(err){
                            reject(err)
                        }else {

                            resolve(res[0].tagId)
                        }
                    })
                }else {
                    reject(err)
                }
            }else {
                resolve(result.insertId)
            }
        })

    })
}

function moveTags() {
//    get generic name and insert it as tag for each product
    var sql = "SELECT * FROM products"
    connection.query(sql, async (err, result) => {
        if(err) throw err;
        if (result[0].genericName !== null){

        }
        for (let i = 0; i < result.length; i++) {
            if(result[i].genericName === null){
                continue
            }
            console.log(result[i].genericName)
            await insertTags(result[i].genericName).then((msg)=>{

                // insert tag ID into product column

                sql = "UPDATE products SET tag = " +msg + " WHERE productId = " + JSON.stringify(result[i].productId)

                connection.query(sql, function (err, res) {
                    if(err) throw err;

                })

                console.log("inserted " + i + "...." + msg)
            }).catch((msg)=>{
                console.log("failed" + msg)
            })
        }
    })
}

// moveTags()

function getTopProducts(callback){
    // var sql  =  "SELECT * FROM orders GROUP BY productId ORDER BY SUM (quantity) ASC LIMIT 6"
    parameterizedQueries.alpha_select(["products.*,currencies.symbol"],"products","JOIN currencies ON currencies.id = products.currency ",{},6,{"GROUP BY":"productId", "ORDER BY": "timestamp"},"ASC",function(sql){
        connection.query(sql, function (err, result) {
            console.log(sql)
            if(err){
                console.log(err)
                return callback({success:false,code:500})
            }else {
                return callback({success:true, code:200, response:result})
            }
        })
    })

}
// function getProduct(productId,callback) {
//     let sql = `SELECT * FROM products JOIN currencies ON currencies.id = products.currency where`
// }

function getLatestProductsForCategory(where, callback) {
    parameterizedQueries.alpha_select("*","products",null,where,6,{"GROUP BY":"productId", "ORDER BY": "timestamp"},"DESC",function (sql) {
        console.log(sql)
        connection.query(sql, function (err,result) {
            if(err){
                //todo alert webmaster
                return callback({success:false})
            }else {
                return callback({success:true,response:result})
            }
        })
    })
}


function addVariant(variant,callback){
//    check if variant exists
    genericQueries.exists("variants",{variant:variant},function (msg) {
        if(msg.code===403){
        //    return id
        }else if(msg.code===100) {

        }

    })
}

function variants(callback) {
    connection.query("SELECT * FROM variants",function (err, result) {
        if(err){
            return callback({success:false, code:500})
        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}
function deleteProduct(productId, vendorId, callback) {

    let sql_ = `UPDATE products SET deleted = 1 WHERE productId = '${productId}' AND vendorId = '${vendorId}'`

    connection.query(sql_, function (err, res) {
        if (err) throw err;
        return callback({success:true, code:200, response:res})
    })
}
function discover(page,username, callback){



    let sql = `
        SELECT products.*,
               currencies.symbol,
               businesses.businessName,
               CASE
                   WHEN cart.productId IS NOT NULL THEN 1
                   ELSE 0
                   END AS inCart
        FROM products
                 JOIN currencies ON currencies.id = products.currency
                 LEFT JOIN cart ON cart.productId = products.productId AND cart.username = '${username}'
                 JOIN businesses ON businesses.businessId = products.vendorId
        GROUP BY products.productId
        ORDER BY timestamp DESC
            LIMIT 10 OFFSET ${(page - 1) * 10}
    `;
    console.log(sql)
    connection.query(sql,function (err, result){

        if(err){
            throw err

            // return callback({success:false,code:500,err:err})
        }else {
            console.log(result.length)

            return callback({success:true, hasMore:(result.length === 10),code:200, response:result})
        }

})
}
function getLatestProducts(callback){

    parameterizedQueries.alpha_select(["products.*,currencies.symbol,businesses.businessName, CASE \n" +
    "        WHEN cart.productId IS NOT NULL THEN 1 \n" +
    "        ELSE 0 \n" +
    "    END AS inCart"],"products","JOIN currencies ON currencies.id = products.currency LEFT JOIN cart ON cart.productId=products.productId AND cart.username = '+260970519299'"+sql_business_join,{},6,{"GROUP BY":"productId", "ORDER BY": "timestamp"},"DESC",function(sql){
        connection.query(sql, function (err, result) {

            if(err){
                throw err;

                return callback({success:false,code:500})
            }else {
                return callback({success:true, code:200,hasMore:(result.length === 10), response:result})
            }
        })
    })

}
module.exports = {
    getCategories:getCategories,
    addProduct:addProduct,
    getProducts:getProducts,
    addProductImageIdentifier:addProductImageIdentifier,
    getTopProducts:getTopProducts,
    getLatestProducts:getLatestProducts,
    getImageIdentifier:getImageIdentifier,
    getProduct:getProduct,
    addToCart:addToCart,
    getLatestProductsForCategory:getLatestProductsForCategory,
    deleteProduct:deleteProduct,
    variants:variants,
    discover:discover,
    getReviews:getReviews,
    insertTags:insertTags,
    getVariations:getVariations,
    editProduct:editProduct,
    getOrderVariations:getOrderVariations
}