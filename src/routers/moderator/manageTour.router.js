const express = require('express')
const { addTour, editTour, updateTour, deleteTour, listTour, detailTour, listBillTour, searchTour, filterTour } = require('../../controllers/moderator/tour.controller')
const { verifyToken, isModerator } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../middlewares/uploadFile.middleware')
const router = express.Router()

router.post('/add-tour', [verifyToken, isModerator, upload.array('picture')], addTour)
router.get('/edit-tour/:slug',[verifyToken, isModerator], editTour)
router.patch('/update-tour/:slug', [verifyToken, isModerator, upload.array('picture')], updateTour)
//router.patch('/delete-tour/:slug', [verifyToken, isModerator], deleteTour)
router.get('/list-tour', [verifyToken, isModerator], listTour)
router.get('/detail-tour/:slug', [verifyToken, isModerator], detailTour)

//bill tour
router.get('/list-bill-tour', [verifyToken, isModerator],listBillTour) //chưa có bill để test
//router.patch('/delete-bill-tour/:billTourID', [verifyToken, isModerator], deleteBillTour) // chưa test, xóa mềm

//search tour, filter price
router.get('/search', [verifyToken,isModerator], searchTour)
router.get('/filter-tour', [verifyToken, isModerator], filterTour)

module.exports = router