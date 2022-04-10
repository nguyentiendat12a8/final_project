const db = require('../models/index')
const BillHotelRoom = db.billHotelRoom

exports.checkTimeBooking = (req,res,next) => {
    BillHotelRoom.find({slug: req.params.slug}, (err, list) => {
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var timeBooked = []
        list.forEach(e => {
            var time = {
                checkIn: e.checkIn,
                checkOut: e.checkOut
            }
            timeBooked.push(time)
        })
        req.timeBooked = timeBooked
        next()
    })
}