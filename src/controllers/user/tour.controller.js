const db = require('../../models/index')
const Tour = db.tour
const Rate = db.rateTour
const Moderator = db.moderator
const BillTour =db.billTour
const User = db.user
const Category = db.categoryTour

exports.listTour = (req, res, next) => {
    Tour.find({deleted: false}, (err, list) => { // theem dieu kien , private: false
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        list.forEach(async e => {
            var tour = {
                tourName: e.tourName,
                picture: e.picture,
                startDate: e.startDate,
                time: e.time,
                price: e.price,
                address: e.address,
                startingPoint: e.startingPoint,
                numberOfRate: e.rate.numberOfRate,
                numberOfStar: e.rate.numberOfStar, //if === 0 => no rating
                slug: e.slug
            }
            show.push(tour)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.detailTour = (req, res, next) => {
    Tour.findOne({ slug: req.query.slug, deleted: false },async (err, tour) => { //them dieu kien , private: false
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        if(tour === null) res.status(400).send({
            errorCode: 400,
            message: 'invalid link!'
        })
        const mod = await Moderator.findById(tour.moderatorID)
        if (mod === null) return res.status(400).send({
            errorCode: 400,
            message: 'Tour is error'
        })
        const category = await Category.findById(tour.categoryTourID)
        if (category === null) return res.status(400).send({
            errorCode: 400,
            message: 'Category is error'
        })
        var tour = {
            tourName: tour.tourName,
            startDate: tour.startDate,
            price: tour.price,
            picture: tour.picture,
            time: tour.time,
            address: tour.address,
            startingPoint: tour.startingPoint,
            hotel: tour.hotel,
            numberOfRate: tour.rate.numberOfRate,
            numberOfStar: tour.rate.numberOfStar,
            description: {
                vehicle: tour.description.vehicle,
                timeDecription: tour.description.timeDecription,
            },
            categoryName: category.categoryName,
            createdAt: tour.createdAt,
            modName: mod.modName,
            avatar: mod.avatar,
            email: mod.email,
            slug: tour.slug
        }
        return res.status(200).send({
            errorCode: 0,
            data: tour
        })
    })
}

exports.bookTour = (req, res, next) => {

}

// need update
exports.listBillTour = (req, res, next) => {
    BillTour.find({userID: req.accountID, deleted: false}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        var show = []
        list.forEach(async e => {
            var tour = await Tour.findById(e.tourID)
            if(!user || !tour) return res.status(500).send({
                errorCode: 500,
                message: 'Bill tour is error'
            })
            var detail = {
                bookedDate: e.bookedDate,
                tourName: tour.tourName,
                startDate: tour.startDate,

            }
            show.push(detail)
        })
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.detailBillTour = (req, res, next) => {

}

//rate tour
//cần check time rate -- qua ngày xuất phát mới được rate
//cần check người này đã từng đánh giá trước đó hay chưa, nếu rồi thì sẽ update rate mới.









exports.addCustomTour = (req, res) => {

}

const paypal = require('paypal-rest-sdk')
// payment online
// paypal.configure({
//     'mode': 'sandbox', //sandbox or live
//     'client_id': 'AW08gKdTJAStrt0PenCcUa-EPaqphhipPcMNjtWKfIoRSHWBt-YRM5bea51ZAiv16baUZQLO2BNCKETw',
//     'client_secret': 'EF-_jU1cTmNx1UQHkyl7nq3puKAd2JSAvFSbHxgfGeoNgiXsaW4eQ-PalxcQ5hZHcGJ5kD3sfB-21w7L'
// });


// //book tour la chuc nang cua user
// exports.paymentTour = async (req, res) => {
//     await Tour.findById(req.params.tourID)
//         .then(tour => {
//             tourName = tour.tourName
//             price = tour.price
//             number = 2
//             total = price * number
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     const create_payment_json = {
//         "intent": "sale",
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "redirect_urls": {
//             "return_url": "http://localhost:1001/tour/success",
//             "cancel_url": "http://localhost:1001/tour/cancel"
//         },
//         "transactions": [{
//             "item_list": {
//                 "items": [{
//                     "name": `Tour: ${tourName}`,
//                     //"sku": "001",
//                     "price": `${price}`,
//                     "currency": "USD",
//                     "quantity": `${number}`
//                 }]
//             },
//             "amount": {
//                 "currency": "USD",
//                 "total": `${total}`
//             },
//             "description": "book tour tien loi"
//         }]
//     };


//     paypal.payment.create(create_payment_json, function (error, payment) {
//         if (error) {
//             throw error;
//         } else {
//             for (let i = 0; i < payment.links.length; i++) {
//                 if (payment.links[i].rel === 'approval_url') {
//                     res.redirect(payment.links[i].href);
//                 }
//             }

//         }
//     });
// }

// exports.success = async (req, res, next) => {
//     await Tour.findById({ _id: '6210a649b7ccdfb4c06cd388' })
//         .then(tour => {
//             price = tour.price
//             number = 2
//             total = price * number
//             console.log(total)
//         })
//         .catch(err => {
//             console.log(err)
//         })

//     const payerId = req.query.PayerID;
//     const paymentId = req.query.paymentId;

//     const execute_payment_json = {
//         "payer_id": payerId,
//         "transactions": [{
//             "amount": {
//                 "currency": "USD",
//                 "total": `${total}`
//             }
//         }]
//     };
//     paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
//         if (error) {
//             console.log(error.response);
//             throw error;
//         } else {
//             const billTour = new BillTour({
//                 accountId: '62090db6bd7ef1e7c3f98332', //req.userId
//                 tourId: '6210a649b7ccdfb4c06cd388', //req.params.tourId
//                 bookedDate: Date.now()
//             })
//             billTour.save()
//                 .then(() => {
//                     return res.status(200).send({
//                         errorCode: 0,
//                         message: 'save booked tour successfully'
//                     })
//                 })
//                 .catch(err => {
//                     console.log(err)
//                 })
//             // console.log(JSON.stringify(payment));
//             // res.send('Success (Mua hàng thành công)');
//         }
//     });
// }

// exports.cancel = (req, res) => {
//     res.send('Cancelled (Đơn hàng đã hủy)')
//     return
// }