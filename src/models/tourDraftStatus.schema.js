const mongoose = require('mongoose')

exports.TourDraftStatus = mongoose.model(
    'TourDraftStatus',
    new mongoose.Schema({
        point: {type: Number, required: true},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }]
    },
    {
        timestamps: true
    })
)
