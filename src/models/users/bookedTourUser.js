const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.bookedTour = mongoose.model(
    'bookedTour',
    new mongoose.Schema({
        accountId: String,
        tourId: String,
        bookDate: Date.now(),
        slug: {type: String, slug: 'tourName', unique: true}
    })
)

