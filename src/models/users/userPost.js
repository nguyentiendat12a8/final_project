const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

exports.UserPost = mongoose.model(
    'UserPost',
    new mongoose.Schema({
        accountId: String,
        post: String,
        image: Date,

        slug: {type: String, slug: 'bookDate', unique: true}
    })
)

