const mongoose = require('mongoose')

exports.RoomAds = mongoose.model(
    'RoomAds',
    new mongoose.Schema({
        timeEnd: { type: Date, default: new Date(), expires: 604800 }, //7 days
        hotelRoomID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HotelRoom'
        }],
    })
)

