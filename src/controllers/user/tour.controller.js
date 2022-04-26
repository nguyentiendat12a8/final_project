const paypal = require('paypal-rest-sdk')
const db = require('../../models/index')
const sendEmail = require('../../util/sendEmail')
const Tour = db.tour
const Rate = db.rateTour
const Moderator = db.moderator
const BillTour = db.billTour
const User = db.user
const Category = db.categoryTour
const PaypalInfo = db.paypalInfo
const RateTour = db.rateTour
const TourDraft = db.tourDraft
const TourDraftStatus = db.tourDraftStatus
const TourCustom = db.tourCustom

exports.listTour = (req, res, next) => {
    Tour.find({ private: false }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        list.forEach(async e => {
            var tour = {
                tourName: e.tourName,
                picture: e.picture,
                startDate: e.startDate,
                time: e.time,
                price: e.price,
                address: e.address,
                startingPoint: e.startingPoint,
                numberOfRate: e.rate.numberOfRate,
                numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
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

exports.detailTour = (req, res, next) => {
    Tour.findOne({ slug: req.query.slug }, async (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Detail tour function is error!'
        })
        if (tour === null) res.status(400).send({
            errorCode: 400,
            message: 'invalid link!'
        })
        const mod = await Moderator.findById(tour.moderatorID)
        if (mod === null) return res.status(400).send({
            errorCode: 400,
            message: 'Tour is error'
        })
        const category = await Category.findById(tour.categoryTourID)
        if (category === null) return res.status(400).send({
            errorCode: 400,
            message: 'Category is error'
        })
        var tour = {
            tourName: tour.tourName,
            startDate: tour.startDate,
            price: tour.price,
            picture: tour.picture,
            time: tour.time,
            address: tour.address,
            startingPoint: tour.startingPoint,
            hotel: tour.hotel,
            numberOfRate: tour.rate.numberOfRate,
            numberOfStar: tour.rate.numberOfStar,
            description: {
                content: tour.description.content,
                vehicle: tour.description.vehicle,
                timeDecription: tour.description.timeDecription,
            },
            categoryName: category.categoryName,
            createdAt: tour.createdAt,
            modName: mod.modName,
            avatar: mod.avatar,
            email: mod.email,
            slug: tour.slug
        }
        return res.status(200).send({
            errorCode: 0,
            data: tour
        })
    })
}

exports.paymentTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.tourID)
        const paypalInfo = await PaypalInfo.findOne({ moderatorID: tour._id })
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
                "return_url": `http://localhost:4000/user/tour/success/${req.params.tourID}`,
                "cancel_url": "http://localhost:4000/user/tour/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `Tour: ${tour.tourName}`,
                        //"sku": "001",
                        "price": `${tour.price}`,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": `${tour.price}`
                },
                "description": "book tour tien loi"
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

exports.success = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.slug)
        const paypalInfo = await PaypalInfo.findOne({ moderatorID: tour.moderatorID })
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
                    "total": `${tour.price}`
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
                const billTour = new BillTour({
                    price: tour.price,
                    userID: req.accountID, //req.userId
                    tourID: req.params.tourID, //req.params.tourId
                    //bookedDate: Date.now()
                })
                billTour.save()
                    .then(() => {
                        return res.status(200).send({
                            errorCode: 0,
                            message: 'save booked tour successfully'
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

exports.cancel = (req, res) => {
    return res.status(200).send({
        errorCode: 0,
        message: 'Cancel payment tour successfully!'
    })
}

exports.listBillTour = (req, res, next) => {
    BillTour.find({ userID: req.accountID }, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var tour = await Tour.findById(list[i].tourID)
            var tourCustom = await TourCustom.findById(list[i].tourCustomID)
            if (tour) {
                var detail = {
                    price: list[i].price,
                    bookedDate: list[i].bookedDate,
                    tourName: tour.tourName,
                    startDate: tour.startDate,
                    _id: list[i]._id
                }
                show.push(detail)
            } else {
                var detail = {
                    price: list[i].price,
                    bookedDate: list[i].bookedDate,
                    tourName: tourCustom.tourName,
                    startDate: tourCustom.startDate,
                    _id: list[i]._id
                }
                show.push(detail)
            }
        }
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.detailBillTour = (req, res, next) => {
    BillTour.findOne({ _id: req.params.billTourID, userID: req.accountID }, async (err, billTour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Detail bill tour function is error!'
        })
        var tour = await Tour.findById(billTour.tourID)
        var tourCustom = await TourCustom.findById(billTour.tourCustomID)
        const moderator = await Moderator.findById(tour.moderatorID)
        if (tour) {
            var detail = {
                bookedDate: billTour.bookedDate,
                tourName: tour.tourName,
                startDate: tour.startDate,
                price: tour.price,
                picture: tour.picture,
                time: tour.time,
                address: tour.address,
                startingPoint: tour.startingPoint,
                description: {
                    content: tour.description.content,
                    vehicle: tour.description.vehicle,
                    timeDecription: tour.description.timeDecription
                },
                rate: {
                    numberOfStar: tour.rate.numberOfStar,
                    numberOfRate: tour.rate.numberOfRate
                },
                hotel: tour.hotel,
                moderatorName: moderator.modName,
                moderatorEmail: moderator.email,
                moderatorPhone: moderator.phone
            }
        } else {
            var detail = {
                bookedDate: billTour.bookedDate,
                tourName: tourCustom.tourName,
                startDate: tourCustom.startDate,
                price: tourCustom.price,
                picture: tourCustom.picture,
                time: tourCustom.time,
                address: tourCustom.address,
                startingPoint: tourCustom.startingPoint,
                description: {
                    content: tourCustom.description.content,
                    vehicle: tourCustom.description.vehicle,
                    timeDecription: tourCustom.description.timeDecription
                },
                hotel: tourCustom.hotel,
                moderatorName: moderator.modName,
                moderatorEmail: moderator.email,
                moderatorPhone: moderator.phone
            }
        }

        return res.status(200).send({
            errorCode: 0,
            data: detail
        })
    })
}


//rate tour
exports.rateTour = (req, res) => {
    BillTour.findById(req.params.billTourID, (err, bill) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Bill tour server is error!'
        })
        const rate = new RateTour({
            point: req.body.point,
            comment: req.body.comment,
            userID: req.accountID,
            tourID: bill.tourID,
            billTourID: bill._id
        })
        rate.save(async err => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: 'Rate server is error!'
            })
            var sum = 0
            var point = await RateTour.find({ tourID: bill.tourID })
            for (i = 0; i < point.length; i++) {
                sum += point[i].point
            }
            await Tour.findByIdAndUpdate(bill.tourID, {
                rate: {
                    numberOfStar: sum / point.length,
                    numberOfRate: point.length
                }
            }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'Rating tour successfully!'
            })
        })
    })
}

