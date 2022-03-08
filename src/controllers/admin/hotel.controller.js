const db = require('../../models/index')
const HotelRoom = db.hotelRoom


exports.listHotelRoom = (req, res) => {
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

exports.detailHotelRoom = (req, res) => {
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

exports.deleteHotelRoom = (req, res) => {
    const hotelRoomID = req.params.hotelRoomID
    if(!hotelRoomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.delete({_id: hotelRoomID}, (err)=>{
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

exports.trashHotelRoom = (req, res, next) => {
    HotelRoom.findDeleted({}, (err,listDelete)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: listDelete
        })
    })
}

exports.restoreHotelRoom = (req, res, next) => {
    const hotelRoomID = req.params.hotelRoomID
    if(!hotelRoomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.restore({_id: hotelRoomID}, (err)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Restore room successfully!'
        })
    })
}

exports.forceDeleteHotelRoom = (req, res, next) => {
    const hotelRoomID = req.params.hotelRoomID
    if(!hotelRoomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.deleteOne({_id: hotelRoomID}, (err)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Force delete room successfully!'
        })
    })
}

//bộ lọc
exports.filterMostHotelRoom = (req, res, next) => {

}

exports.filterLeastHotelRoom = (req, res, next) => {

}

//bộ lọc search
//query params
exports.filterModHotelRoom = (req, res, next) => {
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

exports.detailModHotelRoom = (req, res, next) => {
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

exports.deleteModHotelRoom = (req, res, next) => {
    const hotelroomID = req.params.hotelroomID
    if(!hotelroomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.delete({hotelroomID}, err=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete room successfully!'
        })
    })
}

exports.trashModHotelRoom = (req, res, next) => {
    HotelRoom.findDeleted({}, (err, listDelete)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: listDelete
        })
    })
}

exports.restoreModHotelRoom = (req, res, next) => {
    const hotelroomID = req.params.hotelroomID
    if(!hotelroomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.restore({hotelroomID}, err=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Restore hotel successfully!'
        })
    })
}

exports.forceDeleteModHotelRoom = (req, res, next) => {
    const hotelroomID = req.params.hotelroomID
    if(!hotelroomID) return res.status(400).send({
        errorCode: 400,
        message: 'link invalid!'
    })
    HotelRoom.deleteOne({hotelroomID}, (err)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'hotel server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Force delete successfully!'
        })
    })
}

//xem danh sach hoa don tu danh sach account
exports.listBillModHotelRoom = (req, res, next) => {
    //lọc theo id của từng mod

}

exports.detailBillModHotelRoom = (req, res, next) => {

}

exports.deleteBillModHotelRoom = (req, res, next) => {

}

exports.restoreBillModHotelRoom = (req, res, next) => {

}

exports.forceDeleteBillModHotelRoom = (req, res, next) => {

}


//xem danh sach hoa don tu danh sach user account 
exports.listBillUserHotelRoom = (req, res, next) => {
    //lọc theo id của từng mod
}

exports.detailBillUserHotelRoom = (req, res, next) => {

}

exports.deleteBillUserHotelRoom = (req, res, next) => {

}

exports.restoreBillUserHotelRoom = (req, res, next) => {

}

exports.forceDeleteBillUserHotelRoom = (req, res, next) => {

}