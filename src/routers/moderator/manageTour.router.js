const express = require('express')
const {signup, signin, updatePassword, editAccount, updateAccount, sendEmailResetPass, confirmLink,
    } = require('../../controllers/moderator/account.controller')
const { addTour, editTour, updateTour, deleteTour, listTour, detailTour, listBillTour, deleteBillTour } = require('../../controllers/moderator/tour.controller')
const { verifyToken, isModerator } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../middlewares/uploadFile.middleware')
const router = express.Router()

router.post('/add-tour', [verifyToken, isModerator, upload.array('photo')], addTour)
router.get('/edit-tour/:tourID',[verifyToken, isModerator], editTour)
router.patch('/update-tour/:tourID', [verifyToken, isModerator, upload.array('photo')], updateTour)
router.delete('/delete-tour/:tourID', [verifyToken, isModerator], deleteTour)
router.get('/list-tour', [verifyToken, isModerator], listTour)
router.get('/detail-tour/:tourID', [verifyToken, isModerator], detailTour)

//bill tour
router.get('/list-bill-tour', [verifyToken, isModerator],listBillTour)
router.patch('/delete-bill-tour/:billTourID', [verifyToken, isModerator], deleteBillTour)


module.exports = router