const mongoose = require('mongoose')

exports.Comment = mongoose.model(
    'Comment',
    new mongoose.Schema({
        commentText: {type: String, required: true},
        createdAt: { type: String, default: new Date() },
        //timeCommentText: {type: String, required: true},
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
