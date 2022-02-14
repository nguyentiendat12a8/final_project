const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.HotelRooms = mongoose.model(
    'HotelRooms',
    new mongoose.Schema({
        roomName: {type: String, required: true},
        price: {type: String, required: true},
        bedroom: {
            queenBed: Number,
            kingBed:Number,
            twinBed:Number,
        },
        utilities: {
            wifi: Boolean,
            airportShuttle: Boolean,
            spa: Boolean,
            nonSmoking: Boolean,
            parking: Boolean,
            bar: Boolean
        },
        picture: {type: String, required: true},
        description: {type: String, required: true},
        address: {type: String, required: true},
        slug: {type: String, slug: 'roomName', unique: true}
    })
)

