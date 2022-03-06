const jwt = require('jsonwebtoken')
const config = process.env
const db = require('../models/index')
const Admin = db.admin
const Moderator = db.moderator

exports.verifyToken = async (req, res, next) => {
    let token = req.body.token || req.query.token ||req.headers["x-access-token"];
    //const token = req.cookies.access_token
    //const token = req.body.access_token
    if(!token){
       return res.status(401).send("token is required!")
    }
    jwt.verify(token, config.TOKEN_KEY, (err,decoded)=>{
        if(err){
            if(err.name === 'JsonWebTokenError'){
                return res.status(401).send({message:'Unauthorized!'})
            }
            return res.status(401).send({message: err.message})
        }
        req.userId = decoded.id
        //return res.send({token : token})
        next()
    })
}

exports.verifyRefreshToken = (req, res, next) => {
    let refreshToken = req.body.refreshToken || req.query.refreshToken
    //const refreshToken = req.cookies.access_token
    //const token = req.body.access_token
    if (!refreshToken) {
        return res.status(401).send("chua duoc dang nhap")
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
        return res.send({token : token})
    })
}

exports.isAdmin = (req, res, next) => {
    Admin.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        next()
    })
}

exports.isModerator = (req, res, next) => {
    Moderator.findById(req.userId).exec(err => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        next()
    })
}