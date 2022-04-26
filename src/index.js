const express = require('express')
const app = express()
const cors = require('cors')
const db = require('../src/db/configDB')
const routeUser = require('./routers/user/index.router')
const routeMod = require('./routers/moderator/index.router')
const routeAdmin = require('./routers/admin/index.router')

require('dotenv').config()
const port = process.env.PORT

//handler formdata
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
//dont follow data sharing via api
app.use(cors())

//connect to db
db.connectDB()

//path use photo
app.use('/uploads', express.static('uploads'))

//route init
routeUser(app)
routeMod(app)
routeAdmin(app)


app.listen(port, () => {
    console.log(`ON PORT: ${port}`)
})
