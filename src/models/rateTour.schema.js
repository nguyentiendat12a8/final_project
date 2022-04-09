const mongoose = require('mongoose')

exports.RateTour = mongoose.model(
    'RateTour',
    new mongoose.Schema({
        point: {type: Number, required: true},
        comment: {type: String},
        // createdAt: { type: String, default: new Date() },
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }], 
        billTourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BillTour'
        }]
    }, {
        timestamps: { createdAt: 'createdAt'}
    })
)
