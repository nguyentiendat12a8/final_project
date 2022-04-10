const mongoose = require('mongoose')

exports.CategoryTour = mongoose.model(
    'CategoryTour',
    new mongoose.Schema({
        categoryName: {type: String, required: true}
    }, {
        timestamps: { createdAt : 'createdAt'}
    })
)
