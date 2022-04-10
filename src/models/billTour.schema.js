const mongoose = require('mongoose')

exports.BillTour = mongoose.model(
    'BillTour',
    new mongoose.Schema({
        price: {type: Number, required: true},
        bookedDate: {type: String, default: new Date},
        
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }],
        tourCustomID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TourCustom'
        }],
    })
)
