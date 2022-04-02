const express = require('express')
const { listHotelRoom, detailHotelRoom, paymentHotelRoom, success, cancel } = require('../../controllers/user/hotel.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')

const router = express.Router()

router.get('/list-hotel-room', listHotelRoom)
router.get('/detail-hotel-room/:slug', detailHotelRoom)
router.get('/payment-hotel-room', paymentHotelRoom)
router.get('/success/:hotelID',[verifyToken], success) 
router.get('/cancel',[verifyToken], cancel)

module.exports = router