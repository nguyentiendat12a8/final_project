const db = require('../../models/index')
const HotelRoom = db.hotelRoom
const BillHotelRoom = db.billHotelRoom
const paypal = require('paypal-rest-sdk')
const PaypalInfo = db.paypalInfo

exports.listHotelRoom = (req, res) => {
    HotelRoom.find({}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var listDetail = []
        list.forEach(e => {
            var numberOfPeople = e.bedroom.singleBed * 1 + e.bedroom.doubleBed * 2 + e.bedroom.queenSizeBed * 2 + e.bedroom.kingSizeBed * 2
            var detail = {
                roomName: e.roomName,
                price: e.price,
                photo: e.photo,
                acreage: e.acreage,
                address: e.address,
                bedroom: e.bedroom,
                numberOfPeople,
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
    HotelRoom.findById(req.params.slug, (err, room) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var numberOfPeople = room.bedroom.singleBed * 1 + room.bedroom.doubleBed * 2 + room.bedroom.queenSizeBed * 2 + room.bedroom.kingSizeBed * 2
        var roomDetail = {
            roomName: room.roomName ,
            price: room.price,
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
            acreage: room.acreage,
            description: room.description,
            address: room.address,
            createdAt: room.createdAt,
            numberOfPeople,
        }
        return res.status(200).send({
            errorCode: 0,
            data: roomDetail,
        })
    })
}

exports.bookHotel = (req, res) => {

}

exports.paymentHotelRoom = async (req, res) => {
    try {
        const room = await HotelRoom.findById('6235737a17ac4ec96eef2243')//req.params.hotelRoomID
        if (room === null) {
        return res.status(400).send({
            errorCode: 400,
            message: 'room err'
        })
    }
    const paypalInfo = await PaypalInfo.findOne({ moderatorID: room.moderatorID })//tour._id
    if (paypalInfo === null) {
        return res.status(400).send({
            errorCode: 400,
            message: 'The manager of the tour you booked does not have an online payment method'
        })
    }
    var quantity = req.query.numberOfDay // req.query.numberOfDay, 2
    var total = room.price * quantity
    //console.log(req.body.date1)

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
            "return_url": `http://localhost:4000/user/hotel/success/${req.params.hotelRoomID}`,
            "cancel_url": "http://localhost:4000/user/tour/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": `day(s): ${room.roomName}`,
                    //"sku": "001",
                    "price": `${room.price}`,
                    "currency": "USD",
                    "quantity":  `${quantity}`
                }]
            },
            "amount": {
                "currency": "USD",
                "total": `${total}`
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
    } catch (error) {
        console.log(error)
    }
    
}

exports.success = async (req, res, next) => {

    const room = await HotelRoom.findById('6235737a17ac4ec96eef2243')
    const paypalInfo = await PaypalInfo.findOne({ moderatorID: room.moderatorID })
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
    var quantity = req.body.numberOfDay // req.b
    var total = room.price * quantity

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": `${total}`
            }
        }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            const billRoom = new BillHotelRoom({
                checkIn: req.body.numberOfDay,
                checkOut: req.body.numberOfDay,
                userID: req.accountID, //req.userId
                tourID: '6235737a17ac4ec96eef2243', //req.params.tourId
                //bookedDate: Date.now()
            })
            billRoom.save()
                .then(() => {
                    return res.status(200).send({
                        errorCode: 0,
                        message: 'save booked hotel room successfully'
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


exports.listBillHotel = (req, res) => {
    BillHotelRoom.find({ userID: req.accountID}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var room = await HotelRoom.findById(list[i].hotelRoomID)
            if (!room) return res.status(500).send({
                errorCode: 500,
                message: 'Bill hotel is error'
            })
            var detail = {
                bookedDate: list[i].bookedDate,
                checkIn: list[i].checkIn,
                checkOut: list[i].checkOut,
                roomName: room.roomName,
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

exports.detailBillHotel = (req, res) => {

}

//filter
// tìm kiếm theo số lượng người đi