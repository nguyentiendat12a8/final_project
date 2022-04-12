const mongoose = require('mongoose')

exports.TourCustom = mongoose.model(
    'TourCustom',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        startDate: {type: Date, required: true},
        price: {type: Number, required: true},
        picture: {type: String, required: true},
        time: {type: String, required: true},
        address: {type: String, required: true},
        startingPoint: {type: String, required: true},
        description: {
            content: {type: String},
            vehicle: {type: String},
            timeDecription: {type: String}
        },
        hotel: {type: String},
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        tourDraftID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TourDraft'
        }],
        slug: {type: String, slug: 'tourName', unique: true },
        createdAt: { type: String, default: new Date() },
    })
)
