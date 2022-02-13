const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/')
    },
    filename: (req, file, cb) =>{
        let ext = path.extname(file.originalname)
        cb(null, Date.now()+ext)
    }
})

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        if(
            file.mimetype =="image/png" || 
            file.mimetype =="image/gif" ||
            file.mimetype =="image/jpeg"
        ){
            callback(null, true)
        }else {
            console.log('only png/gif/jpg file supported')
            callback(null,false)
        }
    },
    // limits: {
    //     fileSize: 1024 * 1024 * 2
    // }
})

const storageAvatar = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/avatar')
    },
    filename: (req, file, cb) =>{
        let ext = path.extname(file.originalname)
        cb(null, Date.now()+ext)
    }
})
var uploadAvatar = multer({
    storage: storageAvatar,
    fileFilter: function(req, file, callback) {
        if(
            file.mimetype =="image/png" || 
            file.mimetype =="image/gif" ||
            file.mimetype =="image/jpeg"
        ){
            callback(null, true)
        }else {
            console.log('only png/gif/jpg file supported')
            callback(null,false)
        }
    },
    // limits: {
    //     fileSize: 1024 * 1024 * 2
    // }
})

module.exports = upload
module.exports = uploadAvatar