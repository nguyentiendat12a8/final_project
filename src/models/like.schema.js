const mongoose = require('mongoose')

exports.Like = mongoose.model(
    'Like',
    new mongoose.Schema({
        like: {type: Boolean},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        postExperience: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostExperience'
        }]
    },
    {
        timestamps: true
    })
)
