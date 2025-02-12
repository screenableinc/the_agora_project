var connection = require('../dbOps/db.js')
var genericQueries = require('../dbOps/genericQueries.js');
var config = require('../CONFIG')
var notify = require('../notify')
var orderTemplate = require('../orderEmailTemplate')



//for customer
// TODO optimize queries to use one function



function getCart(username,callback) {
    genericQueries.select("*",config.STNs.users,"username",username,function (msg) {
        return callback(msg)
    })
}
function getBusinessPendingOrders(vendorId, callback){
    let sql = `SELECT COUNT(CASE WHEN status = 0 THEN 1 END) AS pendingOrders, (SELECT COUNT(*) from user_fav_vendors f WHERE f.vendorId = '${vendorId}') as followers, COUNT(CASE WHEN status = 1 THEN 1 END) AS successfulOrders FROM orders WHERE vendorId = ?`;
    connection.query(sql,[vendorId],function (err, result) {
        if(err){
            throw err;

        }
        return callback({success:true, code:200, response:result})
    })
}
async function prepOrderConfirmationNotice(orderData) {
    let groupedOrders = {};

    // Use Promise.all to wait for all queries to complete
    let username = ""
    await Promise.all(orderData.map(async (order) => {
        console.log(order);

        let sql = `SELECT products.productName, products.productId, products.price, (SELECT u.fullName from agorans u WHERE u.username = '${order.username}') as username ,(SELECT GROUP_CONCAT(v.variantName,': ',v.value) from variations v WHERE v.variationId = '${order.variationId}') as v_descr, products.description          
FROM products
                   
                            
                   WHERE products.productId = '${order.productId}'`;


        // let sql2 = "SELECT orders.*,(SELECT GROUP_CONCAT(v.variantName,': ',v.value) from variations v WHERE v.variationId = orders.variationId) as v_descr, products.productName, products.price, businesses.businessName  from orders JOIN products ON products.productId = orders.productId JOIN businesses ON businesses.businessId = orders.vendorId where userId = "+userId + " ORDER BY timestamp DESC";



        // Wrap the connection.query in a Promise
        // getting the user-name is dangerously repetitive here

        const queryPromise = new Promise((resolve, reject) => {
            connection.query(sql, function (err, result) {
                if (err) {
                    return reject(err);
                }
                username=result[0].username;
                result[0]["vendorId"] = order.vendorId;
                result[0]["qty"] = order.qty;
                let total = result[0]["price"] * order.qty;
                result[0]["total"] = total
                result[0]["price"] = result[0]["price"];
                resolve(result[0]);
            });
        });

        const result = await queryPromise;

        // Group results by vendorId
        if (!groupedOrders[result.vendorId]) {
            groupedOrders[result.vendorId] = [];
        }
        groupedOrders[result.vendorId].push(result);
    }));

    return [groupedOrders, username];
}
//for vendor
function getOrders(vendorId, callback) {
    // genericQueries.select("*",config.STNs.vendors,"vendorId",vendorId,function (msg) {
    //     return callback(msg)
    // })
    // var sql = "SELECT orders.orderId, agorans."
    var sql = "SELECT agorans.username,phoneNumber, products.price, productName, orders.* FROM orders JOIN products ON products.productId = orders.productId JOIN agorans ON agorans.username" +
        " = orders.userId WHERE orders.vendorId = "+JSON.stringify(vendorId) +" ORDER BY orders.timestamp DESC"
    console.log(sql)
    connection.query(sql,function (err, result) {
        if(err){

            return callback({code:500,success:false})

        }else {
            return callback({success:true, code:200, response:result})
        }
    })
}

function respondToOrder(orderId,vendorName,productName, variation,username, response, callback) {
    let sql = "UPDATE orders SET status = "+ response +" WHERE orderId = "+orderId
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)
        // notify user
        connection.query(`SELECT username, phoneNumber, fullName, emailAddress FROM agorans WHERE username = '${username.toString()}'`, function (err, res) {
            if (err) throw err;
            //pass phone number of agoran or email, order total, productname,variation, vendor name
            notify.orderRespond(email='',phone=res[0]['phoneNumber'], vendorName, 1000, res[0]['fullName'],productName,variation,1, 2,response)
        })




        return callback({success:true, code:200})
    })
}
function insertCart(values,callback) {
    var sql = "INSERT INTO cart (productId,username,variationId, qty,vendorId) VALUES (?)"

    // values=JSON.stringify(values)



    connection.query(sql,values,function (err,result) {
        if(err){
            console.log(err);

            return callback({success:false,response:err,code:500,err:err.errno})
        }else {


            return callback({success:true,code:200})




        }
    })
}

