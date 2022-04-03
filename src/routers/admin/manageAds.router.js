const express = require('express');
const { addAds, viewAds, editAds, updateAds, listTourAds, deleteTourAds, showTourAds, listRoomAds, deleteRoomAds, showRoomAds } = require('../../controllers/admin/manageAds.controller');
const { verifyToken, isAdmin } = require('../../middlewares/jwt.middleware');
const router = express.Router()

router.post('/add-ads',[verifyToken, isAdmin], addAds)
router.get('/view-ads', [verifyToken, isAdmin], viewAds)
router.get('/edit-ads', [verifyToken, isAdmin], editAds)
router.patch('/update-ads',[verifyToken, isAdmin], updateAds)

//ads tour
router.get('/list-tour-ads',[verifyToken, isAdmin], listTourAds)
router.delete('/delete-tour-ads/:tourAdsID',[verifyToken, isAdmin], deleteTourAds)
router.get('/show-tour-ads',[verifyToken, isAdmin], showTourAds)

//ads hotel
router.get('/list-hotel-room-ads',[verifyToken, isAdmin], listRoomAds)
router.delete('/delete-hotel-room-ads/:roomAdsID',[verifyToken, isAdmin], deleteRoomAds)
router.get('/show-hotel-room-ads',[verifyToken, isAdmin], showRoomAds)

module.exports = router;