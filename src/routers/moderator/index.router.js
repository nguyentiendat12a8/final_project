const account = require('./manageAccount.router')
const tour = require('./manageTour.router')
const post = require('./managePost.router')
const hotel = require('./manageHotel.router')
const dashboard = require('./dashboard.router')

function route(app){
    app.use('/moderator/account',account)
    app.use('/moderator/tour', tour)
    app.use('/moderator/post', post)
    app.use('/moderator/hotel', hotel)
    app.use('/moderator/dashboard', dashboard)
}

module.exports = route;