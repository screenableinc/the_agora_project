var mysql = require('mysql2')

var serverConfig = require('../CONFIG')
const error = require("tus-js-client/lib.es5/error");

var deployed = serverConfig.deployed


var config = {
    host: 'localhost',
        user:'root',
    password:'w1se097768638810',
    database:'agora'

}
var sqlConnection;
if (deployed){
    const tunnelConfig = {
        host:"business156.web-hosting.com",
        port:21098,
        username:"vendykod",
        password:"AYyYS7HMBabe"

    }
    config={
        host: '127.0.0.1',
        port:3306,
        user:'vendykod_admin',
        password:'w1se097768638810',
        database:'vendykod_root'
    }
    const forwardConfig={
        srcHost: '127.0.0.1', // any valid address
        srcPort: 3306, // any valid port
        dstHost: config.host, // destination database
        dstPort: config.port // destination port
    }

    const {Client} = require('ssh2')
    const sshClient = new Client();

    const sshConnection = new Promise((resolve, reject)=>{
        sshClient.on('ready',()=>{
            sshClient.forwardOut(
                forwardConfig.srcHost,
                forwardConfig.srcPort,
                forwardConfig.dstHost,
                forwardConfig.dstPort,
                (err, stream)=>{
                    if(err) reject(err);
                //    create server object
                    const updatedDbServer = {
                        ...config,
                        stream


                    };

                    sqlConnection=mysql.createConnection(updatedDbServer);
                    sqlConnection.connect((error)=>{
                        if (error){
                            reject(error);
                        }
                        resolve(sqlConnection)
                    });
                });
        }).connect(tunnelConfig)

    });


}else {
    var mysql_dev = require('mysql')
    sqlConnection=mysql_dev.createConnection(config)
}

// var connection = mysql.createConnection(config);
// connection.connect(function (err) {
//     if (err) throw err;
//
//
//
// })

module.exports = sqlConnection;