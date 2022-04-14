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
            return res.status(500).send({
                errorCode: 500,
                message: err
            })
        }
        if (user) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Failed! username is already in use'
            })
        }
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                return res.status(500).send({
                    errorCode: 500,
                    message: err
                })
            }
            if (user) {
                return res.status(400).send({
                    errorCode: 400,
                    message: 'failed! email is already in use'
                })
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
            return res.status(500).send({
                errorCode: 500,
                message: err
            })
        }
        if (user) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Failed! username is already in use'
            })
        }
        Admin.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                return res.status(500).send({
                    errorCode: 500,
                    message: err
                })
            }
            if (user) {
                return res.status(400).send({
                    errorCode: 400,
                    message: 'failed! email is already in use'
                })
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
            return res.status(500).send({
                errorCode: 500,
                message: err
            })
        }
        if (user) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Failed! username is already in use'
            })
        }
        Moderator.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                return res.status(500).send({
                    errorCode: 500,
                    message: err
                })
            }
            if (user) {
                return res.status(400).send({
                    errorCode: 400,
                    message: 'failed! email is already in use'
                })
            }
            next()
        })
    })
}

