const multer = require('multer')
const path = require('path')

const Storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/')
    },
    filename: (req, file, cb) =>{
        let ext = path.extname(file.originalname)
        cb(null, Date.now()+ext)
    }
})

var upload = multer({
    storage: Storage,
    fileFilter: function(req, file, callback) {
        if(
            file.mimetype =="image/png" || 
            file.mimetype =="image/gif" ||
            file.mimetype =="image/jpeg"
        ){
            callback(null, true)
        }else {
            console.log('only png and jpg file supported')
            callback(null,false)
        }
    },
    // limits: {
    //     fileSize: 1024 * 1024 * 2
    // }
})



// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })
// // const url = 'mongodb+srv://nguyentiendat12a8:sofm27112000@cluster0.qaz2s.mongodb.net/projectFinal'
// // const storage = new GridFsStorage({ url })
  
//   const upload = multer({ storage: storage,
//     // fileFilter: function(req, file, callback) {
//     //     if(
//     //         // file.mimetype ==  'image/png'||
//     //         file.mimetype ==  'image/jpg'
            
//     //     ){
//     //         callback(null, true)
//     //     }else {
//     //         console.log('only png and jpg file supported')
//     //         callback(null,false)
//     //     }
//     // },
//     limits: {
//         fieldSize: 1024 * 1024 * 2
//     }
// })

module.exports = upload