// use this if coming from cart
function makeOrder(number,username, paymentOption,delivery,txid,lat,lng,string_address,callback) {
    let sql = "call MoveCartToOrders(?)"
    //username timestamp paymentOption

    // first get all orders
    connection.query(`SELECT * FROM cart WHERE username = '${username}'`, function (err, res) {
        // i can get the data...if the move is successful, notify
        if (err) throw err;





        let params = [[username,paymentOption,delivery,txid,lat,lng,string_address]]

        connection.query(sql, params, function (err, result) {
            if(err){
                throw err;
            }else {
                switch (paymentOption) {
                    case 1:
                        // card
                        req.body["transactionId"]=txid;


                        notify.cardPay(req.body, function(msg){
                            res.send(msg)
                        })
                        break;


                    case 2:

                        break
                    case 3:
                        new Promise((resolve,reject)=>{
                            notify.pay(txid,number,function(pay_response){

                                if(pay_response["success"]){
                                    console.log("resolved")
                                    resolve(pay_response)
                                }else {
                                    reject(pay_response)
                                }
                            })
                        }).then(res => {
                            return callback({success:true, code:200, response:res})
                        }).catch((error)=>{
                            // put cart items back in cart
                            console.log("called");
                            console.log(res)
                            const valuesList = res.map(row => Object.values(row));



                            insertCart(valuesList,function (err, result) {
                                return callback({success:false, code:500, response:err})
                            })


                        })



                        break
                    case 4:
                        return callback({success:true, code:200, response:result})



                }

                // orders moved successfully, prompt payment...use a promise to wait



                // (async () => {
                //     try {
                //         const orders = await prepOrderConfirmationNotice(res);
                //         // const emailTemplate = await
                //
                //         const template = await orderTemplate.template(orders[0], orders[1]);
                //         notify.sendMail("wisesibindi@gmail.com", template,"Order", function(err, res) {
                //             //     email sent...do something
                //         });
                //
                //
                //     } catch (err) {
                //         console.error("Error fetching order confirmation notices:", err);
                //     }
                // })();







                // return callback({success:true,code:200, transactionId:txid})
            }
        })

    })



}

// buy it now
function makeOrder2(username, paymentOption,variationId,productId,qty, vendorId, latitude, longitude, transactionId,callback) {
    let sql = "INSERT INTO orders (productId, vendorId, timestamp, quantity, userId, variationId, transactionId, payment_option, latitude, longitude) VALUES (?)"
    //username timestamp paymentOption



    let values = [productId, vendorId.toString(),new Date().getTime(), qty, username, variationId, transactionId, paymentOption, latitude, longitude]

    connection.query(sql, [values], function (err, result) {
        if(err){
            console.log(err)
            throw err;
        }else {



            return callback({success:true,code:200, id: result["insertId"], transactionId:transactionId})
        }
    })
}
function getUserOrders(userId, callback) {
    let sql = "SELECT orders.*,(SELECT GROUP_CONCAT(v.variantName,': ',v.value) from variations v WHERE v.variationId = orders.variationId) as v_descr, products.productName, products.price, businesses.businessName  from orders JOIN products ON products.productId = orders.productId JOIN businesses ON businesses.businessId = orders.vendorId where userId = "+userId + " ORDER BY timestamp DESC";
    console.log(sql)
    connection.query(sql, function (err, result) {

        if(err){
            throw err
        }else {

            return callback({code:200,response:result})
        }
    })
}

module.exports={
    makeOrder:makeOrder,
    getOrders:getOrders,
    respondToOrder: respondToOrder,
    getBusinessPendingOrders:getBusinessPendingOrders,
    getUserOrders:getUserOrders,
    makeOrder2:makeOrder2
}