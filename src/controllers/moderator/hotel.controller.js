const db = require('../../models/index')
const HotelRoom = db.hotelRoom
const BillHotelRoom = db.billHotelRoom
const User = db.user
const Ads = db.ads
const RoomAds = db.roomAds
const PaypalInfo = db.paypalInfo
const paypal = require('paypal-rest-sdk')

exports.addHotelRoom = (req, res) => {
    try {
        if (req.files) {
            let path = ''
            req.files.forEach((files, index, arr) => {
                path = path + files.path + ','
            });
            path = path.substring(0, path.lastIndexOf(','))
            req.body.photo = path
        } else {
            return res.status(400).send({
                errorCode: 400,
                message: 'Picture must be add in here!'
            })
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
    } catch (error) {
        return res.status(500).json({
            errorCode: 500,
            message: 'Add hotel function is error!',
        })
    }
}

exports.editHotelRoom = (req, res) => {
    HotelRoom.findOne({ slug: req.params.slug, moderatorID: req.accountID }, async (err, room) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Hotel server is error!'
        })
        if (room == null) {
            return res.status(400).send({
                errorCode: 400,
                message: 'Invalid link'
            })
        }
        const hotelRoomDetail = {
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
            description: room.description,
            private: room.private,
            slug: room.slug
        }
        return res.status(200).send({
            errorCode: 0,
            data: hotelRoomDetail
        })
    })
}

exports.updateHotelRoom = (req, res) => {
    HotelRoom.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID }, {
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
        description: req.body.description,
        private: req.body.private,
    }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Update hotel room successfully!'
        })
    })
}

exports.listHotelRoom = (req, res) => {
    HotelRoom.find({ moderatorID: req.accountID }, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var listDetail = []
        async function getDetail(e) {
            var ads = await RoomAds.findOne({ hotelRoomID: e._id })
            if (ads) {
                var detail = {
                    roomName: e.roomName,
                    price: e.price,
                    photo: e.photo,
                    private: e.private,
                    timeEnd: new Date(ads.timeEnd.setDate(ads.timeEnd.getDate() + 7)),
                    //acreage: e.acreage,
                    //address: e.address,
                    slug: e.slug
                }
                return listDetail.push(detail)
            } else {
                var detail = {
                    roomName: e.roomName,
                    price: e.price,
                    photo: e.photo,
                    private: e.private,
                    timeEnd: 'null',
                    //acreage: e.acreage,
                    //address: e.address,
                    slug: e.slug
                }
                return listDetail.push(detail)
            }
        }

        await Promise.all(list.map(e => getDetail(e)))
        return res.status(200).send({
            errorCode: 0,
            data: listDetail,
        })
    })
}

exports.detailHotelRoom = (req, res) => {
    HotelRoom.findOne({ slug: req.params.slug, moderatorID: req.accountID }, (err, post) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Hotel server is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            data: post
        })
    })
}

exports.listBillHotelRoom = (req, res) => {
    try {
        HotelRoom.find({ moderatorID: req.accountID }, async (err, listHotelRoom) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err.message
            })
            var listDetail = []
            async function getBill(e) {
                var bill = await BillHotelRoom.find({ hotelRoomID: e._id })
                if (bill) {
                    for (i = 0; i < bill.length; i++) {
                        var user = await User.findById(bill[i].userID)
                        var room = await HotelRoom.findById(bill[i].hotelRoomID)
                        var detail = {
                            price: bill[i].price,
                            checkIn: bill[i].checkIn,
                            checkOut: bill[i].checkOut,
                            bookedDate: bill[i].createdAt,
                            hotelRoomName: room.roomName,
                            userID: user.userName
                        }
                        listDetail.push(detail)
                    }
                }
            }
            await Promise.all(listHotelRoom.map(e => getBill(e)))
            return res.status(200).send({
                errorCode: 0,
                data: listDetail
            })
        })
    }
    catch (err) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Bill hotel server is error!'
        })
    }
}

//search, filter

exports.searchHotelRoom = async (req, res) => {
    HotelRoom.find({ moderatorID: req.accountID }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
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
    HotelRoom.find({ moderatorID: req.accountID }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
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
exports.paymentAdsHotelRoom = async (req, res) => {
    try {
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
                "return_url": `http://localhost:4000/moderator/hotel/success-ads-hotel-room/${req.query.hotelRoomID}`,//
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
        return res.status(500).json({
            errorCode: 500,
            message: 'Payment function is error!',
        })
    }

}

exports.successAdsHotelRoom = async (req, res) => {
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
        })
    } catch (error) {
        return res.status(500).json({
            errorCode: 500,
            message: 'Payment function is error!',
        })
    }
}

exports.cancelAdsHotelRoom = (req, res) => {
    return res.status(200).send({
        errorCode: 0,
        message: 'Cancel payment ads hotel successfully!'
    })
}
