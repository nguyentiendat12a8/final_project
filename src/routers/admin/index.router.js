const user = require('./user.routers')
const tour = require('./tour.router')

function route(app){
    app.use('/user',user)
    app.use('/mod', tour)
    app.use('/admin', tour)
}



module.exports = route;

