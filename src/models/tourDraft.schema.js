const mongoose = require('mongoose')

exports.TourDraft = mongoose.model(
    'TourDraft',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        destination: {
            address: {type: String, required: true},
            mainActivities: {type: String, required: true}
        },
        startingPoint: {},
        picture: {},
        
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
