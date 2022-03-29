const express = require('express')
const { listTour, detailTour, paymentTour, success, cancel, listBillTour, detailBillTour, rateTour } = require('../../controllers/user/tour.controller')
const { checkRate } = require('../../middlewares/checkRateTour.middleware')
const { verifyToken } = require('../../middlewares/jwt.middleware')

const router = express.Router()

router.get('/list-tour', listTour)
router.get('/detail-tour', detailTour)
router.get('/payment-tour/:tourID',[verifyToken], paymentTour)
router.get('/success/:tourID',[verifyToken], success) //:tourID
router.get('/cancel',[verifyToken], cancel)
router.get('/list-bill-tour', [verifyToken], listBillTour)
router.get('/detail-bill-tour/:billTourID', [verifyToken], detailBillTour)

router.post('/rate-tour/:billTourID', [verifyToken, checkRate], rateTour)

module.exports = router