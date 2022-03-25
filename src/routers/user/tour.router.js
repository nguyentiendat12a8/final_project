const express = require('express')
const { listTour, detailTour, paymentTour, success, cancel } = require('../../controllers/user/tour.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')

const router = express.Router()

router.get('/list-tour', listTour)
router.get('/detail-tour', detailTour)
router.get('/payment-tour/:tourID',[verifyToken], paymentTour)
router.get('/success/:tourID',[verifyToken], success) //:tourID
router.get('/cancel',[verifyToken], cancel)

module.exports = router