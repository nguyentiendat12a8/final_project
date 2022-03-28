const paypal = require('paypal-rest-sdk')
const db = require('../../models/index')
const Tour = db.tour
const Rate = db.rateTour
const Moderator = db.moderator
const BillTour = db.billTour
const User = db.user
const Category = db.categoryTour
const PaypalInfo = db.paypalInfo


exports.listTour = (req, res, next) => {
    Tour.find({}, (err, list) => { // theem dieu kien , private: false
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
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
    Tour.findOne({ slug: req.query.slug}, async (err, tour) => { //them dieu kien , private: false
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
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
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }

        }
    });
}

exports.success = async (req, res, next) => {
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
            console.log(error.response);
            throw error;
        } else {
            const billTour = new BillTour({
                userID: req.accountID, //req.userId
                tourID: req.params.tourID, //req.params.tourId
                bookedDate: Date.now()
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
    });
}

exports.cancel = (req, res) => {
    res.send('Cancelled (Đơn hàng đã hủy)')
    return
}
// need update
exports.listBillTour = (req, res, next) => {
    BillTour.find({ userID: req.accountID}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var tour = await Tour.findById(list[i].tourID)
            if (!tour) return res.status(500).send({
                errorCode: 500,
                message: 'Bill tour is error'
            })
            var detail = {
                bookedDate: list[i].bookedDate,
                tourName: tour.tourName,
                startDate: tour.startDate,
                _id: list[i]._id
            }
            show.push(detail)
        }

        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.detailBillTour = (req, res, next) => {
    BillTour.findOne({ _id: req.params.billTourID, userID: req.accountID}, async (err, billTour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var tour = await Tour.findById(billTour.tourID)
                if (!tour) return res.status(500).send({
                    errorCode: 500,
                    message: 'Bill tour is error'
                })
                const moderator = await Moderator.findById(tour.moderatorID)
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

        return res.status(200).send({
            errorCode: 0,
            data: detail
        })
    })
}


//rate tour
//cần check time rate -- qua ngày xuất phát mới được rate
//cần check người này đã từng đánh giá trước đó hay chưa, nếu rồi thì sẽ update rate mới.






// paypal.configure({
//     'mode': 'sandbox', //sandbox or live
//     'client_id': 'ARkQd3S2gMmWjLlh-qL3RezQieuKnvp82VNjBTGhyByjFxelP-rz7RMjl8f_Kf2EuGM-NOr7i_I0BjfE',
//     'client_secret': 'EAif1EqBp_b7lwx0bpGB5lJkXxSUaMP7vWQyNTnNBVO_dOLQ7h15Sr1kYwAcbKd7caEEGa0dDHhIpSMa'
// });
// //book tour la chuc nang cua user
