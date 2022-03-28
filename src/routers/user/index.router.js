const account = require('./manageAccount.router')
const post = require('./post.router')
const tour = require('./tour.router')
const experience = require('./postExperience.router')
const hotel = require('./hotel.router')

function route(app){
    app.use('/user/account',account)
    app.use('/user/tour', tour)
    app.use('/user/post', post)
    app.use('/user/experience', experience)
    app.use('/user/hotel', hotel)
}



module.exports = route;

