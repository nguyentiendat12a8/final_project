const db = require('../../models/index')
const Tour = db.tour
const CategoryTour = db.categoryTour
const BillTour = db.billTour
const Moderator = db.moderator
const User = db.user
const TourDraft = db.tourDraft
const TourDraftStatus = db.tourDraftStatus
const TourCustom = db.tourCustom
const paypal = require('paypal-rest-sdk')

exports.addTour = async (req, res, next) => {
    try {
        if (req.files) {
            let path = ''
            req.files.forEach(files => {
                path = path + files.path + ','
            });
            path = path.substring(0, path.lastIndexOf(','))
            req.body.picture = path
        } else {
            req.body.picture = ''
        }
        const category = await CategoryTour.findOne({ categoryName: req.query.categoryName })
        const moderator = await Moderator.findById(req.accountID)
        const tour = new Tour({
            tourName: req.body.tourName,
            startDate: req.body.startDate,
            price: req.body.price,
            time: req.body.time,
            picture: req.body.picture,
            address: req.body.address,
            startingPoint: req.body.startingPoint,
            hotel: req.body.hotel,
            description: {
                content: req.body.content,
                vehicle: req.body.vehicle,
                timeDecription: req.body.timeDecription
            },
            moderatorID: moderator._id,
            categoryTourID: category._id,
        })
        tour.save()
            .then(() => {
                return res.status(200).send({
                    errorCode: 0,
                    message: 'upload successfully!'
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(500).send({ 
                    errorCode: 500,
                    message: error 
                })
            })
    } catch (error) {
        console.log(error)
    }

}

exports.editTour = (req, res, next) => {
    try {
        Tour.findOne({ slug: req.params.slug, moderatorID: req.accountID}, async (err, tour) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            if (tour == null) {
                return res.status(400).send({
                    errorCode: 400,
                    message: 'Invalid link'
                })
            }
            const category = await CategoryTour.findById(tour.categoryTourID)
            const tourDetail = {
                startDate: tour.startDate,
                picture: tour.picture,
                price: tour.price,
                time: tour.time,
                description: {
                    content: tour.description.content,
                    vehicle: tour.description.vehicle,
                    timeDecription: tour.description.timeDecription,
                },
                private: tour.private,
                hotel: tour.hotel,
                categoryName: category.categoryName,
                slug: tour.slug
            }
            return res.status(200).send({
                errorCode: 0,
                data: tourDetail
            })
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: error
        })
    }
}

exports.updateTour = async (req, res, next) => {
    const category = CategoryTour.findOne({ categoryName: req.body.categoryName })
    Tour.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID}, {
        startDate: req.body.startDate,
        price: req.body.price,
        picture: req.body.picture,
        address: req.body.address,
        time: req.body.time,
        private: req.body.private,
        hotel: req.body.hotel,
        description: {
            content: req.body.content,
            vehicle: req.body.vehicle,
            timeDecription: req.body.timeDecription
        },
        categoryTourID: category._id,
    }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'update tour successfully!'
        })
    })
}

// exports.deleteTour = (req, res, next) => {
//     Tour.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID }, { deleted: true }, { new: true }, err => {
//         if (err) return res.status(500).send({
//             errorCode: 500,
//             message: err
//         })
//         return res.status(200).send({
//             errorCode: 0,
//             message: 'delete tour successfully!'
//         })
//     })
// }


//list tour according moderator 
exports.listTour = (req, res, next) => {
    Tour.find({ moderatorID: req.accountID}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        let show = []
        list.forEach(e => {
            var tour = {
                tourName: e.tourName,
                picture: e.picture,
                startDate: e.startDate,
                time: e.time,
                price: e.price,
                address: e.address,
                startingPoint: e.startingPoint,
                numberOfRate: e.rate.numberOfRate,
                numberOfStar: e.rate.numberOfStar,
                private: e.private,
                slug: e.slug
            }
            show.push(tour)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show,
        })
    })
}

