const jwt = require('jsonwebtoken')
const config = process.env
const db = require('../models/index')
const Admin = db.admin
const Moderator = db.moderator

exports.verifyToken = async (req, res, next) => {
    try {
        let token = req.body.token || req.query.token || req.headers["x-access-token"];
        if (!token) {
            return res.status(401).send({
                errorCode: 401,
                message: "token is required!"
            })
        }
        jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).send({
                        errorCode: 401,
                        message: 'Unauthorized!'
                    })
                }
                return res.status(401).send({
                    errorCode: 401,
                    message: err.message
                })
            }
            req.accountID = decoded.id
            next()
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'JWT server is error!'
        })
    }
}

exports.verifyRefreshToken = (req, res, next) => {
    try {
        let refreshToken = req.body.refreshToken || req.query.refreshToken
        if (!refreshToken) {
            return res.status(401).send({
                errorCode: 401,
                message: 'Unauthorized!'
            })
        }

        jwt.verify(refreshToken, config.REFRESH_TOKEN_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: 'Unauthorized!' })
            }
            const token = jwt.sign({ id: decoded.id }, config.TOKEN_KEY, {
                expiresIn: config.tokenLife
            })
            //req.userId = decoded.id
            //return res.json(token)
            return res.send({ token: token })
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'JWT server is error!'
        })
    }
}

exports.isAdmin = (req, res, next) => {
    Admin.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({
                errorCode: 500,
                message: 'Admin server is error!'
            })
        }
        if(!user){
            return res.status(401).send({
                errorCode: 401,
                message: 'Require user role!'
            })
        }
        next()
    })
}

exports.isModerator = (req, res, next) => {
    Moderator.findById(req.userId).exec((err, moderator)=> {
        if (err) {
            return res.status(500).send({
                errorCode: 500,
                message: 'Moderator server is error!'
            })
        }
        if(!moderator){
            return res.status(401).send({
                errorCode: 401,
                message: 'Require moderator role!'
            })
        }
        
        next()
    })
}