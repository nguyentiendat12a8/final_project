const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.Tour = mongoose.model(
    'Tour',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        startDate: {type: String, required: true},
        adultPrice: {type: String, required: true},
        childPrice: {type: String, required: true},
        picture: {type: String, required: true},
        description: {type: String, required: true},
        status: Boolean,
        accountId: String,
        slug: {type: String, slug: 'tourName', unique: true}
    })
)

