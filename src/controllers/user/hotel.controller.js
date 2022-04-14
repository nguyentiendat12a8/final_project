const db = require('../../models/index')
const HotelRoom = db.hotelRoom
const BillHotelRoom = db.billHotelRoom
const paypal = require('paypal-rest-sdk')
const PaypalInfo = db.paypalInfo
const Moderator = db.moderator

exports.listHotelRoom = (req, res) => {
    HotelRoom.find({ private: false }, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var listDetail = []
        list.forEach(e => {
            //var numberOfPeople = e.bedroom.singleBed * 1 + e.bedroom.doubleBed * 2 + e.bedroom.queenSizeBed * 2 + e.bedroom.kingSizeBed * 2
            var detail = {
                roomName: e.roomName,
                price: e.price,
                photo: e.photo,
                acreage: e.acreage,
                address: e.address,
                bedroom: e.bedroom,
                //numberOfPeople,
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
    HotelRoom.findOne({ slug: req.params.slug }, (err, room) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Detail room function is error!'
        })
        var numberOfPeople = room.bedroom.singleBed * 1 + room.bedroom.doubleBed * 2 + room.bedroom.queenSizeBed * 2 + room.bedroom.kingSizeBed * 2
        var roomDetail = {
            roomName: room.roomName,
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
            timeBooked: req.timeBooked
        })
    })
}

exports.paymentHotelRoom = async (req, res) => {
    try {
        const room = await HotelRoom.findById(req.query.hotelRoomID)//req.params.hotelRoomID
        if (room === null) {
            return res.status(400).send({
                errorCode: 400,
                message: 'room err'
            })
        }
        const paypalInfo = await PaypalInfo.findOne({ moderatorID: room.moderatorID })
        if (paypalInfo === null) {
            return res.status(400).send({
                errorCode: 400,
                message: 'The manager of the tour you booked does not have an online payment method'
            })
        }
        var checkIn = req.query.checkIn
        var checkOut = req.query.checkOut
        var quantity = new Date(new Date(checkOut) - new Date(checkIn)).getDate() - 1
        var total = room.price * quantity

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
                "return_url": `http://localhost:4000/user/hotel/success/${req.query.hotelRoomID}/${req.query.checkIn}/${req.query.checkOut}`,
                "cancel_url": "http://localhost:4000/user/tour/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": `day(s): ${room.roomName}`,
                        //"sku": "001",
                        "price": `${room.price}`,
                        "currency": "USD",
                        "quantity": `${quantity}`
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
        });
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Payment function is error!'
        })
    }

}

