const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');

exports.Tour = mongoose.model(
    'Tour',
    new mongoose.Schema({
        tourName: {type: String, required: true},
        price: String,
        picture: String,
        description: String,
        status: Boolean,
        
        // accountId: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Account'
        // }],
        //slug: {type: String, slug: 'tourName', unique: true}
    })
)

//mongoose.plugin(slug)