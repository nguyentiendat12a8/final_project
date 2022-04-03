const mongoose = require('mongoose')

exports.TourAds = mongoose.model(
    'TourAds',
    new mongoose.Schema({
        createdAt: { type: String, default: new Date(), expires: 3600 },
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }],
    })
)

