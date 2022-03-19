const db = require('../../models/index')
const HotelRoom = db.hotelRoom
const BillHotelRoom = db.billHotelRoom
const User = db.user

exports.addHotelRoom = (req, res) =>{
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
        roomName: req.body.roomName ,
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
            pool:req.body.pool,
            smoking: req.body.smoking,
        },
        photo: req.body.photo,
        description: req.body.description,
        address: req.body.address,
        moderatorID: req.accountID
    })
    room.save(err=>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Add hotel room successfully!'
        })
    })
}

exports.editHotelRoom = (req, res) =>{
    HotelRoom.findOne({ slug: req.params.slug, moderatorID: req.accountID, deleted: false }, async (err, room) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if(room == null){
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
                pool:room.utilities.pool,
                smoking: room.utilities.smoking,
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

exports.updateHotelRoom = (req, res) =>{
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
    HotelRoom.findOneAndUpdate({slug: req.params.slug, moderatorID: req.accountID, deleted: false}, {
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
            pool:req.body.pool,
            smoking: req.body.smoking,
        },
        photo: req.body.photo,
        description: req.body.description,
    }, {new: true} ,err =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Update hotel room successfully!'
        })
    })
}

exports.deleteHotelRoom = (req, res) =>{
    HotelRoom.findOneAndUpdate({ slug: req.params.slug, moderatorID: req.accountID }, { deleted: true }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'delete room successfully!'
        })
    })
}

exports.listHotelRoom = (req, res) =>{
    let perPage = 10
    let page = req.query.page || 1
    HotelRoom.find({moderatorID: req.accountID, deleted: false})
    .skip((perPage*page) - perPage)
    .limit(perPage)
    .exec((err, list) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        HotelRoom.countDocuments({moderatorID: req.accountID, deleted: false})
        .then(count =>{
            var listDetail = []
            list.forEach(e=>{
                var detail ={
                    roomName: e.roomName,
                    price: e.price,
                    photo: e.photo,
                    address: e.address,
                    slug: e.slug
                }
                listDetail.push(detail)
            })
            return res.status(200).send({
                errorCode: 0,
                data: listDetail,
                current: page,
                pages: Math.ceil(count/perPage)
            })
        })
        .catch(err =>{
            return res.status(500).send({
                errorCode: 500,
                message: err
            })
        })
    })
}

exports.detailHotelRoom = (req, res) =>{
    HotelRoom.findOne({slug: req.params.slug, moderatorID: req.accountID, deleted: false}, (err, post) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: post
        })
    })
}

exports.listBillHotelRoom = (req, res) =>{
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
                    checkIn : e.checkIn,
                    checkOut : checkOut,
                    bookedDate: e.createdAt,
                    HotelRoomName: room.roomName,
                    userID: user.userName
                }
                listDetail.append(detail)
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

// exports.deleteBillHotelRoom = (req, res) =>{
//     try {
//         HotelRoom.find({moderatorID: req.accountID}, (err, list)=>{
//             if (err) return res.status(500).send({
//                 errorCode: 500,
//                 message: err
//             })
//             list.forEach(async e=>{
//                 const bill = await BillHotelRoom.findOne({_id: req.params.billHotelRoomID, deleted: false })
//                 if(bill.hotelRoomID === e._id){
//                     await BillHotelRoom.findByIdAndUpdate(req.params.billHotelRoomID, {deleted: true}, {new: true}, err =>{
//                         if (err) return res.status(500).send({
//                             errorCode: 500,
//                             message: err
//                         })
//                         return res.status(200).send({
//                             errorCode: 0,
//                             message: 'Delete bill hotel successfully!'
//                         })
//                     })
//                 }
    
//             })
//         })
//     } catch (error) {
//         return res.status(500).send({
//             errorCode: 500,
//             message: error
//         })
//     }
// }

//search, filter

exports.searchHotelRoom = async (req,res) =>{
    const listHotelRoom = await HotelRoom.find({ moderatorID: req.accountID,deleted: false })
    var search = req.query.search
    var dataSearch = listHotelRoom.filter(r => r.roomName.toLowerCase().includes(search.toLowerCase()))
    var count = 0
    dataSearch.forEach(() => count++)

    let perPage = 10
    let page = req.query.page || 1
    HotelRoom.find({ moderatorID: req.accountID, deleted: false })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(async (err, list) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            var search = req.query.search
            var dataSearch = list.filter(r => r.roomName.toLowerCase().includes(search.toLowerCase()))
            var show = []
            dataSearch.forEach(e => {
                var room = {
                    roomName: e.roomName,
                    price: e.price,
                    photo: e.photo,
                    address: e.address,
                    slug: e.slug
                }
                show.push(room)
            })
            return res.status(200).send({
                errorCode: 0,
                data: show,
                current: page,
                pages: Math.ceil(count / perPage)
            })
        })
}

exports.filterASCHotelRoom = async (req, res) => {
    let perPage = 10
    let page = req.query.page || 1
    const listHotelRoom = await HotelRoom.find({ moderatorID: req.accountID, deleted: false })
    var dataSort = listHotelRoom.sort((a, b) => a.price - b.price)
    const data = dataSort.slice(((perPage * page) - perPage), (perPage * page))

    HotelRoom.countDocuments({ moderatorID: req.accountID, deleted: false }, (err, count) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        data.forEach(e => {
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
            current: page,
            pages: Math.ceil(count / perPage)
        })
    })
}

exports.filterDESHotelRoom = async (req, res) => {
    let perPage = 10
    let page = req.query.page || 1
    const listHotelRoom = await HotelRoom.find({ moderatorID: req.accountID, deleted: false })
    var dataSort = listHotelRoom.sort((a, b) => b.price - a.price)
    const data = dataSort.slice(((perPage * page) - perPage), (perPage * page))

    HotelRoom.countDocuments({ moderatorID: req.accountID, deleted: false }, (err, count) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        data.forEach(e => {
            var room = {
                roomName: e.roomName,
                price: e.price,
                photo: e.photo,
                address: e.address,
                slug: e.slug
            }
            show.push(room)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show,
            current: page,
            pages: Math.ceil(count / perPage)
        })
    })
}
