const mongoose = require('mongoose')

exports.Post = mongoose.model(
    'Post',
    new mongoose.Schema({
        postText: {type: String, required: true},
        photo: {type: String},
        time: {type: String, required: true},
        address: {type: String, required: true},
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }]
    })
)
