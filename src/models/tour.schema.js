const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.Tour = mongoose.model(
    'Tour',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        startDate: {type: Date, required: true},
        price: {type: String, required: true},
        picture: {type: String, required: true},
        address: {type: String, required: true},
        time: {type: String, required: true},
        description: {type: String, required: true},
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
