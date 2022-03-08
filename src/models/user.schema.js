const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
const softDelete = require('mongoose-delete')
mongoose.plugin(slug)

exports.User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        userName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        avatar: {type: String},
        slug: {type: String, slug: 'userName', unique: true }
    },
    {
        timestamps: true
    })
)

