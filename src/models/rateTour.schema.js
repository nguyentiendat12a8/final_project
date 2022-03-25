const mongoose = require('mongoose')

exports.RateTour = mongoose.model(
    'RateTour',
    new mongoose.Schema({
        point: {type: Number, required: true},
        createdAt: { type: String, default: new Date() },
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }]
    })
)
