const account = require('./manageAccount.router')
const tour = require('./manageTour.router')
const ads = require('./manageAds.router')

function route(app){
    app.use('/admin/account',account)
    app.use('/admin/tour', tour)
    app.use('/admin/ads', ads)
}

module.exports = route;