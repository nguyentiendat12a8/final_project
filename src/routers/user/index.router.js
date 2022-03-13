const account = require('./manageAccount.router')

function route(app){
    app.use('/user/account',account)
    //app.use('/admin/tour', tour)
    // app.use('/admin/', tour)
}



module.exports = route;

