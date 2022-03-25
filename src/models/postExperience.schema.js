const mongoose = require('mongoose')
const moment = require('moment')


exports.PostExperience = mongoose.model(
    'PostExperience',
    new mongoose.Schema({
        postText: { type: String, required: true },
        photo: { type: String },
        address: { type: String, required: true },
        numberOfLike: { type: Number, default: 0 },
        numberOfComment: { type: Number, default: 0 },
        createdAt: { type: String, default: new Date() },
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    })
)