exports.viewRateTour = (req, res) => {
    Rate.find({ tourID: req.params.tourID }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var rate = {
                point: list[i].point,
                comment: list[i].comment,
                createdAt: list[i].createdAt
            }
            show.push(rate)
        }
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

//Tour custom
exports.addTourDraft = async (req, res) => {
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
        const tourDraft = new TourDraft({
            tourName: req.body.tourName,
            destination: {
                address: req.body.address,
                mainActivities: req.body.mainActivities
            },
            startingPoint: req.body.startingPoint,
            picture: req.body.picture,
            vehicle: req.body.vehicle,
            startDate: req.body.startDate,
            time: req.body.time,
            hotel: req.body.hotel,
            //private: req.body.private,
            numberOfPeople: req.body.numberOfPeople,
            information: req.body.information,

            userID: req.accountID,
        })
        tourDraft.save(err => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: 'Add tour draft function is error!'
            })
            return res.status(200).send({
                errorCode: 0,
                message: 'Tour draft add successfully!'
            })
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Add tour draft function is error!'
        })
    }
}

exports.listOrganization = (req, res) => {
    Moderator.find({ tourCustomStatus: true }, (err, list) => {
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
            var mod = {
                tourDraftID: req.params.tourDraftID,
                organizationName: e.organizationName,
                //phone: e.phone,
                email: e.email,
                _id: e._id
            }
            show.push(mod)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.sendTourDraft = async (req, res) => {
    try {
        const check = await TourDraftStatus.findOne({ userID: req.accountID })
        if (check) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Time to send the next custom versions is 2 days!'
            })
        }
        const send = new TourDraftStatus({
            userID: req.accountID,
            tourDraftID: req.params.tourDraftID,
            moderatorID: req.params.moderatorID
        })
        await Promise.all([send.save(), Moderator.findById(req.params.moderatorID)])
            .then(async ([send, moderator]) => {
                var email = moderator.email
                var view = `${process.env.BASE_URL}`
                await sendEmail(email, "Have new custom tour sent to you", view)
                return res.status(200).send({
                    errorCode: 0,
                    message: 'send draft tour to moderator successfully!'
                })
            })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Send tour draft function is error!'
        })
    }
}

