const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models/configDB')
const route = require('./routers/index.routers')

require('dotenv').config()
const port = process.env.PORT

//handler formdata
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
//dont follow data sharing via api
app.use(cors())

app.get('/', (req,res)=>{
    res.send("done")
})
//connect to db
db.connectDB()

//route init
route(app)
app.listen(port, () => {
    console.log(`ON PORT: ${port}`)
})

