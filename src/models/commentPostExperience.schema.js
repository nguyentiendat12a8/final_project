const mongoose = require('mongoose')

exports.CommentPostExperience = mongoose.model(
    'CommentPostExperience',
    new mongoose.Schema({
        commentText: {type: String, required: true},
        timeCommentText: {type: String, required: true},
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
