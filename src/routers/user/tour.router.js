const express = require('express')
const { listTour, detailTour, paymentTour, success, cancel, listBillTour, detailBillTour, rateTour, addTourDraft, listOrganization, sendTourDraft, viewTourDraft, viewTourDraftToMod, paymentTourCustom, successPayCustom, cancelPayCustom } = require('../../controllers/user/tour.controller')
const { checkRate } = require('../../middlewares/checkRateTour.middleware')
const { verifyToken } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../middlewares/uploadFile.middleware')

const router = express.Router()

router.get('/list-tour', listTour)
router.get('/detail-tour', detailTour)
router.get('/payment-tour/:slug',[verifyToken], paymentTour)
router.get('/success/:slug',[verifyToken], success) //:tourID
router.get('/cancel',[verifyToken], cancel)
router.get('/list-bill-tour', [verifyToken], listBillTour)
router.get('/detail-bill-tour/:billTourID', [verifyToken], detailBillTour)

router.post('/rate-tour/:billTourID', [verifyToken, checkRate], rateTour)

//custom tour 
router.post('/add-tour-draft', [verifyToken, upload.array('picture')], addTourDraft)
router.get('/list-organization/:tourDraftID', [verifyToken], listOrganization)
router.post('/send-tour-draft/:tourDraftID/:moderatorID', [verifyToken], sendTourDraft)
router.get('/view-tour-draft', [verifyToken], viewTourDraft)
router.get('/view-tour-custom-to-mod/:tourDraftID', [verifyToken], viewTourDraftToMod)
router.get('/payment-tour-custom/:slug', [verifyToken], paymentTourCustom) //chưa test
router.get('/successPayCustom/:slug', [verifyToken], successPayCustom)//chưa test
router.get('/cancle-pay-custom', [verifyToken], cancelPayCustom)//chưa test


module.exports = router