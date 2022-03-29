const db = require('../models/index')
const BillTour = db.billTour
const RateTour = db.rateTour

exports.checkRate = async (req,res,next) => {
    const check = await RateTour.findOne({billTourID: req.params.billTourID})
    if(!check) return next()
    else return res.status(400).send({
        errorCode: 400,
        message: 'The link is wrong or you have already rated this trip'
    })
}