const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.HotelRoom = mongoose.model(
    'HotelRoom',
    new mongoose.Schema({
        roomName: {type: String, required: true},
        price: {type: String, required: true},
        bedroom: {
            singleBed: {type: Number, default: 0},
            doubleBed: {type: Number, default: 0},
            queenSizeBed: {type: Number, default: 0},
            kingSizeBed: {type: Number, default: 0},
        },
        utilities: {
            parking: {type : Boolean, default: false},
            wifi: {type : Boolean, default: false},
            pool: {type : Boolean, default: false},
            smoking: {type : Boolean, default: false},
        },
        photo: {type: String, required: true},
        description: {type: String, required: true},
        address: {type: String, required: true},
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        slug: {type: String, slug: 'roomName', unique: true }
    },
    {
        timestamps: true
    })
)
