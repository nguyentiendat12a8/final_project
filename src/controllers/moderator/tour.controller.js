const db = require('../../models/index')
const Tour = db.tour
const CategoryTour = db.categoryTour
const BillTour = db.billTour
const Moderator = db.moderator
const User = db.user
const TourDraft = db.tourDraft
const TourDraftStatus = db.tourDraftStatus
const TourCustom = db.tourCustom
const Ads = db.ads
const TourAds = db.tourAds
const PaypalInfo = db.paypalInfo
const paypal = require('paypal-rest-sdk')
const sendEmail = require('../../util/sendEmail')

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
            return res.status(400).json({
                errorCode: 400,
                message: 'Picture must be add in here!',
            })
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
                    message: 'Add tour function is error!'
                })
            })
    } catch (error) {
        return res.status(500).json({
            errorCode: 500,
            message: 'Add tour function is error!',
        })
    }

}

exports.editTour = (req, res, next) => {
    Tour.findOne({ slug: req.params.slug, moderatorID: req.accountID }, async (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Edit tour function is error!'
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
}

exports.updateTour = async (req, res, next) => {
    const category = CategoryTour.findOne({ categoryName: req.body.categoryName })
    Tour.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID }, {
        startDate: req.body.startDate,
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
            message: err.message
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'update tour successfully!'
        })
    })
}

//list tour according moderator 
exports.listTour = (req, res, next) => {
    Tour.find({ moderatorID: req.accountID }, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []

        async function getDetail(detail) {
            var ads = await TourAds.findOne({ tourID: detail._id })
            if (!ads) {
                var tour = {
                    tourName: detail.tourName,
                    picture: detail.picture,
                    //startDate: detail.startDate,
                    //time: detail.time,
                    price: detail.price,
                    address: detail.address,
                    //startingPoint:detail.startingPoint,
                    //numberOfRate: detail.rate.numberOfRate,
                    //numberOfStar: detail.rate.numberOfStar,
                    private: detail.private,
                    slug: detail.slug,
                    timeEnd: null
                }
                return show.push(tour)
            } else {
                var tour = {
                    tourName: detail.tourName,
                    picture: detail.picture,
                    //startDate: detail.startDate,
                    //time: detail.time,
                    price: detail.price,
                    address: detail.address,
                    // startingPoint: detail.startingPoint,
                    // numberOfRate: detail.rate.numberOfRate,
                    // numberOfStar: detail.rate.numberOfStar,
                    private: detail.private,
                    slug: detail.slug,
                    timeEnd: new Date(ads.timeEnd.setDate(ads.timeEnd.getDate() + 7))
                }
                return show.push(tour)
            }
        }

        await Promise.all(list.map(detail => getDetail(detail)))

        return res.status(200).send({
            errorCode: 0,
            data: show,
        })
    })
}

