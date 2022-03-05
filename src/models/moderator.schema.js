const mongoose = require('mongoose')

exports.Moderator = mongoose.model(
    'Moderator',
    new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        modName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        avatar: {type: String},
        origanizationName: {type: String, required: true},
        numberOfRates: {type: String},
        dueDate: {type: String, required: true},
        tourCustomStatus: {type: Boolean},
        slug: {type: String, slug: modName, unique: true },
    })
)
