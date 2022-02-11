const user = require('./user.routers')
const tour = require('./tour.router')

function route(app){
    app.use('/user',user)
    app.use('/tour', tour)
}

module.exports = route;

