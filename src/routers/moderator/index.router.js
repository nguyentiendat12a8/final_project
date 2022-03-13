const account = require('./manageAccount.router')
const tour = require('./manageTour.router')

function route(app){
    app.use('/moderator/account',account)
    app.use('/moderator/tour', tour)
    // app.use('/admin/', tour)
}



module.exports = route;

