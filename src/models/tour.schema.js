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
        address: {type: String, required: true},
        description: {
            vehicle: {type: String},
            timeDecription: {type: String}
        },
        //deleted: {type: Boolean, default: false},
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        categoryTourID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CategoryTour'
        }],
        slug: {type: String, slug: 'tourName', unique: true }
    },
    {
        timestamps: true
    })
)