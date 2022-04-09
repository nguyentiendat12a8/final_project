const express = require('express')
const { listHotelRoom, detailHotelRoom, paymentHotelRoom, successHotelRoom, cancelHotelRoom } = require('../../controllers/user/hotel.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')

const router = express.Router()

router.get('/list-hotel-room', listHotelRoom)
router.get('/detail-hotel-room/:slug', detailHotelRoom)
router.get('/payment-hotel-room', paymentHotelRoom)
router.get('/success/:hotelRoomID/:quantity', successHotelRoom) 
router.get('/cancel', cancelHotelRoom)

module.exports = router