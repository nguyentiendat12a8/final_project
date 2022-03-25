const mongoose = require('mongoose')


exports.BillHotelRoom = mongoose.model(
    'BillHotelRoom',
    new mongoose.Schema({
        checkIn: {type: Date, required: true},
        checkOut: {type: Date, required: true},
        deleted: {type: Boolean, default: false},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        hotelRoomID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HotelRoom'
        }],
        createdAt: { type: String, default: new Date() },
    })
)
