// const {Tour} = require('../models/users/tour')
const db = require('../models/users/index')
const Tour = db.tour

exports.store = (req,res,next) =>{
    if(req.file){
        req.body.picture = req.file.path
    }else {
        req.body.picture='khong co anh'
    }
    
    const tour = new Tour (req.body)
    // if(req.file){
    //     tour.picture = req.file.path
    // }
    tour.save()
    .then (response =>{
        res.status(200).send({message: 'upload successfully!'})
    })
    .catch(error =>{
        console.log(error)
        res.status(500).send({message : 'an errorr'})
    })
}