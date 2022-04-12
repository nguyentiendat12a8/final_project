const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.Tour = mongoose.model(
    'Tour',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        startDate: {type: Date, required: true},
        price: {type: Number, required: true},
        picture: {type: String, required: true},
        time: {type: String, required: true},
        address: {type: String, required: true},
        startingPoint: {type: String, required: true},
        description: {
            content: {type: String},
            vehicle: {type: String},
            timeDecription: {type: String}
        },
        rate: {
            numberOfStar: {type: Number, default: 0},
            numberOfRate: {type: Number, default: 0}
        },
        hotel: {type: String},
        private: {type: Boolean, default: false},
        //deleted: {type: Boolean, default: false},
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        categoryTourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CategoryTour'
        }],
        slug: {type: String, slug: 'tourName', unique: true },
        createdAt: { type: String, default: new Date() },
    })
)
