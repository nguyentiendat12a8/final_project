const account = require('./account.router')
const experience = require('./experience.route')
const hotel = require('./hotel.router')
const post = require('./post.router')
const tour = require('./tour.router')

function route(app){
    app.use('/user/account',account)
    app.use('/user/experience',experience)
    app.use('/user/hotel',hotel)
    app.use('/user/post', post)
    app.use('/user/tour', tour)
}



module.exports = route;

