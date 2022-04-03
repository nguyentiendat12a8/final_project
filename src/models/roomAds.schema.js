const mongoose = require('mongoose')

exports.RoomAds = mongoose.model(
    'RoomAds',
    new mongoose.Schema({
        createdAt: { type: String, default: new Date(), expires: 3600 },
        hotelRoomID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HotelRoom'
        }],
    })
)

