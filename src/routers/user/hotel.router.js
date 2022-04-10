const express = require('express')
const { get } = require('mongoose')
const { listHotelRoom, detailHotelRoom, paymentHotelRoom, successHotelRoom, cancelHotelRoom, filterHotelRoom, listBillHotel, detailBillHotel } = require('../../controllers/user/hotel.controller')
const { checkTimeBooking } = require('../../middlewares/checkTimeBookRoom.middleware')
const { verifyToken } = require('../../middlewares/jwt.middleware')

const router = express.Router()

router.get('/list-hotel-room', listHotelRoom)
router.get('/detail-hotel-room/:slug',[checkTimeBooking], detailHotelRoom)
router.get('/payment-hotel-room', paymentHotelRoom)
router.get('/success/:hotelRoomID/:checkIn/:checkOut', successHotelRoom) 
router.get('/cancel', cancelHotelRoom)

//bill
router.get('/list-bill-hotel-room',[verifyToken], listBillHotel)
router.get('/detail-bill-hotel-room/:billHotelRoomID', [verifyToken], detailBillHotel)

//filter
router.get('/filter-hotel-room', filterHotelRoom)

module.exports = router