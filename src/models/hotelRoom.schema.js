const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.HotelRoom = mongoose.model(
    'HotelRoom',
    new mongoose.Schema({
        roomName: {type: String, required: true},
        price: {type: Number, required: true},
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
            TV: {type : Boolean, default: false},
            kitchen: {type : Boolean, default: false},
            bathtub: {type : Boolean, default: false},
        },
        photo: {type: String, required: true},
        acreage: {type: String, required: true},
        description: {type: String, required: true},
        address: {type: String, required: true},
        //deleted: {type: Boolean, default: false},
        private: {type: Boolean, default: false},
        createdAt: { type: String, default: new Date() },
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        slug: {type: String, slug: 'roomName', unique: true }
    })
)
