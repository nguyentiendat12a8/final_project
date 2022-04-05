const mongoose = require('mongoose')

exports.TourAds = mongoose.model(
    'TourAds',
    new mongoose.Schema({
        timeEnd: { type: Date, default: new Date(), expires: 604800 }, //7 days
        tourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        }],
    })
)

