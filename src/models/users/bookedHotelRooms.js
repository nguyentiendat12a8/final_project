const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.BookedHotelRooms = mongoose.model(
    'BookedHotelRooms',
    new mongoose.Schema({
        accountId: String,
        roomId: String,
        checkin: Date,
        checkout:Date,
        slug: {type: String, slug: 'bookDate', unique: true}
    })
)

