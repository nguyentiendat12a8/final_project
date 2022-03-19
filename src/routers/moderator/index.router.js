const account = require('./manageAccount.router')
const tour = require('./manageTour.router')
const post = require('./managePost.router')
const hotel = require('./manageHotel.router')

function route(app){
    app.use('/moderator/account',account)
    app.use('/moderator/tour', tour)
    app.use('/moderator/post', post)
    app.use('/moderator/hotel', hotel)
}



module.exports = route;

