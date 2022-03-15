const db = require('../../models/index')
const Tour = db.tour
const CategoryTour = db.categoryTour
const BillTour = db.billTour
const Moderator = db.moderator
const User = db.user
const paypal = require('paypal-rest-sdk')

exports.addTour = async (req, res, next) => {
    if (req.files) {
        let path = ''
        req.files.forEach(files => {
            path = path + files.path + ','
        });
        path = path.substring(0, path.lastIndexOf(','))
        req.body.picture = path
    } else {
        req.body.picture = 'No photo'
    }
    const category = await CategoryTour.findOne({ categoryName: req.query.categoryName })
    const moderator = await Moderator.findById(req.accountID)
    const tour = new Tour({
        tourName: req.body.tourName,
        startDate: req.body.startDate,
        price: req.body.price,
        picture: req.body.picture,
        address: req.body.address,
        description: {
            vehicle: req.body.vehicle,
            timeDecription: req.body.timeDecription
        },
        moderatorID: moderator._id,
        categoryTourID: category._id,
    })
    tour.save()
        .then(() => {
            res.status(200).send({
                errorCode: 0,
                message: 'upload successfully!'
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({ message: error })
        })
}

exports.editTour = (req, res, next) => {
    Tour.find({_id: req.params.tourID, moderatorID: req.accountID}, (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: tour
        })
    })
}

exports.updateTour = async (req, res, next) => {
    const category = CategoryTour.findOne({ categoryName: req.body.categoryName })
    Tour.findOneAndUpdate({_id: req.params.tourID, moderatorID: req.accountID}, {
        tourName: req.body.tourName,
        startDate: req.body.startDate,
        price: req.body.price,
        picture: req.body.picture,
        address: req.body.address,
        description: {
            vehicle: req.body.vehicle,
            timeDecription: req.body.timeDecription
        },
        categoryTourID: category._id
    }, { new: true }, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'update tour successfully!'
        })
    })
}

exports.deleteTour = (req, res, next) => {
    Tour.findOneAndDelete({_id: req.params.tourID, moderatorID: req.accountID}, err => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'delete tour successfully!'
        })
    })
}

//list tour according moderator 
exports.listTour = (req, res, next) => {
    let perPage = 10
    let page = req.params.page || 1
    Tour.find({ moderatorID: req.accountID })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(async (err, list) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            Tour.countDocuments({ moderatorID: req.accountID }, (err, count) => {
                if (err) return res.status(500).send({
                    errorCode: 500,
                    message: err
                })
                let show = []
                list.forEach(e => {
                    var tour = {
                        tourID: e._id,
                        tourName: e.startDate,
                        price: e.price,
                        address: e.address
                    }
                    show.append(tour)
                })
                return res.status(200).send({
                    errorCode: 0,
                    data: show,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })


}

exports.detailTour = () => {
    Tour.findById(req.params.tourID, (err, tour) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: tour
        })
    })
}
//booked tour
// payment online
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AW08gKdTJAStrt0PenCcUa-EPaqphhipPcMNjtWKfIoRSHWBt-YRM5bea51ZAiv16baUZQLO2BNCKETw',
    'client_secret': 'EF-_jU1cTmNx1UQHkyl7nq3puKAd2JSAvFSbHxgfGeoNgiXsaW4eQ-PalxcQ5hZHcGJ5kD3sfB-21w7L'
});


//book tour la chuc nang cua user
exports.paymentTour = async (req, res) => {
    await Tour.findById(req.params.tourID)
        .then(tour => {
            tourName = tour.tourName
            price = tour.price
            number = 2
            total = price * number
        })
        .catch(err => {
            console.log(err)
        })
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:1001/tour/success",
            "cancel_url": "http://localhost:1001/tour/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": `Tour: ${tourName}`,
                    //"sku": "001",
                    "price": `${price}`,
                    "currency": "USD",
                    "quantity": `${number}`
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
}

exports.success = async (req, res, next) => {
    await Tour.findById({ _id: '6210a649b7ccdfb4c06cd388' })
        .then(tour => {
            price = tour.price
            number = 2
            total = price * number
            console.log(total)
        })
        .catch(err => {
            console.log(err)
        })

    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

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
            const billTour = new BillTour({
                accountId: '62090db6bd7ef1e7c3f98332', //req.userId
                tourId: '6210a649b7ccdfb4c06cd388', //req.params.tourId
                bookedDate: Date.now()
            })
            billTour.save()
                .then(() => {
                    return res.status(200).send({
                        errorCode: 0,
                        message: 'save booked tour successfully'
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            // console.log(JSON.stringify(payment));
            // res.send('Success (Mua hàng thành công)');
        }
    });
}

exports.cancel = (req, res) => {
    res.send('Cancelled (Đơn hàng đã hủy)')
    return
}

exports.listBillTour = async (req, res, next) => {
    try {
        Tour.find({ moderatorID: req.accountID }, (err, listTour) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            let listBill = []
            let listDetail = []
            listTour.forEach(async e => {
                BillTour.find({ tourID: e._id }, (err, bill) => {
                    if (err) return res.status(500).send({
                        errorCode: 500,
                        message: err
                    })

                    listBill.append(bill)
                })
            })
            listBill.forEach(async e => {
                var user = await User.findById(e.userID)
                var tour = await Tour.findById(e.tourID)
                var detail = {
                    bookedDate: e.bookedDate,
                    tourName: tour.tourName,
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

exports.deleteBillTour = async (req,res) =>{
    try {
        Tour.find({moderatorID: req.accountID}, (err, list)=>{
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            list.forEach(e=>{
                const bill = await BillTour.findById(req.params.billTourID)
                if(bill.tourID === e._id){
                    await BillTour.findByIdAndUpdate(req.params.billTourID, {deleted: true}, {new: true}, err =>{
                        if (err) return res.status(500).send({
                            errorCode: 500,
                            message: err
                        })
                        return res.status(200).send({
                            errorCode: 0,
                            message: 'Delete bill tour successfully!'
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
// exports.detailBillTour = (req, res, next) => {

// }