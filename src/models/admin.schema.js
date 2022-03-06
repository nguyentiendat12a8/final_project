const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.Admin = mongoose.model(
    'Admin',
    new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        adminName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        avatar: String,
        slug: {type: String, slug: 'adminName', unique: true }
    })
)
