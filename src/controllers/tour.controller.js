// const {Tour} = require('../models/users/tour')
const db = require('../models/users/index')
const Tour = db.tour

exports.store = (req,res,next) =>{
    if(req.files){
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.picture = path
    
    
    }else {
        req.body.picture='khong co anh'
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