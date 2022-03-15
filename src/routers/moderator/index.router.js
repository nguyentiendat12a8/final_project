const account = require('./manageAccount.router')
const tour = require('./manageTour.router')
const post = require('./managePost.router')

function route(app){
    app.use('/moderator/account',account)
    app.use('/moderator/tour', tour)
    app.use('/moderator/post', post)
}



module.exports = route;

