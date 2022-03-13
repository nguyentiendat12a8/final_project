const dbb = require('../')
const db = require('../models/index')
const User = db.user
const Admin = db.admin
const Moderator = db.moderator
const ROLES = db.ROLES

exports.checkDuplicateUser = (req, res, next) => {
    User.findOne({
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
        User.findOne({
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

exports.checkDuplicateAdmin = (req, res, next) => {
    Admin.findOne({
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
        Admin.findOne({
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

exports.checkDuplicateMod = (req, res, next) => {
    Moderator.findOne({
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
        Moderator.findOne({
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

