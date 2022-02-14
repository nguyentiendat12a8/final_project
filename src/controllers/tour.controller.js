const db = require('../models/users/index')
const Tour = db.tour
//const { multipleMongooseToObject } = require('../util/mongoose');

const jwt = require('jsonwebtoken')
const BookedTour = db.bookedTour
const config = process.env

exports.storeTour = (req, res, next) => {
    if (req.files) {
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.picture = path
    } else {
        req.body.picture = 'No photo'
    }
    if (req.userId) {
        req.body.accountId = req.userId
    } else {
        req.body.accountId = 'khong co id'
    }

    const tour = new Tour(req.body)
    tour.save()
        .then(response => {
            res.status(200).send({
                errorCode: 0,
                message: 'upload successfully!'
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({ message: error })
        })
}

exports.editTour = (req,res,next) =>{
    
}

exports.updateTour = (req,res,next) =>{

}

exports.deleteTour = (req,res,next) =>{
    
}

exports.show = (req, res, next) => {
    Tour.find({
        accountId: req.userId
    })
        .then(tour => {
            res.status(200).send({ 
                errorCode: 0,
                message: tour })
        })
        .catch(err => {
            console.log(err)
        })
}


exports.storeBookedTour = (req,res,next) =>{
    const bookedTour = new BookedTour({
        accountId: req.body.id,
        tourId: req.body.id1,
        bookDate: Date.now()
    })
    bookedTour.save()
    .then(()=>{
        return res.status(200).send({
            errorCode: 0,
            message: 'save booked tour successfully'
        })
    })
    .catch(err =>{
        console.log(err)
    })
}

exports.editBookedTour = (req,res,next) =>{
    
}

exports.updateBookedTour = (req,res,next) =>{
    
}

exports.deleteBookedTour = (req,res,next) =>{
    
}

exports.showBookedTour = (req,res,next) =>{
    
}