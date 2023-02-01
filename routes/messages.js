var express = require('express');
var router = express.Router();


router.post('/send', function (res, req, next){
//    get sender type the Id
    let senderId = (req.body.businessId === undefined) ? req.body.userId:req.body.businessId
    let recId = req.body.rec;
    let message  = req.body.message;

//    send message

})

router.post('/getMessages', function (res, req, next){


})









module.exports = router;