exports.detailTour = async (req, res) => {
    Tour.findOne({ slug: req.params.slug, moderatorID: req.accountID}, async (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if (tour == null) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Invalid link'
            })
        }
        const category = await CategoryTour.findById(tour.categoryTourID)
        const day = tour.createdAt.getDate()
        const month = tour.createdAt.getMonth()
        const year = tour.createdAt.getYear()
        const tourDetail = {
            tourName: tour.tourName,
            startDate: tour.startDate,
            price: tour.price,
            picture: tour.picture,
            time: tour.time,
            address: tour.address,
            startingPoint: tour.startingPoint,
            hotel: tour.hotel,
            numberOfRate: e.rate.numberOfRate,
            numberOfStar: e.rate.numberOfStar,
            description: {
                content: tour.description.content,
                vehicle: tour.description.vehicle,
                timeDecription: tour.description.timeDecription,
            },
            private: tour.private,
            categoryName: category.categoryName,
            createdAt: day + '/' + month + '/' + year,
            slug: tour.slug
        }
        return res.status(200).send({
            errorCode: 0,
            data: tourDetail
        })
    })
}

//search, filter
exports.searchTour = async (req, res) => {
    Tour.find({ moderatorID: req.accountID}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var search = req.query.address
        var dataSearch = list.filter(r => r.address.toLowerCase().includes(search.toLowerCase()))
        var show = []
        dataSearch.forEach(e => {
            var tour = {
                tourName: e.tourName,
                startDate: e.startDate,
                time: e.time,
                price: e.price,
                address: e.address,
                startingPoint: e.startingPoint,
                numberOfRate: e.rate.numberOfRate,
                numberOfStar: e.rate.numberOfStar,
                private: e.private,
                slug: e.slug
            }
            show.push(tour)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show,
        })
    })
}

exports.filterTour = async (req, res) => {
    Tour.find({ moderatorID: req.accountID}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if (req.query.filter === 'ASC') {
            var dataSortASC = list.sort((a, b) => a.price - b.price)
            var show = []
            dataSortASC.forEach(e => {
                var tour = {
                    tourName: e.tourName,
                    startDate: e.startDate,
                    time: e.time,
                    price: e.price,
                    address: e.address,
                    startingPoint: e.startingPoint,
                    numberOfRate: e.rate.numberOfRate,
                    numberOfStar: e.rate.numberOfStar,
                    private: e.private,
                    slug: e.slug
                }
                show.push(tour)
            })
            return res.status(200).send({
                errorCode: 0,
                data: show,
            })
        } else if (req.query.filter === 'DES') {
            var dataSortDES = list.sort((a, b) => b.price - a.price)
            var show = []
            dataSortDES.forEach(e => {
                var tour = {
                    tourName: e.tourName,
                    startDate: e.startDate,
                    time: e.time,
                    price: e.price,
                    address: e.address,
                    startingPoint: e.startingPoint,
                    numberOfRate: e.rate.numberOfRate,
                    numberOfStar: e.rate.numberOfStar,
                    private: e.private,
                    slug: e.slug
                }
                show.push(tour)
            })
            return res.status(200).send({
                errorCode: 0,
                data: show,
            })
        }
    })
}

//booked tour

exports.listBillTour = async (req, res, next) => {
    try {
        Tour.find({ moderatorID: req.accountID }, (err, listTour) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            let listBill = []
            let listDetail = []
            listTour.forEach(async e => {
                BillTour.find({ tourID: e._id}, (err, bill) => {
                    if (err) return res.status(500).send({
                        errorCode: 500,
                        message: err
                    })
                    listBill.push(bill)
                })
            })
            listBill.forEach(async e => {
                var user = await User.findById(e.userID)
                var tour = await Tour.findById(e.tourID)
                var detail = {
                    bookedDate: e.bookedDate,
                    tourName: tour.tourName,
                    userID: user.userName,
                }
                listDetail.push(detail)
            })
            return res.status(200).send({
                errorCode: 0,
                data: listDetail
            })
        })
    }
    catch (err) {
        return res.status(500).send({
            errorCode: 500,
            message: err
        })
    }
}


