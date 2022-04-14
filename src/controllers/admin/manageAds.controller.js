const db = require('../../models/index')
const RoomAds = db.roomAds
const TourAds = db.tourAds
const HotelRoom = db.hotelRoom
const Tour = db.tour
const Ads = db.ads


exports.addAds = async (req, res) => {
    const count = await Ads.countDocuments({})
    if (count === 1) {
        return res.status(400).send({
            errorCode: 400,
            message: 'Can only add 1 document ads!'
        })
    }
    const ads = new Ads({
        price: req.body.price
    })
    await ads.save(err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Add ads function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Add price for ads successfully!'
        })
    })
}

exports.viewAds = (req, res) => {
    Ads.findOne({}, (err, ads) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Ads server is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            data: ads
        })
    })
}

exports.editAds = (req, res) => {
    Ads.findOne({}, (err, ads) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Edit ads function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            data: ads
        })
    })
}

exports.updateAds = (req, res) => {
    Ads.findOneAndUpdate({}, { price: req.body.price }, { new: true }, (err) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Ads price has been updated successfully!'
        })
    })
}

//ads hotel

exports.listRoomAds = (req, res) => {
    RoomAds.find({}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })

        var listShow = []
        async function getRoom(hotelRoom) {
            var room = await HotelRoom.findById(hotelRoom.hotelRoomID)
            if (!room) return res.status(400).send({
                errorCode: 400,
                message: 'This room has been deleted or an error has occurred, please try again!'
            })
            var show = {
                roomName: room.roomName,
                timeEnd: hotelRoom.timeEnd,
                _id: hotelRoom._id
            }
            return listShow.push(show)
        }
        await Promise.all(list.map((hotelRoom) => getRoom(hotelRoom)))

        return res.status(200).send({
            errorCode: 0,
            data: listShow
        })
    })
}

exports.deleteRoomAds = (req, res) => {
    RoomAds.findByIdAndDelete(req.params.roomAdsID, (err) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Delete room ads function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete room ads successfully!'
        })
    })
}

exports.showRoomAds = (req, res) => {
    RoomAds.find({}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })

        var listShow = []
        async function getRoom(hotelRoom) {
            var room = await HotelRoom.findById(hotelRoom.hotelRoomID)
            if (!room) return res.status(400).send({
                errorCode: 400,
                message: 'This room has been deleted or an error has occurred, please try again!'
            })
            var show = {
                _id: room._id,
                roomName: room.roomName,
                picture: room.picture,
                address: room.address
            }
            return listShow.push(show)
        }
        await Promise.all(list.map((hotelRoom) => getRoom(hotelRoom)))

        return res.status(200).send({
            errorCode: 0,
            data: listShow
        })
    })
}


//ads tour

exports.listTourAds = (req, res) => {
    TourAds.find({}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })

        var listShow = []
        async function getTour(tour) {
            var tourDetail = await Tour.findById(tour.tourID)
            if (!tourDetail) {
                return res.status(400).send({
                    errorCode: 400,
                    message: 'This tour has been deleted or an error has occurred, please try again!'
                })
            }
            var show = {
                tourName: tourDetail.tourName,
                timeEnd: tour.timeEnd,
                _id: tour._id
            }
            return listShow.push(show)
        }
        await Promise.all(list.map((tour) => getTour(tour)))

        return res.status(200).send({
            errorCode: 0,
            data: listShow
        })
    })
}

exports.deleteTourAds = (req, res) => {
    TourAds.findByIdAndDelete(req.params.tourAdsID, (err) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'Delete tour ads function is error!'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete room ads successfully!'
        })
    })
}

exports.showTourAds = (req, res) => {
    TourAds.find({}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err.message
        })

        var listShow = []
        async function getTour(tour) {
            var tourDetail = await Tour.findById(tour.tourID)
            if (!tourDetail) return res.status(400).send({
                errorCode: 400,
                message: 'This tour has been deleted or an error has occurred, please try again!'
            })
            var show = {
                _id: tourDetail._id,
                roomName: tourDetail.tourName,
                picture: tourDetail.picture,
                address: tourDetail.address
            }
            return listShow.push(show)
        }
        await Promise.all(list.map((tour) => getTour(tour)))

        return res.status(200).send({
            errorCode: 0,
            data: listShow
        })
    })
}