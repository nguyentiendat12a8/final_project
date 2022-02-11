const jwt = require('jsonwebtoken')
const config = process.env
const db = require('../models/users/index')
const User = db.user
const Role = db.role



verifyToken = async (req, res, next) => {
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
        return res.send({token : token})
        //next()
    })
}

verifyRefreshToken = (req, res, next) => {
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

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        Role.find({
            _id: { $in: user.roles }
        },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        next()
                        return res.json(roles)
                        return
                    }
                }

                res.status(403).send({ message: 'Require admin role!' })
                return
            })

    })
}

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        Role.find({
            _id: { $in: user.roles }
        },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'moderator') {
                        next()
                        return
                    }
                }

                res.status(403).send({ message: 'Require Moderator role!' })
                return
            })

    })
}

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    verifyRefreshToken
}

module.exports = authJwt
