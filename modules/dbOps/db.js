
var serverConfig = require('../CONFIG')
const error = require("tus-js-client/lib.es5/error");
var mysql = require('mysql')

var deployed = serverConfig.deployed





var sqlConnection;
var config;

if (deployed){

    config={
        host: '127.0.0.1',
        port:3306,
        user:'vendcsrt_admin',
        password:'w1se097768638810',
        database:'vendcsrt_agora'
    }








}else {
    config = {
        host: 'localhost',
        user:'root',
        password:'w1se097768638810',
        database:'vendnbuy'

    }


}
sqlConnection=mysql.createConnection(config)
module.exports=sqlConnection
// var connection = mysql.createConnection(config);
// connection.connect(function (err) {
//     if (err) throw err;
//
//
//
// })