exports.detailTour = async (req, res) => {
    Tour.findOne({ slug: req.params.slug, moderatorID: req.accountID }, async (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Detail tour function is error!'
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

exports.schedule = async (req, res) => {
    try {
        const list = await Tour.find({ moderatorID: req.accountID })
        const listCustom = await TourCustom.find({ moderatorID: req.accountID })
        var listStart = []
        var listCustomStart = []
        var date = new Date()

        //handle schedule tour custom
        listCustom.forEach(e => {
            if (e.startDate.getFullYear() === date.getFullYear()) {
                if (e.startDate.getMonth() === date.getMonth()) {
                    if (e.startDate.getDate() === date.getDate()) {
                        listCustomStart.push(e)
                    }
                }
            }
        })
        async function getTourCustomFromBill(e) {
            var check = await BillTour.find({ tourCustomID: e._id })
            if (check) {
                for (i = 0; i < check.length; i++) {
                    listCustomBillStart.push(check[i])
                }
            }
            return listCustomBillStart
        }
        async function getTourCustomAndUserInfo(i) {
            var tour = await TourCustom.findById(i.tourCustomID)
            var user = await User.findById(i.userID)
            var detail = {
                tourName: tour.tourName,
                startDate: tour.startDate,
                address: tour.address,
                startingPoint: tour.startingPoint,
                userName: user.userName,
                phone: user.phone
            }
            return show.push(detail)
        }
        //handle schedule tour 
        list.forEach(e => {
            if (e.startDate.getFullYear() === date.getFullYear()) {
                if (e.startDate.getMonth() === date.getMonth()) {
                    if (e.startDate.getDate() === date.getDate()) {
                        listStart.push(e)
                    }
                }
            }
        })
        var listBillStart = []
        var listCustomBillStart = []
        async function getTourFromBill(e) {
            var check = await BillTour.find({ tourID: e._id })
            if (check) {
                for (i = 0; i < check.length; i++) {
                    listBillStart.push(check[i])
                }
            }
            return listBillStart
        }
        var show = []
        var showCustom = []
        async function getTourAndUserInfo(i) {
            var tour = await Tour.findById(i.tourID)
            var user = await User.findById(i.userID)
            var detail = {
                tourName: tour.tourName,
                startDate: tour.startDate,
                address: tour.address,
                startingPoint: tour.startingPoint,
                userName: user.userName,
                phone: user.phone
            }
            return show.push(detail)
        }
        await Promise.all(listStart.map(e => getTourFromBill(e)), listCustomStart.map(e => getTourCustomFromBill(e)))
        await Promise.all(listBillStart.map(i => getTourAndUserInfo(i)), listCustomBillStart.map(i => getTourCustomAndUserInfo(i)))
        return res.status(200).send({
            errorCode: 0,
            data: {
                show,
                showCustom
            }
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Schedule function is error!'
        })
    }

}
//search, filter
exports.searchTour = async (req, res) => {
    Tour.find({ moderatorID: req.accountID }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
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
    Tour.find({ moderatorID: req.accountID }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
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
        const listTour = await Tour.find({ moderatorID: req.accountID })
        const listTourCustom = await TourCustom.find({ moderatorID: req.accountID })
        var listDetail = []
        var listCustomDetail = []
        async function getBill(e) {
            var bill = await BillTour.find({ tourID: e._id })
            if (bill) {
                for (i = 0; i < bill.length; i++) {
                    var user = await User.findById(bill[i].userID)
                    var tour = await Tour.findById(bill[i].tourID)
                    var detail = {
                        price: bill[i].price,
                        bookedDate: bill[i].bookedDate,
                        tourName: tour.tourName,
                        startDate: tour.startDate,
                        userID: user.userName,
                        _id: bill[i]._id
                    }
                    listDetail.push(detail)
                }
            }
            return listDetail
        }
        async function getCustomBill(t) {
            var bill = await BillTour.find({ tourCustomID: t._id })
            if (bill) {
                if (bill.length === 1) {
                    var user = await User.findById(bill[0].userID)
                    var tourCustom = await TourCustom.findById(bill[0].tourCustomID)
                    var detail = {
                        price: bill[0].price,
                        bookedDate: bill[0].bookedDate,
                        tourName: tourCustom.tourName,
                        startDate: tourCustom.startDate,
                        userID: user.userName,
                        _id: bill[0]._id
                    }
                } else {
                    for (i = 0; i < bill.length; i++) {
                        var user = await User.findById(bill[i].userID)
                        var tourCustom = await TourCustom.findById(bill[i].tourCustomID)
                        var detail = {
                            price: bill[i].price,
                            bookedDate: bill[i].bookedDate,
                            tourName: tourCustom.tourName,
                            startDate: tourCustom.startDate,
                            userID: user.userName,
                            _id: bill[i]._id
                        }
                        listCustomDetail.push(detail)
                    }
                }
            }
            return listCustomDetail.push(detail)
        }
        await Promise.all(listTour.map(e => getBill(e)), listTourCustom.map(t => getCustomBill(t)))
        return res.status(200).send({
            errorCode: 0,
            data: {
                listDetail,
                listCustomDetail,
            }
        })
    }
    catch (err) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Bill tour server is error!'
        })
    }
}


//TOUR CUSTOM
exports.addTourCustom = async (req, res) => {
    try {
        if (req.files) {
            let path = ''
            req.files.forEach(files => {
                path = path + files.path + ','
            });
            path = path.substring(0, path.lastIndexOf(','))
            req.body.picture = path
        } else {
            return res.status(400).send({
                errorCode: 400,
                message: 'Picture must be add in here!'
            })
        }
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
            moderatorID: req.accountID,
            tourDraftID: req.params.tourDraftID
        })
        tour.save()
            .then(async () => {
                const tourDraft = await TourDraft.findById(req.params.tourDraftID)
                const user = await User.findById(tourDraft.userID)
                const link = `${process.env.BASE_URL}`
                await sendEmail(user.email, 'Your custom tour was created by moderator!', link)
                return res.status(200).send({
                    errorCode: 0,
                    message: 'upload successfully!'
                })
            })
            .catch(error => {
                console.log(error)
                return res.status(500).send({
                    errorCode: 500,
                    message: 'Save tour custom function is error!'
                })
            })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Save tour custom function is error!'
        })
    }

}

