const mongoose = require('mongoose')

exports.User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        userName: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},
        avatar: {type: String},
        deleted: {type: Boolean, default: false},
        //slug: {type: String, slug: 'userName', unique: true },
        //createdAt: { type: String, default: new Date() },

    },
    {
        timestamps: {
            createdAt: 'createdAt',
            //updatedAt: 'updatedAt'
        }
    })
)

