const mongoose = require('mongoose')
const { Role } = require('./users/role')

exports.connectDB = async () =>{
    try {
        await mongoose.connect('mongodb+srv://nguyentiendat12a8:sofm27112000@cluster0.qaz2s.mongodb.net/projectFinal', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            autoIndex:true
        })
        console.log("Connect to database successfully!")
        initial()
    } catch (error) {
        console.log("Connect to database failed!")
    }
}

function initial(){
    Role.estimatedDocumentCount((err,count) =>{
        if(!err && count === 0){
            new Role({name: 'user'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added USER to role colection')
            })
            new Role({name: 'moderator'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added Moderator to role colection')
            })
            new Role({name: 'admin'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added ADMIN to role colection')
            })
        }
    })
}

