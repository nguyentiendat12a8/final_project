const mongoose = require("mongoose");

exports.ResetPassword = mongoose.model(
    'ResetPassword',
    new mongoose.Schema({
        accountID: { type: String,
            //type: mongoose.Schema.Types.ObjectId,
            required: true,
            //ref: "User",
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600,
        },
    }))

