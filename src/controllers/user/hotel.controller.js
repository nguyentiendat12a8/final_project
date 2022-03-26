const db = require('../../models/index')
const HotelRoom = db.hotelRoom

exports.listHotel = (req, res) =>{
    HotelRoom.find({}, (err, list) =>{
        if(err) return res.status(500).send({
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

exports.detailHotel = (req, res) =>{
    
}

exports.bookHotel = (req, res) =>{
    
}

exports.listBillHotel = (req, res) =>{
    
}

exports.detailBillHotel = (req, res) =>{
    
}

