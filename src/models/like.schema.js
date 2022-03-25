const mongoose = require('mongoose')

exports.Like = mongoose.model(
    'Like',
    new mongoose.Schema({
        like: {type: Boolean},
        createdAt: { type: String, default: new Date() },
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        postExperienceID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostExperience'
        }]
    })
)