//TOUR CUSTOM
exports.addTourCustom =async (req,res) => {
    try {
        if (req.files) {
            let path = ''
            req.files.forEach(files => {
                path = path + files.path + ','
            });
            path = path.substring(0, path.lastIndexOf(','))
            req.body.picture = path
        } else {
            req.body.picture = ''
        }
        const moderator = await Moderator.findById(req.accountID)
        const tour = new TourCustom({
            tourName: req.body.tourName,
            startDate: req.body.startDate,
            price: req.body.price,
            time: req.body.time,
            picture: req.body.picture,
            address: req.body.address,
            startingPoint: req.body.startingPoint,
            hotel: req.body.hotel,
            description: {
                content: req.body.content,
                vehicle: req.body.vehicle,
                timeDecription: req.body.timeDecription
            },
            moderatorID: moderator._id,
            tourDraftID: req.params.tourDraftID
        })
        tour.save()
            .then(() => {
                return res.status(200).send({
                    errorCode: 0,
                    message: 'upload successfully!'
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(500).send({ 
                    errorCode: 500,
                    message: error 
                })
            })
    } catch (error) {
        return res.status(500).send({ 
            errorCode: 500,
            message: error 
        })
    }

}

exports.viewListTourCustomToUser = async (req, res) => {
    // 1. trỏ đến bảng tourdraftstatus để lấy ra các bản ghi có modid
    // 2. bản ghi .foreach để lấy ra các draftTour sau đó push vào show
    TourDraftStatus.find({moderatorID: req.accountID}, (err, listTour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if(!listTour) return res.status(200).send({
            errorCode: 0,
            message: 'There are no documents listed here'
        })
        var listShow = []
        listTour.forEach(async e => {
            var tour = await TourDraft.findById(e._id)
            if (!tour) return res.status(500).send({
                errorCode: 500,
                message: 'Tour custom đã bị xóa hoặc lỗi phía máy chủ'
            })
            var show = {
                createdAt: e.createdAt,
                tourName: tour.tourName,
                address: tour.destination.address,
                startDate: tour.startDate,
                numberOfPeople: tour.numberOfPeople,
                _id: tour._id,
            }
            listShow.push(show)
        })
        return res.status(200).send({
            errorCode: 0,
            data: listShow
        })
    }) 
}

exports.viewAndAddTourCustom = (req, res) => {
    TourDraft.findById({_id: req.params.tourDraftID}, (err, tour) =>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if(!tour) return res.status(400).send({
            errorCode: 400,
            message: 'The tour has been deleted by the user, please try again!'
        })
        return res.status(200).send({
            errorCode: 0,
            data: tour
        })
    })
}

exports.viewListCustomTour = (req,res) =>{
    TourCustom.find({moderatorID: req.accountID}, (err, list) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if(!list) return res.status(400).send({
            errorCode: 400,
            message: 'There are no documents listed here'
        })
        var show =[]
        list.forEach(e=> {
            var tour = {
                tourName: e.tourName,
                picture: e.picture,
                startDate: e.startDate,
                time: e.time,
                price: e.price,
                address: e.address,
                startingPoint: e.startingPoint,
                slug: e.slug
            }
            show.push(tour)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.viewDetailCustomTour = (req,res) => {
    TourCustom.findOne({ slug: req.params.slug, moderatorID: req.accountID}, (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if (!tour) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Invalid link'
            })
        }
        const tourDetail = {
            tourName: tour.tourName,
            startDate: tour.startDate,
            price: tour.price,
            picture: tour.picture,
            time: tour.time,
            address: tour.address,
            startingPoint: tour.startingPoint,
            hotel: tour.hotel,
            description: {
                content: tour.description.content,
                vehicle: tour.description.vehicle,
                timeDecription: tour.description.timeDecription,
            },
        }
        return res.status(200).send({
            errorCode: 0,
            data: tourDetail
        })
    })
}