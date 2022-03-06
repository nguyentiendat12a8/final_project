const mongoose = require('mongoose')


exports.connectDB = async () =>{
    try {
        await mongoose.connect('mongodb+srv://nguyentiendat12a8:sofm27112000@cluster0.qaz2s.mongodb.net/projectFinal', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            autoIndex:true
        })
        console.log("Connect to database successfully!")
    } catch (error) {
        console.log("Connect to database failed!")
    }
}
