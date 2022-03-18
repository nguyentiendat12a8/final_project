const db = require('../../models/index')
const HotelRoom = db.hotelRoom
const BillHotelRoom = db.billHotelRoom
const User = db.user

exports.createHotelRoom = (req, res) =>{
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
    HotelRoom.findOne({_id: req.params.hotelRoomID, moderatorID: req.accountID}, (err, post) =>{
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
    HotelRoom.findOneAndUpdate({_id: req.params.hotelRoomID, moderatorID: req.accountID}, {
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
    Post.findOneAndDelete({_id: req.params.hotelRoomID, moderatorID: req.accountID}, err =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete hotel room successfully!'
        })
    })
}

exports.listHotelRoom = (req, res) =>{
    let perPage = 10
    let page = req.query.page || 1
    HotelRoom.find({moderatorID: req.accountID})
    .skip((perPage*page) - perPage)
    .limit(perPage)
    .exec( async (err, list) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        await Post.countDocuments({moderatorID: req.accountID}, (err, count)=>{
            if(err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            return res.status(200).send({
                errorCode: 0,
                data: list,
                current: page,
                pages: Math.ceil(count/perPage)
            })
        })
    })
}

exports.detailHotelRoom = (req, res) =>{
    HotelRoom.findOne({_id: req.params.hotelRoomID, moderatorID: req.accountID}, (err, post) =>{
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
                BillHotelRoom.find({ hotelRoomID: e._id, deleted: false }, (err, bill) => {
                    if (err) return res.status(500).send({
                        errorCode: 500,
                        message: err
                    })

                    listBill.append(bill)
                })
            })
            listBill.forEach(async e => {
                var user = await User.findById(e.userID)
                var room = await HotelRoom.findById(e.hotelRoomID)
                var detail = {
                    checkIn : e.checkIn,
                    checkOut : checkOut,
                    bookedDate: e.createAt,
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

exports.deleteBillHotelRoom = (req, res) =>{
    try {
        HotelRoom.find({moderatorID: req.accountID}, (err, list)=>{
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            list.forEach(e=>{
                const bill = await BillHotelRoom.findOne({_id: req.params.billHotelRoomID, deleted: false })
                if(bill.hotelRoomID === e._id){
                    await BillHotelRoom.findByIdAndUpdate(req.params.billHotelRoomID, {deleted: true}, {new: true}, err =>{
                        if (err) return res.status(500).send({
                            errorCode: 500,
                            message: err
                        })
                        return res.status(200).send({
                            errorCode: 0,
                            message: 'Delete bill hotel successfully!'
                        })
                    })
                }
    
            })
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: error
        })
    }
}

//search, filter
exports.searchHotelRoom = (req,res) =>{
    var search = req.query.search
    HotelRoom.find({}, (err, room)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var dataSearch = room.filter(r => search.toLowerCase().include(r.roomName.toLowerCase()))
        return res.status(200).send({
            errorCode: 0,
            data: dataSearch
        })
    })
}

exports.filterHotelRoom =(req,res) =>{
    HotelRoom.find({},(err, room)=>{
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var dataSort = room.sort((a,b) => a.price - b.price)
        return res.status(200).send({
            errorCode: 0,
            data: dataSort
        })
    })
}