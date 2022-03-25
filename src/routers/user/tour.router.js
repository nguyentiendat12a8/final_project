const express = require('express')
const { listTour, detailTour, paymentTour, success, cancel, listBillTour, detailBillTour } = require('../../controllers/user/tour.controller')
const { verifyToken } = require('../../middlewares/jwt.middleware')

const router = express.Router()

router.get('/list-tour', listTour)
router.get('/detail-tour', detailTour)
router.get('/payment-tour/:tourID',[verifyToken], paymentTour)
router.get('/success/:tourID',[verifyToken], success) //:tourID
router.get('/cancel',[verifyToken], cancel)
router.get('/list-bill-tour', [verifyToken], listBillTour)
router.get('/detail-bill-tour/:billTourID', [verifyToken], detailBillTour)

module.exports = router