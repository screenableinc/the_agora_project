var cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: 'screenable',
    api_key: '877525436538434',
    api_secret: 'uOqKOob3qK347QSltg5uSyTJc68'
});

function upload(path, uniqueFileName, callback) {
    cloudinary.uploader.upload(path,{public_id:"",tags:""},function (err,img) {
        if(err){
            return callback({success:false})
        }else {
            return {success:true,response:img}
        }
    })
}

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function(req, file, cb) {
//         console.log(file)
//         cb(null, file.originalname)
//     }
// })