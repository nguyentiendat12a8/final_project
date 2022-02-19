const paypal = require('paypal-rest-sdk');
const db = require('../models/users/index')
const BookedTour = db.bookedTour
const Tour = db.tour
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AW08gKdTJAStrt0PenCcUa-EPaqphhipPcMNjtWKfIoRSHWBt-YRM5bea51ZAiv16baUZQLO2BNCKETw',
    'client_secret': 'EF-_jU1cTmNx1UQHkyl7nq3puKAd2JSAvFSbHxgfGeoNgiXsaW4eQ-PalxcQ5hZHcGJ5kD3sfB-21w7L'
});

exports.payment = async (req, res) => {
    await Tour.findById({ _id: '6210a649b7ccdfb4c06cd388' })
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
            const bookedTour = new BookedTour({
                accountId: '62090db6bd7ef1e7c3f98332', //req.userId
                tourId: '6210a649b7ccdfb4c06cd388', //req.params.tourId
                bookedDate: Date.now()
            })
            bookedTour.save()
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