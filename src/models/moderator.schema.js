const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.Moderator = mongoose.model(
    'Moderator',
    new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        modName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        avatar: {type: String},
        organizationName: {type: String, required: true},
        numberOfRates: {type: Number, default: 0},
        dueDate: {type: String},
        tourCustomStatus: {type: Boolean},
        deleted: {type: Boolean, default: false},
        slug: {type: String, slug: 'modName', unique: true },
    },
    {
        timestamps: true
    })
)
