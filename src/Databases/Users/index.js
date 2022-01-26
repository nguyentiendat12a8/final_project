const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { Account } = require("./account")
const { Role } = require("./role")
const db = {}

db.mongoose = mongoose

db.account = Account
db.role =Role

db.ROLES = ['user', 'admin', ' moderator']

module.exports = db