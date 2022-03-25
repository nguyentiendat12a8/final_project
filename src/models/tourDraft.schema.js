const mongoose = require('mongoose')

exports.TourDraft = mongoose.model(
    'TourDraft',
    new mongoose.Schema({
        point: {type: Number, required: true},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }],
        createdAt: { type: String, default: new Date() },
    })
)
