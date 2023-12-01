var admin = require("firebase-admin");

var serviceAccount = require("../dbOps/server.json");

par = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://vendnbuy-default-rtdb.europe-west1.firebasedatabase.app/"


});


const db = admin.firestore();

module.exports = {
    db:db,
    dbAdmin:par
}