const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.BookedTour = mongoose.model(
    'BookedTour',
    new mongoose.Schema({
        accountId: String,
        tourId: String,
        bookDate: Date,
        slug: {type: String, slug: 'bookDate', unique: true}
    })
)

