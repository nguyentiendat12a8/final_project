// const mongoose = require('mongoose')

// exports.Role = mongoose.model(
//     'Role',
//     new mongoose.Schema({
//         name: String
//     })
// )
// exports.ROLES = ['user', 'admin', ' moderator']


const mongoose = require('mongoose')

const Role = mongoose.model(
    'Role',
    new mongoose.Schema({
        name: String
    })
)

module.exports = Role