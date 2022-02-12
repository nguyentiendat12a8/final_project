// const {Tour} = require('../models/users/tour')
const db = require('../models/users/index')
const Tour = db.tour

const jwt = require('jsonwebtoken')
const config = process.env

exports.store = (req,res,next) =>{
    if(req.files){
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.picture = path
    }else {
        req.body.picture='No photo'
    }

    // TEST LAY ID Acount
    // let token = req.body.token || req.query.token ||req.headers["x-access-token"];
    // //const token = req.cookies.access_token
    // //const token = req.body.access_token
    // if(!token){
    //    return res.status(401).send("token is required!")
    // }
    // jwt.verify(token, config.TOKEN_KEY, (err,decoded)=>{
    //     if(err){
    //         if(err.name === 'JsonWebTokenError'){
    //             return res.status(401).send({message:'Unauthorized!'})
    //         }
    //         return res.status(401).send({message: err.message})
    //     }
    //     req.userId = decoded.id
       
    //     //next()
    // })


    if(req.userId){
        req.body.accountId = req.userId
    } else {
        req.body.accountId = 'khong co id'
    }
    
    const tour = new Tour (req.body)
    tour.save()
    .then (response =>{
        res.status(200).send({message: 'upload successfully!'})
    })
    .catch(error =>{
        console.log(error)
        res.status(500).send({message : error})
    })
}