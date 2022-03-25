const mongoose = require('mongoose')

exports.Post = mongoose.model(
    'Post',
    new mongoose.Schema({
        postTitle: {type: String, required: true},
        postText: {type: String, required: true},
        photo: {type: String},
        address: {type: String, required: true},
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        slug: {type: String, slug: 'postTitle', unique: true},
        createdAt: { type: String, default: new Date() },
    })
)
