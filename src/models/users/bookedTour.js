const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.BookedTour = mongoose.model(
    'BookedTour',
    new mongoose.Schema({
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        },
        tourId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tour'
        },
        bookedDate: Date,
        slug: {type: String, slug: 'bookedDate', unique: true}
    })
)