exports.successHotelRoom = async (req, res, next) => {
    try {
        const room = await HotelRoom.findById(req.params.hotelRoomID)
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
        var checkIn = req.params.checkIn
        var checkOut = req.params.checkOut
        var quantity = new Date(new Date(checkOut) - new Date(checkIn)).getDate() - 1
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
                return res.status(500).send({
                    errorCode: 500,
                    message: error.response
                })
            } else {
                const billRoom = new BillHotelRoom({
                    price: total,
                    checkIn,
                    checkOut,
                    userID: req.accountID,//'622daaa81d06d9205fab2525'
                    hotelRoomID: req.params.hotelRoomID,
                })
                billRoom.save()
                    .then(() => {
                        return res.status(200).send({
                            errorCode: 0,
                            message: 'save booked hotel room successfully'
                        })
                    })
                    .catch(err => {
                        return res.status(500).send({
                            errorCode: 500,
                            message: 'Bill room server is error!'
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

exports.cancelHotelRoom = (req, res) => {
    return res.status(200).send({
        errorCode: 0,
        message: 'Cancel payment hotel room successfully!'
    })
}

exports.listBillHotel = (req, res) => {
    BillHotelRoom.find({ userID: req.accountID }, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        var show = []
        for (i = 0; i < list.length; i++) {
            var room = await HotelRoom.findById(list[i].hotelRoomID)
            if (!room) return res.status(500).send({
                errorCode: 500,
                message: 'Bill hotel is error'
            })
            var detail = {
                price: list[i].price,
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
    BillHotelRoom.findOne({ _id: req.params.billHotelRoomID, userID: req.accountID }, async (err, billRoom) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Detail bill hotel function is error!'
        })
        var room = await HotelRoom.findById(billRoom.hotelRoomID)
        if (!room) return res.status(500).send({
            errorCode: 400,
            message: 'Invalid link!'
        })
        const moderator = await Moderator.findById(room.moderatorID)
        var detail = {
            checkIn: billRoom.checkIn,
            checkOut: billRoom.checkOut,
            bookedDate: billRoom.createdAt,
            roomName: room.roomName,
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

//filter
exports.filterHotelRoom = async (req, res) => {
    //address input condition is always present before input
    try {
        const address = req.query.address
        const checkIn = new Date(req.query.checkIn)
        const checkOut = new Date(req.query.checkOut)
        const numberOfPeople = req.query.numberOfPeople
        if (checkIn && checkOut && !numberOfPeople) {
            const listBill = await BillHotelRoom.find({})
            if (!listBill) {
                return res.status(500).send({
                    errorCode: 500,
                    message: 'Bill Hotel Room server is error!'
                })
            }
            var roomFromBill = []
            async function getRoomFromBill(room) {
                var roomBill = await HotelRoom.findOne({ _id: room.hotelRoomID, address })
                return roomFromBill.push(roomBill)
            }
            await Promise.all(listBill.map(room => getRoomFromBill(room)))

            var show = []
            var showFromBill = []

            const listRoom = await HotelRoom.find({ address })
            listRoom.forEach(e => {
                show.push(e._id)
            })
            //Processing to show rooms that have been booked do not coincide with the required date
            if (roomFromBill.includes(!null)) {
                roomFromBill.forEach(e => {
                    var formatCheckIn = new Date(e.checkIn)
                    var formatCheckOut = new Date(e.checkOut)
                    if (checkIn >= (formatCheckOut.setDate(formatCheckOut.getDate() + 1))) {
                        showFromBill.push(e.hotelRoomID)
                    } else if (checkOut <= (formatCheckIn.setDate(formatCheckIn.getDate() - 1))) {
                        showFromBill.push(e.hotelRoomID)
                    } else {
                        show.pop(e.hotelRoomID)
                    }
                })
            }
            var showAll = show + ',' + showFromBill
            var formatShowAll = new Object(showAll.split(','))
            let unique = formatShowAll.filter((v, i) => formatShowAll.indexOf(v) === i)
            var listDetail = []
            async function getRoom(id) {
                if (id === '') return
                var room = await HotelRoom.find({ _id: id })
                return listDetail.push(room)
            }
            await Promise.all(unique.map(id => getRoom(id)))
            return res.status(200).send({
                errorCode: 0,
                data: listDetail
            })
        } else if (checkIn && checkOut && numberOfPeople) {
            const listBill = await BillHotelRoom.find({})
            if (!listBill) {
                return res.status(500).send({
                    errorCode: 500,
                    message: 'Bill Hotel Room server is error!'
                })
            }
            var roomFromBill = []
            async function getRoomFromBill(room) {
                var roomBill = await HotelRoom.findOne({ _id: room.hotelRoomID, address })
                return roomFromBill.push(roomBill)
            }
            await Promise.all(listBill.map(room => getRoomFromBill(room)))

            var showList = []
            var showFromBill = []

            const listRoom = await HotelRoom.find({ address })
            listRoom.forEach(e => {
                showList.push(e._id)
            })
            //xử lý để show ra các room đã được book không trùng với ngày cần
            if (roomFromBill.includes(!null)) {
                roomFromBill.forEach(e => {
                    var formatCheckIn = new Date(e.checkIn)
                    var formatCheckOut = new Date(e.checkOut)
                    if (checkIn >= (formatCheckOut.setDate(formatCheckOut.getDate() + 1))) {
                        showFromBill.push(e.hotelRoomID)
                    } else if (checkOut <= (formatCheckIn.setDate(formatCheckIn.getDate() - 1))) {
                        showFromBill.push(e.hotelRoomID)
                    } else {
                        showList.pop(e.hotelRoomID)
                    }
                })
            }

            var showAll = showList + ',' + showFromBill
            var formatShowAll = new Object(showAll.split(','))
            let unique = formatShowAll.filter((v, i) => formatShowAll.indexOf(v) === i)
            var listDetail = []
            async function getRoom(id) {
                if (id === '') return
                var room = await HotelRoom.find({ _id: id })
                return listDetail.push(room)
            }
            await Promise.all(unique.map(id => getRoom(id)))
            //filter number of people
            var show = []
            listDetail.forEach(e => {
                e.forEach(i => {
                    if (numberOfPeople <= (i.bedroom.singleBed * 1 + i.bedroom.doubleBed * 2 + i.bedroom.queenSizeBed * 2 + i.bedroom.kingSizeBed * 2)) {
                        show.push(i)
                    }
                })
            })

            return res.status(200).send({
                errorCode: 0,
                data: show
            })

        } else if (!checkIn && !checkOut && numberOfPeople) {
            var show = []
            const list = await HotelRoom.find({})
            list.foreach(e => {
                if (numberOfPeople <= (e.bedroom.singleBed * 1 + e.bedroom.doubleBed * 2 + e.bedroom.queenSizeBed * 2 + e.bedroom.kingSizeBed * 2)) {
                    show.push(e)
                }
            })
            return res.status(200).send({
                errorCode: 0,
                data: show
            })
        } else if (!checkIn && !checkOut && !numberOfPeople) {
            HotelRoom.find({ address }, (err, list) => {
                if (err) return res.status(500).send({
                    errorCode: 500,
                    message: 'Hotel server is error!'
                })
                return res.status(500).send({
                    errorCode: 0,
                    data: list
                })
            })
        }
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Filter hotel function is error!'
        })
    }
}