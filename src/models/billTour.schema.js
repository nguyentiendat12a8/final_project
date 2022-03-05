const mongoose = require('mongoose')

exports.BillTour = mongoose.model(
    'BillTour',
    new mongoose.Schema({
        bookedDate: {type: Date, required: true},
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