exports.viewTourDraft = (req, res) => {
    TourDraft.find({ userID: req.accountID }, async (err, listTour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        // var check
        // const status = await TourDraftStatus.findOne({ tourDraftID: tour._id })
        // if (!status) check = 'Unsent'
        // else check = 'Sent'
        return res.status(200).send({
            errorCode: 0,
            data: listTour,
            //check
        })
    })
}

exports.viewTourDraftToMod = (req, res) => {
    TourCustom.findOne({ tourDraftID: req.params.tourDraftID }, async (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'View tour custom function is error!'
        })
        if (!tour) return res.status(400).send({
            errorCode: 400,
            message: 'The tour has not been created from a moderator or the link is not valid'
        })
        const mod = await Moderator.findById(tour.moderatorID)
        if (!mod) return res.status(400).send({
            errorCode: 400,
            message: 'Tour is error'
        })
        var show = {
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
            createdAt: tour.createdAt,
            modName: mod.modName,
            avatar: mod.avatar,
            email: mod.email,
            slug: tour.slug
        }
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.paymentTourCustom = async (req, res) => {
    try {
        const tour = await TourCustom.findById(req.query.tourCustomID)
        const paypalInfo = await PaypalInfo.findOne({ moderatorID: tour.moderatorID })
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
                "return_url": `http://localhost:4000/user/tour/successPayCustom/${req.query.tourCustomID}`,
                "cancel_url": "http://localhost:4000/user/tour/cancelPayCustom"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `Tour: ${tour.tourName}`,
                        //"sku": "001",
                        "price": `${tour.price}`,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": `${tour.price}`
                },
                "description": "book tour tien loi"
            }]
        }


        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                return res.status(500).send({
                    errorCode: 500,
                    message: error
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

exports.successPayCustom = async (req, res, next) => {
    try {
        const tour = await TourCustom.findById(req.params.tourCustomID)
        const paypalInfo = await PaypalInfo.findOne({ moderatorID: tour.moderatorID })
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
        })

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": `${tour.price}`
                }
            }]
        }
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                return res.status(500).send({
                    errorCode: 500,
                    message: error.response
                })
            } else {
                const billTour = new BillTour({
                    price: tour.price,
                    userID: req.accountID, //'622daaa81d06d9205fab2525'
                    tourCustomID: req.params.tourCustomID, //req.params.tourId
                    //bookedDate: Date.now()
                })
                billTour.save()
                    .then(() => {
                        return res.status(200).send({
                            errorCode: 0,
                            message: 'save booked tour custom successfully!'
                        })
                    })
                    .catch(err => {
                        return res.status(500).send({
                            errorCode: 500,
                            message: 'Bill tour server is error!'
                        })
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

exports.cancelPayCustom = (req, res) => {
    return res.status(200).send({
        errorCode: 0,
        message: 'Cancel payment tour successfully!'
    })
}


//filter
exports.searchTour = (req, res) => {
    Tour.find({}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        const search = req.query.address
        var dataSearch = list.filter(e => e.address.toLowerCase().includes(search.toLowerCase()))
        if (!dataSearch) {
            return res.status(200).send({
                errorCode: 0,
                data: ''
            })
        }
        var show = []
        dataSearch.forEach(async e => {
            var tour = {
                tourName: e.tourName,
                picture: e.picture,
                startDate: e.startDate,
                time: e.time,
                price: e.price,
                address: e.address,
                startingPoint: e.startingPoint,
                numberOfRate: e.rate.numberOfRate,
                numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
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

exports.filterTour = async (req, res) => {
    try {
        const categoryName = req.query.categoryName
        var star = req.query.star
        const filterPrice = req.query.filterPrice
        if (categoryName && !star && !filterPrice) {
            const category = await Category.findOne({ categoryName: req.query.categoryName })
            if (!category) return res.status(500).send({
                errorCode: 500,
                message: 'Category server is error!'
            })
            const list = await Tour.find({ categoryTourID: category._id })
            if (!list) return res.status(500).send({
                errorCode: 500,
                message: 'Tour server is error!'
            })
            var show = []
            list.forEach(async e => {
                var tour = {
                    tourName: e.tourName,
                    picture: e.picture,
                    startDate: e.startDate,
                    time: e.time,
                    price: e.price,
                    address: e.address,
                    startingPoint: e.startingPoint,
                    numberOfRate: e.rate.numberOfRate,
                    numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
                    slug: e.slug
                }
                show.push(tour)
            })
            return res.status(200).send({
                errorCode: 0,
                data: show
            })

        } else if (categoryName && star && !filterPrice) {
            const category = await Category.findOne({ categoryName: req.query.categoryName })
            if (!category) return res.status(500).send({
                errorCode: 500,
                message: 'Category server is error!'
            })

            const list = await Tour.find({ categoryTourID: category._id })
            if (!list) return res.status(500).send({
                errorCode: 500,
                message: 'Tour server is error!'
            })
            var show = []
            list.forEach(e => {
                if (e.rate.numberOfStar >= star && e.rate.numberOfStar < (parseInt(star) + 1)) {
                    var tour = {
                        tourName: e.tourName,
                        picture: e.picture,
                        startDate: e.startDate,
                        time: e.time,
                        price: e.price,
                        address: e.address,
                        startingPoint: e.startingPoint,
                        numberOfRate: e.rate.numberOfRate,
                        numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
                        slug: e.slug
                    }
                    show.push(tour)
                }
            })

            return res.status(200).send({
                errorCode: 0,
                data: show
            })

        } else if (categoryName && star && filterPrice) {
            const category = await Category.findOne({ categoryName: req.query.categoryName })
            if (!category) return res.status(500).send({
                errorCode: 500,
                message: 'Category server is error!'
            })

            const list = await Tour.find({ categoryTourID: category._id })
            if (!list) return res.status(500).send({
                errorCode: 500,
                message: 'Tour server is error!'
            })
            if (filterPrice === 'ASC') {
                list.sort((a, b) => {
                    return a.price - b.price
                })
            } else {
                list.sort((a, b) => {
                    return b.price - a.price
                })
            }
            var show = []
            list.forEach(e => {
                if (e.rate.numberOfStar >= star && e.rate.numberOfStar < (parseInt(star) + 1)) {
                    var tour = {
                        tourName: e.tourName,
                        picture: e.picture,
                        startDate: e.startDate,
                        time: e.time,
                        price: e.price,
                        address: e.address,
                        startingPoint: e.startingPoint,
                        numberOfRate: e.rate.numberOfRate,
                        numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
                        slug: e.slug
                    }
                    show.push(tour)
                }
            })

            return res.status(200).send({
                errorCode: 0,
                data: show
            })
        } else if (!categoryName && star && !filterPrice) {
            const list = await Tour.find({})
            if (!list) return res.status(500).send({
                errorCode: 500,
                message: 'Tour server is error!'
            })

            var show = []
            list.forEach(e => {
                if (e.rate.numberOfStar >= star && e.rate.numberOfStar < (parseInt(star) + 1)) {
                    var tour = {
                        tourName: e.tourName,
                        picture: e.picture,
                        startDate: e.startDate,
                        time: e.time,
                        price: e.price,
                        address: e.address,
                        startingPoint: e.startingPoint,
                        numberOfRate: e.rate.numberOfRate,
                        numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
                        slug: e.slug
                    }
                    show.push(tour)
                }
            })

            return res.status(200).send({
                errorCode: 0,
                data: show
            })
        } else if (!categoryName && star && filterPrice) {
            const list = await Tour.find({})
            if (!list) return res.status(500).send({
                errorCode: 500,
                message: 'Tour server is error!'
            })
            if (filterPrice === 'ASC') {
                list.sort((a, b) => {
                    return a.price - b.price
                })
            } else {
                list.sort((a, b) => {
                    return b.price - a.price
                })
            }
            var show = []
            list.forEach(e => {
                if (e.rate.numberOfStar >= star && e.rate.numberOfStar < (parseInt(star) + 1)) {
                    var tour = {
                        tourName: e.tourName,
                        picture: e.picture,
                        startDate: e.startDate,
                        time: e.time,
                        price: e.price,
                        address: e.address,
                        startingPoint: e.startingPoint,
                        numberOfRate: e.rate.numberOfRate,
                        numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
                        slug: e.slug
                    }
                    show.push(tour)
                }
            })

            return res.status(200).send({
                errorCode: 0,
                data: show
            })
        } else if (!categoryName && !star && filterPrice) {
            const list = await Tour.find({})
            if (!list) return res.status(500).send({
                errorCode: 500,
                message: 'Tour server is error!'
            })
            if (filterPrice === 'ASC') {
                list.sort((a, b) => {
                    return a.price - b.price
                })
            } else {
                list.sort((a, b) => {
                    return b.price - a.price
                })
            }
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
                    numberOfRate: e.rate.numberOfRate,
                    numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
                    slug: e.slug
                }
                show.push(tour)
            })

            return res.status(200).send({
                errorCode: 0,
                data: show
            })
        }
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Filter tour function is error!'
        })
    }
}

//vnpay
exports.vnpay =  (req, res, next) => {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    //var config = require('config');
    var dateFormat = require('dateformat');

    
    var tmnCode = 'F9W7GBPW'
    var secretKey = 'OFNLGUWGVTLGJTSBRAMUWZQQNLYDYSDF'
    var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    var returnUrl = 'http://localhost:4000/user/tour/vnpay_return'

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl)
}
// Vui lòng tham khảo thêm tại code demo


exports.vnpayIpn = (req, res, next) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    //var config = require('config');
    var secretKey = 'OFNLGUWGVTLGJTSBRAMUWZQQNLYDYSDF'
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
     

    if(secureHash === signed){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({RspCode: '00', Message: 'success'})
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
}

 
exports.vnpayReturn =  (req, res, next) => {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    //var config = require('config');
    var tmnCode = 'F9W7GBPW'
    var secretKey = 'OFNLGUWGVTLGJTSBRAMUWZQQNLYDYSDF'

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('success', {code: vnp_Params['vnp_ResponseCode']})
    } else{
        res.render('success', {code: '97'})
    }
}