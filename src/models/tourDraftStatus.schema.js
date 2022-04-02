const mongoose = require('mongoose')

exports.TourDraftStatus = mongoose.model(
    'TourDraftStatus',
    new mongoose.Schema({
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        tourDraftID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TourDraft'
        }],
        createdAt: { type: String, default: new Date(), expires: 36000, } //10h
    })
)
