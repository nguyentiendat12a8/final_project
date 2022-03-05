const mongoose = require('mongoose')

exports.Rate = mongoose.model(
    'Rate',
    new mongoose.Schema({
        point: {type: Number, required: true},
        userID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }]
    })
)
