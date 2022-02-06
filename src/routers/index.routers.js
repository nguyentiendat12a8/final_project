const user = require('./user.routers')

function route(app){
    app.use('/user',user)
}

module.exports = route;

