const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.Tour = mongoose.model(
    'Tour',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        startDate: {type: String, required: true},
        price: {type: Number, required: true},
        picture: {type: String, required: true},
        description: {type: String, required: true},
        status: Boolean,
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        slug: {type: String, slug: 'tourName', unique: true}
    })
)

