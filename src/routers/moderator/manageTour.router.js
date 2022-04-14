const express = require('express')
const { addTour, editTour, updateTour, deleteTour, listTour, detailTour, listBillTour, searchTour,
     filterTour, addTourCustom, viewAndAddTourCustom, viewListTourCustomToUser, viewListCustomTour,
      viewDetailCustomTour, paymentAdsTour, successAdsTour, cancelAdsTour, schedule } = require('../../controllers/moderator/tour.controller')
const { verifyToken, isModerator } = require('../../middlewares/jwt.middleware')
const { upload } = require('../../util/uploadFile.middleware')
const router = express.Router()

router.post('/add-tour', [verifyToken, isModerator, upload.array('picture')], addTour)
router.get('/edit-tour/:slug',[verifyToken, isModerator], editTour)
router.patch('/update-tour/:slug', [verifyToken, isModerator], updateTour)
//router.patch('/delete-tour/:slug', [verifyToken, isModerator], deleteTour)
router.get('/list-tour', [verifyToken, isModerator], listTour)
router.get('/detail-tour/:slug', [verifyToken, isModerator], detailTour)
router.get('/schedule', [verifyToken,isModerator], schedule) // thieu lich bat dau cho custom tour va fix startdate

//bill tour
router.get('/list-bill-tour', [verifyToken, isModerator],listBillTour)

//search tour, filter price
router.get('/search', [verifyToken,isModerator], searchTour)
router.get('/filter-tour', [verifyToken, isModerator], filterTour)


//tour custom
router.get('/view-list-tour-custom-to-user', [verifyToken,isModerator], viewListTourCustomToUser)
router.get('/view-tour-custom-and-add/:tourDraftID', [verifyToken,isModerator], viewAndAddTourCustom)
router.post('/add-tour-custom/:tourDraftID', [verifyToken, isModerator, upload.array('picture')], addTourCustom)
router.get('/view-list-custom-tour', [verifyToken,isModerator], viewListCustomTour)
router.get('/view-detail-custom-tour/:slug', [verifyToken,isModerator], viewDetailCustomTour)

//book ads
router.get('/payment-ads-tour', [verifyToken, isModerator], paymentAdsTour )
router.get('/success-ads-tour/:tourID', [verifyToken,isModerator], successAdsTour)
router.get('/cancel-ads-tour', [verifyToken, isModerator], cancelAdsTour )


module.exports = router