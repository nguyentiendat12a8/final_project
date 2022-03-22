const account = require('./manageAccount.router')
const post = require('./post.router')
const tour = require('./tour.router')

function route(app){
    app.use('/user/account',account)
    app.use('/user/tour', tour)
    app.use('/user/post', post)
}



module.exports = route;

