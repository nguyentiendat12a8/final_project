const mongoose = require('mongoose')

exports.TourDraftStatus = mongoose.model(
    'TourDraftStatus',
    new mongoose.Schema({
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        tourDraftID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TourDraft'
        }],
        createdAt: { type: Date, default: new Date(), expires: 172800, } // 2 days
    })
)