exports.viewListTourCustomToUser = async (req, res) => {
    TourDraftStatus.find({ moderatorID: req.accountID }, async (err, listTour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        if (!listTour) return res.status(200).send({
            errorCode: 0,
            message: 'There are no documents listed here'
        })
        var listShow = []
        for (i = 0; i < listTour.length; i++) {
            var tour = await TourDraft.findById(listTour[i].tourDraftID)
            if (!tour) return res.status(500).send({
                errorCode: 500,
                message: 'Custom tour has been removed to user or server-side error'
            })
            var show = {
                createdAt: listTour[i].createdAt,
                tourName: tour.tourName,
                address: tour.destination.address,
                startDate: tour.startDate,
                numberOfPeople: tour.numberOfPeople,
                _id: tour._id,
            }
            listShow.push(show)
        }
        return res.status(200).send({
            errorCode: 0,
            data: listShow
        })
    })
}

exports.viewAndAddTourCustom = (req, res) => {
    TourDraft.findById({ _id: req.params.tourDraftID }, (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Tour draft server is error!'
        })
        if (!tour) return res.status(400).send({
            errorCode: 400,
            message: 'The tour has been deleted by the user, please try again!'
        })
        return res.status(200).send({
            errorCode: 0,
            data: tour
        })
    })
}

exports.viewListCustomTour = (req, res) => {
    TourCustom.find({ moderatorID: req.accountID }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        if (!list) return res.status(400).send({
            errorCode: 400,
            message: 'There are no documents listed here'
        })
        var show = []
        list.forEach(e => {
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

exports.viewDetailCustomTour = (req, res) => {
    TourCustom.findOne({ slug: req.params.slug, moderatorID: req.accountID }, (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Detail tour custom function is error!'
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


//ads
exports.paymentAdsTour = async (req, res) => {
    try {
        const ads = await Ads.findOne({})
        const paypalInfo = await PaypalInfo.findOne({ moderatorID: req.accountID }) //'622dbfb2fcdc11b7a3fcd5af'  
        if (paypalInfo === null) {
            return res.status(400).send({
                errorCode: 400,
                message: 'The manager of the tour you booked does not have an online payment method'
            })
        }

        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': paypalInfo.clientID,
            'client_secret': paypalInfo.secret
        });
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:4000/moderator/tour/success-ads-tour/${req.query.tourID}`,
                "cancel_url": "http://localhost:4000/moderator/tour/cancel-ads-tour"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `Payment ads`,
                        //"sku": "001",
                        "price": `${ads.price}`,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": `${ads.price}`
                },
                "description": "Ads payment"
            }]
        };


        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                return res.status(500).send({
                    errorCode: 500,
                    message: error.response
                })
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        //res.redirect(payment.links[i].href);
                        return res.status(200).send({
                            errorCode: 0,
                            data: payment.links[i].href
                        })
                    }
                }

            }
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Payment function is error!'
        })
    }

}

exports.successAdsTour = async (req, res) => {
    try {
        const ads = await Ads.findOne({})
        const paypalInfo = await PaypalInfo.findOne({ moderatorID: req.accountID }) //'622dbfb2fcdc11b7a3fcd5af'
        if (paypalInfo === null) {
            return res.status(400).send({
                errorCode: 400,
                message: 'The manager of the tour you booked does not have an online payment method'
            })
        }

        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': paypalInfo.clientID,
            'client_secret': paypalInfo.secret
        });

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": `${ads.price}`
                }
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                return res.status(500).send({
                    errorCode: 500,
                    message: error.response
                })
            } else {
                const tourAds = new TourAds({
                    tourID: req.params.tourID
                })
                tourAds.save()
                    .then(() => {
                        return res.status(200).send({
                            errorCode: 0,
                            message: 'save booked tour custom successfully'
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Payment function is error!'
        })
    }
}

exports.cancelAdsTour = (req, res) => {
    return res.status(200).send({
        errorCode: 0,
        message: 'Cancel payment ads tour successfully!'
    })
}

// exports.listAdsTour = (req,res) =>{
//     Tour.find({moderatorID: req.accountID}, (err, list) =>{
//         if(err) return res.status(500).send({
//             errorCode: 500,
//             message: err
//         })

//     })
// } ////// not done