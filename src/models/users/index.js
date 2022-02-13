const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { Account } = require("./account")
const { BookedTour } = require('./bookedTour')
const { Role } = require("./role")
const {Tour} = require('./tour')

const db = {}

db.mongoose = mongoose

db.account = Account
db.role = Role
db.tour = Tour
db.bookedTour = BookedTour

db.ROLES = ['user', 'admin', 'moderator']

module.exports = db