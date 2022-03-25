const mongoose = require('mongoose')

exports.PaypalInfo = mongoose.model(
    'PaypalInfo',
    new mongoose.Schema({
        clientID: {type: String, required: true},
        secret: {type: String, required: true},
        moderatorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Moderator'
        }],
        createdAt: { type: String, default: new Date() },
    })
)
