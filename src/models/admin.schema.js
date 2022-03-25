const mongoose = require('mongoose')

exports.Admin = mongoose.model(
    'Admin',
    new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        adminName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        avatar: String,
        deleted: {type: Boolean, default: false},
        createdAt: { type: String, default: new Date() },
        slug: {type: String, slug: 'adminName', unique: true }
    }
    )
)
