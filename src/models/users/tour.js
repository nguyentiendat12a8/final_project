const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.Tour = mongoose.model(
    'Tour',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        startDate: String,
        adultPrice: String,
        childPrice: String,
        picture: String,
        description: String,
        status: Boolean,
        accountId: String,
        slug: {type: String, slug: 'tourName', unique: true}
    })
)

