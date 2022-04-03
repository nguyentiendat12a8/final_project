const mongoose = require('mongoose')

exports.Ads = mongoose.model(
    'Ads',
    new mongoose.Schema({
        price: {type: Number, required: true},
    })
)

