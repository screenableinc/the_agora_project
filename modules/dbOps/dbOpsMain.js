

var connection = require('../dbOps/db.js')
class sql{
    constructor() {

    }
    async do_all(sql){

        connection.query(sql,function (err, result){
            if(err){

                throw err;
            }
        })
    }
    async prepare(){

        var vendor_nots = "CREATE TABLE IF NOT EXISTS `vendor_notifications` (\n" +
            "  `vendorId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,\n" +
            "  `read` bit(1) NOT NULL DEFAULT b'0',\n" +
            "  `message` longtext COLLATE utf8mb4_general_ci NOT NULL,\n" +
            "  `notificationId` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,\n" +
            "  `timestamp` bigint(8) NOT NULL,\n" +
            "  PRIMARY KEY (`notificationId`),\n" +
            "  KEY `owner_idx` (`vendorId`),\n" +
            "  CONSTRAINT `owner` FOREIGN KEY (`vendorId`) REFERENCES `businesses` (`businessId`) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ")"
        var attributes = "CREATE TABLE IF NOT EXISTS `agora`.`attributes` (\n" +
            "  `productId` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,\n" +
            "  `attributes` JSON NOT NULL,\n" +
            "  PRIMARY KEY (`productId`),\n" +
            "  CONSTRAINT `product_ref`\n" +
            "    FOREIGN KEY (`productId`)\n" +
            "    REFERENCES `agora`.`products` (`productId`)\n" +
            "    ON DELETE CASCADE\n" +
            "    ON UPDATE CASCADE)"

        var queries = [vendor_nots, attributes]
        for(let i=0;i<queries.length;i++){
            await this.do_all(queries[i])
        }

    }
    get start(){

        return this.prepare()
    }
}
// new sql().start

// module.exports = {
//     run:begin
// }
