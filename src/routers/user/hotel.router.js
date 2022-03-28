const express = require('express')
const { listHotelRoom } = require('../../controllers/user/hotel.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')

const router = express.Router()

router.get('/list-hotel-room', listHotelRoom)

module.exports = router