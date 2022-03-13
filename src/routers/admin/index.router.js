const account = require('./manageAccount.router')
const tour = require('./manageTour.router')

function route(app){
    app.use('/admin/account',account)
    app.use('/admin/tour', tour)
    // app.use('/admin/', tour)
}



module.exports = route;

