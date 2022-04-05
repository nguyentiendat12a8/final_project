const db = require('../../models/index')
const HotelRoom = db.hotelRoom
const BillHotelRoom = db.billHotelRoom
const User = db.user
const Ads = db.ads
const RoomAds = db.roomAds
const PaypalInfo = db.paypalInfo
const paypal = require('paypal-rest-sdk')

exports.addHotelRoom = (req, res) => {
    if (req.files) {
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.photo = path
    } else {
        req.body.photo = 'No photo'
    }
    const room = new HotelRoom({
        roomName: req.body.roomName,
        price: req.body.price,
        bedroom: {
            singleBed: req.body.singleBed,
            doubleBed: req.body.doubleBed,
            queenSizeBed: req.body.queenSizeBed,
            kingSizeBed: req.body.kingSizeBed,
        },
        utilities: {
            parking: req.body.parking,
            wifi: req.body.wifi,
            pool: req.body.pool,
            smoking: req.body.smoking,
            TV: req.body.TV,
            kitchen: req.body.kitchen,
            bathtub: req.body.bathtub,
        },
        photo: req.body.photo,
        acreage: req.body.acreage,
        description: req.body.description,
        address: req.body.address,
        moderatorID: req.accountID
    })
    room.save(err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Add hotel room successfully!'
        })
    })
}

exports.editHotelRoom = (req, res) => {
    HotelRoom.findOne({ slug: req.params.slug, moderatorID: req.accountID}, async (err, room) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if (room == null) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Invalid link'
            })
        }
        const hotelRoomDetail = {
            price: room.startDate,
            bedroom: {
                singleBed: room.bedroom.singleBed,
                doubleBed: room.bedroom.doubleBed,
                queenSizeBed: room.bedroom.queenSizeBed,
                kingSizeBed: room.bedroom.kingSizeBed,
            },
            utilities: {
                parking: room.utilities.parking,
                wifi: room.utilities.wifi,
                pool: room.utilities.pool,
                smoking: room.utilities.smoking,
                TV: room.utilities.TV,
                kitchen: room.utilities.kitchen,
                bathtub: room.utilities.bathtub,
            },
            photo: room.photo,
            description: room.description,
            slug: room.slug
        }
        return res.status(200).send({
            errorCode: 0,
            data: hotelRoomDetail
        })
    })
}

exports.updateHotelRoom = (req, res) => {
    if (req.files) {
        let path = ''
        req.files.forEach((files, index, arr) => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.photo = path
    } else {
        req.body.photo = 'No photo'
    }
    HotelRoom.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID}, {
        price: req.body.price,
        bedroom: {
            singleBed: req.body.singleBed,
            doubleBed: req.body.doubleBed,
            queenSizeBed: req.body.queenSizeBed,
            kingSizeBed: req.body.kingSizeBed,
        },
        utilities: {
            parking: req.body.parking,
            wifi: req.body.wifi,
            pool: req.body.pool,
            smoking: req.body.smoking,
            TV: req.body.TV,
            kitchen: req.body.kitchen,
            bathtub: req.body.bathtub,
        },
        photo: req.body.photo,
        description: req.body.description,
    }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Update hotel room successfully!'
        })
    })
}

exports.listHotelRoom = (req, res) => {
    HotelRoom.find({ moderatorID: req.accountID}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var listDetail = []
        list.forEach(e => {
            var detail = {
                roomName: e.roomName,
                price: e.price,
                photo: e.photo,
                acreage: e.acreage,
                address: e.address,
                slug: e.slug
            }
            listDetail.push(detail)
        })
        return res.status(200).send({
            errorCode: 0,
            data: listDetail,
        })
    })
}

exports.detailHotelRoom = (req, res) => {
    HotelRoom.findOne({ slug: req.params.slug, moderatorID: req.accountID}, (err, post) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: post
        })
    })
}

exports.listBillHotelRoom = (req, res) => {
    try {
        HotelRoom.find({ moderatorID: req.accountID }, (err, listHotelRoom) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            let listBill = []
            let listDetail = []
            listHotelRoom.forEach(async e => {
                BillHotelRoom.find({ hotelRoomID: e._id }, (err, bill) => {
                    if (err) return res.status(500).send({
                        errorCode: 500,
                        message: err
                    })

                    listBill.push(bill)
                })
            })
            listBill.forEach(async e => {
                var user = await User.findById(e.userID)
                var room = await HotelRoom.findById(e.hotelRoomID)
                var detail = {
                    checkIn: e.checkIn,
                    checkOut: checkOut,
                    bookedDate: e.createdAt,
                    HotelRoomName: room.roomName,
                    userID: user.userName
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

//search, filter

exports.searchHotelRoom = async (req, res) => {
    HotelRoom.find({ moderatorID: req.accountID}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var search = req.query.address
        var dataSearch = list.filter(r => r.address.toLowerCase().includes(search.toLowerCase()))
        var show = []
        dataSearch.forEach(e => {
            var room = {
                roomName: e.roomName,
                price: e.price,
                photo: e.photo,
                acreage: e.acreage,
                address: e.address,
                slug: e.slug
            }
            show.push(room)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show,
        })
    })
}

exports.filterHotelRoom = async (req, res) => {
    HotelRoom.find({ moderatorID: req.accountID}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if (req.query.filter === 'ASC') {
            var dataSort = list.sort((a, b) => a.price - b.price)
            var show = []
            dataSort.forEach(e => {
                var tour = {
                    roomName: e.roomName,
                    price: e.price,
                    photo: e.photo,
                    acreage: e.acreage,
                    address: e.address,
                    slug: e.slug
                }
                show.push(tour)
            })
            return res.status(200).send({
                errorCode: 0,
                data: show,
            })
        } else if (req.query.filter === 'DES') {
            var dataSort = list.sort((a, b) => b.price - a.price)
            var show = []
            dataSort.forEach(e => {
                var tour = {
                    roomName: e.roomName,
                    price: e.price,
                    photo: e.photo,
                    address: e.address,
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


//ads 
exports.paymentAdsHotelRoom = async (req,res) =>{
    const ads = await Ads.findOne({})
    const paypalInfo = await PaypalInfo.findOne({ moderatorID: req.accountID }) // '622dbfb2fcdc11b7a3fcd5af'
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
            "return_url": `http://localhost:4000/moderator/hotel/success-ads-hotel-room/${req.params.hotelRoomID}`,//
            "cancel_url": "http://localhost:4000/moderator/hotel/cancel-ads-hotel-room"
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

exports.successAdsHotelRoom = async (req,res) =>{
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
            console.log(error.response);
            throw error;
        } else {
            const roomAds = new RoomAds({
                hotelRoomID: req.params.hotelRoomID
            })
            roomAds.save()
                .then(() => {
                    return res.status(200).send({
                        errorCode: 0,
                        message: 'save booked ads hotel successfully'
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    });
}

exports.cancelAdsHotelRoom = (req,res) =>{
    res.send('Cancelled (Đơn hàng đã hủy)')
    return
}
