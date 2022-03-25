const mongoose = require('mongoose')

exports.BillTour = mongoose.model(
    'BillTour',
    new mongoose.Schema({
        bookedDate: {type: Date, default: new Date},
        deleted: {type: Boolean, default: false},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }],
    })
)
