var mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'w1se097768638810',
    database:'agora'
});
connection.connect(function (err) {
    if (err) throw err;



})

module.exports = connection;