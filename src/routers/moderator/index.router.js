const account = require('./manageAccount.router')

function route(app){
    app.use('/moderator/account',account)
    //app.use('/admin/tour', tour)
    // app.use('/admin/', tour)
}



module.exports = route;

