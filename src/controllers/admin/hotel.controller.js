const db = require('../../models/index')
const HotelRoom = db.hotelRoom


exports.listHotel = (req, res) => {
    HotelRoom.find({}, (err, hotelRoom) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: hotelRoom
        })
    })
}

exports.detailHotel = (req, res) => {
    const hotelRoomID = req.params.hotelRoomID
    if(!hotelRoomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.findById({_id: hotelRoomID}, (err, room)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: room
        })
    })
}

exports.deleteHotel = (req, res) => {
    const hotelRoomID = req.params.hotelRoomID
    if(!hotelRoomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.findByIdAndDelete({_id: hotelRoomID}, (err)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'delete room successfully!'
        })
    })
}

exports.restoreHotel = (req, res, next) => {

}

exports.forceDeleteHotel = (req, res, next) => {

}

//bộ lọc
exports.filterMostHotel = (req, res, next) => {

}

exports.filterLeastHotel = (req, res, next) => {

}


//xem danh sách hotel của mod từ danh sách account//lọc theo id của từng mod
exports.listModHotel = (req, res, next) => {
    const moderatorID = req.params.moderatorID
    if(!moderatorID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.find({moderatorID}, (err, list)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: list
        })
    })
}

exports.detailModHotel = (req, res, next) => {
    const hotelroomID = req.params.hotelroomID
    if(!hotelroomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.findById({hotelroomID}, (err, room)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: room
        })
    })
}

exports.deleteModHotel = (req, res, next) => {

}

exports.restoreModHotel = (req, res, next) => {

}

exports.forceDeleteModHotel = (req, res, next) => {

}

//xem danh sach hoa don tu danh sach account
exports.listBillModHotel = (req, res, next) => {
    //lọc theo id của từng mod
}

exports.detailBillModHotel = (req, res, next) => {

}

exports.deleteBillModHotel = (req, res, next) => {

}

exports.restoreBillModHotel = (req, res, next) => {

}

exports.forceDeleteBillModHotel = (req, res, next) => {

}


//xem danh sach hoa don tu danh sach user account 
exports.listBillUserHotel = (req, res, next) => {
    //lọc theo id của từng mod
}

exports.detailBillUserHotel = (req, res, next) => {

}

exports.deleteBillUserHotel = (req, res, next) => {

}

exports.restoreBillUserHotel = (req, res, next) => {

}

exports.forceDeleteBillUserHotel = (req, res, next) => {

}