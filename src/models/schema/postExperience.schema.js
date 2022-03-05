const mongoose = require('mongoose')

exports.PostExperience = mongoose.model(
    'PostExperience',
    new mongoose.Schema({
        postText: {type: String, required: true},
        photo: {type: String},
        address: {type: String, required: true},
        time: {type: String, required: true},
        numberOfLike: {type: Number},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    })
)
