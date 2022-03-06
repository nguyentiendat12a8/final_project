const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.TourCustom = mongoose.model(
    'TourCustom',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        startDate: {type: Date, required: true},
        price: {type: String, required: true},
        picture: {type: String, required: true},
        time: {type: String, required: true},
        address: {type: Date, required: true},
        mode: {type: String, required: true},
        description: {type: String, required: true},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        categoryTourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CategoryTour'
        }],
        slug: {type: String, slug: 'tourName', unique: true }
    })
)
