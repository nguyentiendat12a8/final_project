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
        organizationName: {type: String, required: true},
        //dueDate: {type: String},
        tourCustomStatus: {type: Boolean, default: false},
        deleted: {type: Boolean, default: false},
        slug: {type: String, slug: 'modName', unique: true },
        createdAt: { type: String, default: new Date() },
    })
)
