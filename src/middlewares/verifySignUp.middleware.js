
const db = require('../models/schema/index')
const Account = db.account
const ROLES = db.ROLES

checkDuplicateUsernameOrEmail = (req, res, next) => {
    Account.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }

        if (user) {
            res.status(400).send({ message: 'Failed! username is already in use' })
            return
        }
        Account.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            if (user) {
                res.status(400).send({ message: 'failed! email is already in use' })
                return
            }
            next()
        })
    })
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        //thu thay for = if (req.body.roles.length > 0)
        //for(let i = 0; i < req.body.roles.length; i++){
        if (!ROLES.includes(req.body.roles)) {
            res.status(400).send({
                message: `Failed! Role ${req.body.roles} does not exist!`
            })
            return
        }
        //}
    }
    next()
}

const verifySignUp = 
{
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
}
module.exports = verifySignUp